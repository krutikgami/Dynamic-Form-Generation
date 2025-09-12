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

                await formRepo.createAccessControl(
                    userIds.map(uid => ({ formId: id, userId: uid, role: 'USER' })),
                    tx
                )

                await formRepo.createFormAnalytics({ formId: id }, tx)

                return publishedForm
            })
        } catch (error) {
            console.error('Error in FormService.publishForm', error);
            throw error;
        }
    } 
    
    async getFormsByIdService(id){
        try {
            if(!id){
                throw new Error('UnAuthorized Access')
            }
            const isExists = await userRepo.findUSerExists({id});
            if(!isExists){
                throw new Error('User not Found')
            }
            return formRepo.getFormsById(id);
        } catch (error) {
            console.error('Error in FormService.getFormsByIdService', error);
            throw error;
        }
    }

}