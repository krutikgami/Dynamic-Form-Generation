import {FormRepository} from '../repositories/form.repository.js'
import { UserRepository } from '../repositories/user.repository.js';
import { prisma } from '../utilities/prisma.constants.js';
import {status,role, createUserRole, user} from '../utilities/constants/codeConstants.js'
import { email } from 'zod';
import { en } from 'zod/v4/locales';
const formRepo = new FormRepository();
const userRepo = new UserRepository();

export class FormService{
    async createFormService(formData,userId){
        try {
            const {title,description,fields} = formData;
            
            const isUserIdExists = await userRepo.findUSerExists({id: userId});

            if(!isUserIdExists){
                throw new Error('User does not exists')
            }

            return await formRepo.createForm({
                title,
                description,
                schema : fields,
                status,
                userId,
                createdById: userId
            })
        } catch (error) {
            console.error('Error in FormService.createForm',error);
            throw error;
        }
    }

    async publishFormService(formData) {
        try {
            const { maxSubmissions, startDate, endDate, id, userIds,status } = formData;

            const start = startDate === null ? null : new Date(startDate);
            const end = startDate === null ? null :  new Date(endDate);

            const isFormExist = await formRepo.getFormExists(id);
            if (!isFormExist) {
                throw new Error('Form does not exist');
            }

            return await prisma.$transaction(async (tx) => {
                const publishedForm = await formRepo.publishForm(
                    {
                    id,
                    maxSubmissions: maxSubmissions || null,
                    startDate: start,
                    endDate: end,
                    status
                    },
                    tx
                )

                const existingUserIds = isFormExist.accessControls.map(a => a.userId);

                const newUserIds = userIds.filter(uid => !existingUserIds.includes(uid));

                if (newUserIds.length > 0) {
                    await formRepo.createAccessControl(
                        newUserIds.map(uid => ({ formId: id, userId: uid, role })),
                        tx
                    );
                }

                const removeUserIds = existingUserIds.filter((uid) => !userIds.includes(uid));1
                console.log(removeUserIds);

                if (removeUserIds.length > 0) {
                    for (const uid of removeUserIds) {
                        await formRepo.deleteAccessControlByUserID({ formId: id, userId: uid }, tx);
                    }
                }

                const isExists  = await formRepo.getFormAnalyticsById({formId : id},tx);

                if(!isExists){
                    await formRepo.createFormAnalytics({ formId: id }, tx)
                }
                
                return publishedForm
            })
        } catch (error) {
            console.error('Error in FormService.publishForm', error);
            throw error;
        }
    } 
    
    async getFormsByIdService(id,role,q,selectUserId){
        try {
            if(!id){
                throw new Error('UnAuthorized Access')
            }
            const isExists = await userRepo.findUSerExists({id});
            if(!isExists){
                throw new Error('User not Found')
            }
            
        let results= await formRepo.getFormsById(id,role,q);
            if (role === createUserRole && selectUserId) {
                results = results.filter((entry) =>
                    entry.accessControls.some(ac => ac.userId === selectUserId)
                );
            }
        return results;
        } catch (error) {
            console.error('Error in FormService.getFormsByIdService', error);
            throw error;
        }
    }

    async updateFormService(formData){
        try {
            const {id,title,description,fields,userId} = formData;

            const isFormExists = await formRepo.getFormExists(id);
            if(!isFormExists){
                throw new Error('Form Doesn`t exists')
            }
            return await formRepo.updateForm({
                id,
                title,
                description,
                schema : fields,
                updatedById : userId
            });
        } catch (error) {
            console.error('Error in FormService.updateFormService', error);
            throw error;
        }
    }

    async createFormSubmissionsService(userData,userId){
        try {
            const {formId,data} = userData;

            const alreadySubmitted = await formRepo.getFormSubmissionByUserId({userId,formId});
            if(alreadySubmitted){
                throw new Error('Data is already Submitted!!');
            }
            const userExists = await userRepo.findUSerExists({id : userId})
            if(!userExists){
                throw new Error('User doesn`t Exists or Deleted')
            }
            const id = formId
            const formExists = await formRepo.getFormExists(id);
            if(!formExists){
                throw new Error('Form doesn`t Exists');
            }
            const maxSubmissionValue = formExists.maxSubmissions;
            if (maxSubmissionValue !== null) {
                if (formExists.submissionCount >= maxSubmissionValue) {
                    throw new Error('Form Max Submission limit reached!!');
                }
            }

            const nowDate = new Date();
            nowDate.setHours(0, 0, 0, 0);

            if (formExists.endDate) {
                const endDate = new Date(formExists.endDate);
                endDate.setHours(0, 0, 0, 0);

                if (nowDate.getTime() > endDate.getTime()) {
                    throw new Error('Form Expired!!');
                }
            }

            if (formExists.startDate) {
                const startDate = new Date(formExists.startDate);
                startDate.setHours(0, 0, 0, 0);

                if (nowDate.getTime() < startDate.getTime()) {
                    throw new Error('Form Filling has not Started Yet');
                }
            }


            return await prisma.$transaction(async (tx)=>{
                const formSubmission = await formRepo.createFormSubmission({userData,userId},tx)
                await formRepo.updateFormCount({formId, data : {submissionCount : {increment : 1}}},tx);
                await formRepo.updateFormAnalytics({formId , data : {totalSubmissions : {increment : 1},lastSubmittedAt : new Date()}},tx)
                return formSubmission;
            })
        } catch (error) {
            console.error('Error in FormService.createFormSubmissionsService', error);
            throw error;
        }
    }

    async viewFormSubmissionService({formId,userId}){
        try {
            if(!formId){
                throw new Error('FormID is required')
            }
            const userExists = await userRepo.findUSerExists({id : userId})
            if(!userExists){
                throw new Error('Invalid User')
            }
            const isFormViewed = await formRepo.getFormViewed(formId,userId)
            if(!isFormViewed){
                const id = formId
                const formExists = await formRepo.getFormExists(id);
                if(!formExists){
                    throw new Error('Invalid Form Exists');
                }
                if(formExists.userId !== userId){
                    return await prisma.$transaction(async(tx)=>{
                        const viewedForm = await formRepo.createFormView(formId,userId,tx)
                        await formRepo.updateFormAnalytics({formId , data : {totalViews : {increment : 1},lastViewedAt : new Date()}},tx)
                        return viewedForm;
                    })
                }
            }
        } catch (error) {
            console.error('Error in FormService.viewFormSubmissionService', error);
            throw error;
        }
    }

    async getFormSubmissionService(formId,userId,role,status,email){
        try {
            const formExists = await formRepo.getFormExists(formId);
            if(!formExists){
                throw new Error('Form Doesn`t exists')
            }
            let submissionWhere = {};
            if (role === user && userId) {
                submissionWhere = { userId };
            }
            const result = await formRepo.getFormSubmissionData(formId,submissionWhere)
            console.log(result)
            let submissions;
            if(status === 'viewData'){
                console.log(result.schema)
                 const matchedSubmission = result.submissions.find(
                    (sub) => sub.user?.email === email
                );

                if (matchedSubmission) {
                    submissions = {
                        data: matchedSubmission.data
                    };
                } else {
                    submissions = null;
                }
            }else{
                submissions = result.submissions.map((submission)=>{
                    return {
                        email : submission.user.email,
                        name : submission.user.name,
                        deleted_at : submission.deleted_at,
                        created_at : submission.created_at
                    }
                })
            }

            const response = {
                id: result.id,
                title: result.title,
                description: result.description,
                submissions,
            };

            if (status === "viewData") {
            response.schema = result.schema;
            }

            return response;
        } catch (error) {
            console.error('Error in FormService.getFormSubmissionService', error);
            throw error;
        }
    }

    async updateUserDataService(formId,data,userId,role){
        try {
            const submissionExist = await formRepo.getFormSubmissionData(formId,{userId});
            if(!submissionExist){
                throw new Error('Submission Doesn`t Exist You can not Update details')
            }
            console.log(data)
            console.log(userId)
            let userExists ;
            if(role === createUserRole){
                userExists = await userRepo.findUSerExists({email : userId})
            }
            // const existingSubmission = submissionExist.submissions[0];
            // const existingKeys = Object.keys(existingSubmission.data[0] || {}); 
            // const newKeys = Object.keys(data[0] || {});

            // const missingKeys = existingKeys.filter(k => !newKeys.includes(k));
            // const extraKeys = newKeys.filter(k => !existingKeys.includes(k));

            // const keyMismatch = existingKeys.some((k, idx) => k !== newKeys[idx]);

            // if (missingKeys.length > 0 || extraKeys.length > 0 || keyMismatch) {
            //     throw new Error("Invalid field data: submission schema mismatch");
            // }

            const userIdToUpdate = userExists ? userExists.id : userId
            return await formRepo.updateFormSubmission(formId, userIdToUpdate, data);
        } catch (error) {
            console.error('Error in FormService.updateUserDataService', error);
            throw error;
        }
    }

    async getFormSchemaByIdService(formId){
        try {
            return await formRepo.getFormSchemaById(formId)
        } catch (error) {
            console.error('Error in FormService.getFormSchemaById', error);
            throw error;
        }
    }

    async deleteUserSubmissionService(formId,userId){
        try {
            let userIdToUpdate = await userRepo.findUSerExists({email : userId})
            if(!userIdToUpdate){
                throw new Error('User Does not exist')
            }
            
            return await prisma.$transaction(async (tx)=>{
                const response =  await formRepo.deleteUserSubmission(formId,userIdToUpdate.id,tx);
                await formRepo.updateFormCount({formId, data : {submissionCount : {decrement : 1}}},tx);
                await formRepo.updateFormAnalytics({formId , data : {totalSubmissions : {decrement : 1},totalViews : {decrement : 1}}},tx)
                await formRepo.deleteFormViews(formId,userIdToUpdate.id,tx);
                return response;
            })
        } catch (error) {
             console.error('Error in FormService.deleteUserSubmissionService', error);
            throw error;
        }
    }
}