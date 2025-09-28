import {FormRepository} from '../repositories/form.repository.js'
import { UserRepository } from '../repositories/user.repository.js';
import { prisma } from '../utilities/prisma.constants.js';
import {status,role} from '../utilities/constants/codeConstants.js'
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

            const start = new Date(startDate);
            const end = new Date(endDate);

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
    
    async getFormsByIdService(id,role,q){
        try {
            if(!id){
                throw new Error('UnAuthorized Access')
            }
            const isExists = await userRepo.findUSerExists({id});
            if(!isExists){
                throw new Error('User not Found')
            }
            return formRepo.getFormsById(id,role,q);
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
                await formRepo.updateFormCount({formId},tx);
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

    async getFormSubmissionService(formId){
        try {
            const formExists = await formRepo.getFormExists(formId);
            if(!formExists){
                throw new Error('Form Doesn`t exists')
            }
            const result = await formRepo.getFormSubmissionData(formId)
            console.log(result)
            const tableHeadings = ['ID']

            result.schema.map((col,idx)=>{
                if (!col?.name.startsWith('button')) {
                    tableHeadings.push(col.label)
                }
            })
            const submissions = result.submissions.map((submission) => {
                const row = {
                    id: submission.user.email
                };
                result.schema.forEach((col) => {
                    if (!col?.name.startsWith('button')) {
                        const label = col.label;
                        const fieldData = submission.data[0]?.[label] || null;
                        row[label] = fieldData;
                    }
                });

             return row;
            });

        return {
            title: result.title,
            description: result.description,
            tableHeadings,
            submissions
        };
        } catch (error) {
            console.error('Error in FormService.getFormSubmissionService', error);
            throw error;
        }
    }
}