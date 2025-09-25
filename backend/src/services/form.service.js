import {FormRepository} from '../repositories/form.repository.js'
import { UserRepository } from '../repositories/user.repository.js';
import { prisma } from '../utilities/prisma.constants.js';

const formRepo = new FormRepository();
const userRepo = new UserRepository();

export class FormService{
    async createFormService(formData){
        try {
            const {title,description,fields,userId} = formData;
            if(!title || title.trim().length === 0){
                throw new Error('Form title is required')
            }

            if(!Array.isArray(fields) ||fields.length === 0){
                throw new Error('Atleast one Field is required')
            }

            if(!userId){
                throw new Error('User Id is required')
            }
            
            const isUserIdExists = await userRepo.findUSerExists({id: userId});

            if(!isUserIdExists){
                throw new Error('User does not exists')
            }

            return await formRepo.createForm({
                title,
                description,
                schema : fields,
                status : "DRAFT",
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

            if (!id) {
            throw new Error('Invalid Request to publish Form');
            }

            if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('User ids for access control is required');
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime())) {
                throw new Error('Invalid startDate format');
            }
            if (isNaN(end.getTime())) {
                throw new Error('Invalid endDate format');
            }

            let maxSubs = null;
            if (maxSubmissions !== null && maxSubmissions !== undefined) {
                if (Number.isInteger(maxSubmissions)) {
                    maxSubs = maxSubmissions;
                } else {
                    throw new Error('maxSubmissions must be an integer or null');
                }
            }

            const isFormExist = await formRepo.getFormExists(id);
            if (!isFormExist) {
                throw new Error('Form does not exist');
            }

            return await prisma.$transaction(async (tx) => {
                const publishedForm = await formRepo.publishForm(
                    {
                    id,
                    maxSubmissions: maxSubs,
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
                    newUserIds.map(uid => ({ formId: id, userId: uid, role: 'USER' })),
                    tx
                );
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
    
    async getFormsByIdService(id,role){
        try {
            if(!id){
                throw new Error('UnAuthorized Access')
            }
            const isExists = await userRepo.findUSerExists({id});
            if(!isExists){
                throw new Error('User not Found')
            }
            return formRepo.getFormsById(id,role);
        } catch (error) {
            console.error('Error in FormService.getFormsByIdService', error);
            throw error;
        }
    }

    async updateFormService(formData){
        try {
            const {id,title,description,fields,userId} = formData;
            if(!title || title.trim().length === 0){
                throw new Error('Form title is required')
            }

            if(!Array.isArray(fields) ||fields.length === 0){
                throw new Error('Atleast one Field is required')
            }

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
            if(!formId){
                throw new Error('Invalid form submission')
            }
            if(Array.isArray(data) && data.length === 0){
                throw new Error('Please Fill the Form')
            }
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
                if(!formExists.userId === userId){
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

    // async updateDetailsFormService(updateDetails){
    //     try {
    //         const {id,userId,status,maxSubmissions,endDate,startDate,userIds} = updateDetails;
    //         const isFormExists = await formRepo.getFormExists(id)
    //         if(!isFormExists){
    //             throw new Error('Form Doesn`t exists')
    //         }
    //         const isuserExists = await userRepo.findUSerExists({id : userId});
    //         if(!isuserExists){
    //             throw new Error('UnAuthorised Access')
    //         }
    //         if(!Number.isInteger(maxSubmissions)){
    //             throw new Error('MaxSubmissions must be an Integer')
    //         }

    //         const start = new Date(startDate);
    //         const end = new Date(endDate);

    //         if (isNaN(start.getTime())) {
    //             throw new Error('Invalid startDate format');
    //         }
    //         if (isNaN(end.getTime())) {
    //             throw new Error('Invalid endDate format');
    //         }

    //         return await prisma.$transaction(async(tx)=>{
    //             const updateFormDetails  = await formRepo.updateFormDetails(updateDetails,tx)

    //             await formRepo.deleteAccessControlUserId({formId : id},tx)

    //             await formRepo.createAccessControl(
    //                 userIds.map(uid => ({ formId: id, userId: uid, role: 'USER' })),
    //                 tx
    //             )

    //             return updateFormDetails;
    //         })
    //     } catch (error) {
    //         console.error('Error in FormService.updateDetails',error);
    //         throw error;
    //     }
    // }

}