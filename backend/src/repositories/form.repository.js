import { createUserRole, STATUSNOTIN } from '../utilities/constants/codeConstants.js'
import {prisma} from '../utilities/prisma.constants.js'

export class FormRepository{
    async createForm(formData){
      try { 
        return await prisma.form.create({
          data : formData
        }
        )
      } catch (error) {
        console.error('DB Error in FormRepository.createForm',error)
        throw new Error('Database error while creating form')
      }
    }

    async publishForm(formData,client=tx){
      try {
        return await client.form.update({
          where :{
            id : formData.id
          },
          data :{
            maxSubmissions : formData.maxSubmissions,
            status : formData.status,
            startDate : formData.startDate,
            endDate : formData.endDate
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.publishForm',error)
        throw new Error('Database error while Publishing form')
      }
    }

    async getFormExists(id){
      try {
        return await prisma.form.findUnique({
          where:{
            id
          },
          include:{
            accessControls : true
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getForm',error)
        throw new Error('Database error while getting form')
      }
    }

    async createAccessControl(formData,client=tx){
      try {
        console.log(formData)
        return await client.accessControl.create({
          data : {
            formId: formData[0].formId,
            userId : formData[0].userId,
            role : formData[0].role
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.createAccessControl',error)
        throw new Error('Database error while creating access control form')
      }
    }

    async createFormAnalytics(formData,client=tx){
      try {
        return await client.formAnalytics.create({
          data: formData
        })
      } catch (error) {
        console.error('DB Error in FormRepository.createFormAnalytics',error)
        throw new Error('Database error while creating Form Analytics')
      }
    }
    
    async getFormsById(id,role,q){
      try {
        if(role === createUserRole){
          let where = q !== 'All' ? { userId : id,status: q} : { userId : id}
          return await prisma.form.findMany({
            where,
            include:{
              accessControls : {
                select :{
                  userId : true,
                  formId: true,
                  user :{
                    select :{
                      email : true
                    }
                  }
                }
              },
              analytics :{
                select :{
                  totalViews : true,
                  totalSubmissions : true
                }
              }
            },
          })
        }
        const formIds = await prisma.accessControl.findMany({
          where : {
            userId : id
          },
          select :{
            formId : true
          }
        })

        const formattedFormIds = formIds.map((id)=>id.formId)

        const forms = await Promise.all(
          formattedFormIds.map(ids => 
            prisma.form.findMany({
              where: { id : ids,
                status : {
                notIn : STATUSNOTIN
              } 
            },
              include: { 
                accessControls: {
                  where :{
                    userId : id 
                  }
                } 
              }
            })
          )
        );
        const flattenForms = forms.flat();
        return flattenForms;
      } catch (error) {
        console.error('DB Error in FormRepository.getFormsById',error)
        throw new Error('Database error while getting Forms')
      }
    }
    
    async getFormAnalyticsById({formId},client=tx){
      try {
        return await client.formAnalytics.findFirst({
          where :{
            formId
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormAnalyticsById',error)
        throw new Error('Database error while getting Forms analytics')
      }
    }

    async updateForm(formData){
      try {
        const {id,title,schema,description,updatedById} = formData;
        return await prisma.form.update({
          where : {
            id
          },
          data:{
            title,
            description,
            schema,
            updatedById
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.updateForm',error)
        throw new Error('Database error while updating Form')
      }
    }

    async deleteAccessControlByUserID({formId,userId},client=tx){
      try {
        return await client.accessControl.deleteMany({
          where :{
            formId,
            userId
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.updateAccessControl',error)
        throw new Error('Database error while updating AccessControl Forms')
      }
    }

    async createFormSubmission({userData,userId},client=tx){
      try {
        const {formId,data} = userData;
        return await client.submission.create({
          data :{
            formId,
            userId,
            data
          }
        }) 
      } catch (error) {
        console.error('DB Error in FormRepository.createFormSubmission',error)
        throw new Error('Database error while createFormSubmission')
      }
    }

    async getFormSubmissionByUserId({userId,formId}){
      try {
        return await prisma.submission.findFirst({
          where : {
            userId,
            formId,
            deleted_at : null
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormSubmissionByUserId',error)
        throw new Error('Database error while getFormSubmissionByUserId')
      }
    }

    async updateFormCount({formId},client=tx){
      try {
        return await client.form.update({
          where : {
            id : formId
          },
          data : {
            submissionCount : {
              increment : 1
            }
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.updateFormCount',error)
        throw new Error('Database error while updateFormCount')
      }
    }

    async updateFormAnalytics({formId,data},client = tx){
      try {
        return await client.formAnalytics.update({
          where : {
            formId
          },
          ...(data ? {data} :{}) 
        })
      } catch (error) {
        console.error('DB Error in FormRepository.updateFormAnalytics',error)
        throw new Error('Database error while updateFormAnalytics')
      }
    }

    async createFormView(formId,userId,client=tx){
      try {
        return await client.formView.create({
          data:{
            formId,
            userId
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.createFormView',error)
        throw new Error('Database error while createFormView')
      }
    }

    async getFormViewed(formId,userId){
      try {
        return await prisma.formView.findFirst({
          where : {
            formId,
            userId
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormViewed',error)
        throw new Error('Database error while getFormViewed')
      }
    }

    async getFormSubmissionData(formId,submissionWhere={}){
      try {
        return await prisma.form.findUnique({
          where : {
            id : formId
          },
          include : {
            submissions : {
              where : submissionWhere,
              select : {
                id : true,
                formId : true,
                userId : true,
                data : true,
                deleted_at : true,
                created_at : true,
                user : {
                  select : {
                    name: true,
                    email : true
                  }
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormSubmissionData',error)
        throw new Error('Database error while getFormSubmissionData')
      }
    }

    async updateFormSubmission(formId,userId,data){
      try {
        console.log(formId)
        console.log(userId)
        const submission = await prisma.submission.findFirst({
          where: {
            formId,
            userId,
          }
        });

        console.log(submission)

      if (!submission) throw new Error("Submission not found");

      return await prisma.submission.update({
        where: { id: submission.id },
        data: { data: [data] }
      });
      } catch (error) {
        console.error('DB Error in FormRepository.updateFormSubmission',error)
        throw new Error('Database error while updateFormSubmission')
      }
    }

    async getFormSchemaById(formId){
      try {
        return await prisma.form.findUnique({
          where :{
            id : formId
          },
          select:{
            id : true,
            title : true,
            description : true,
            schema : true
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormSchemaById',error)
        throw new Error('Database error while getFormSchemaById')
      }
    }

    async deleteUserSubmission(formId,userId){
      try {
        await prisma.submission.updateMany({
          where: { formId, userId, deleted_at: null },
          data: { deleted_at: new Date() },
        });

      await prisma.form.update({
        where: { id: formId },
        data: {
          submissionCount: { decrement: 1 },
        },
      });

      await prisma.formAnalytics.update({
        where: { formId },
        data: {
          totalSubmissions: { decrement: 1 },
          totalViews: { decrement: 1 },
        },
      });

      await prisma.formView.deleteMany({
        where: { formId, userId },
      });

    return { success: true };
      } catch (error) {
        console.error('DB Error in FormRepository.deleteUserSubmission',error)
        throw new Error('Database error while deleteUserSubmission')
      }
    }
}