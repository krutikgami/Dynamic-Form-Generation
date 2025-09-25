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
    
    async getFormsById(id,role){
      try {
        if(role==='ADMIN'){
          return await prisma.form.findMany({
            where :{
              userId : id
            },
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
              }
            }
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
                notIn : ['DRAFT','INACTIVE']
              } 
            },
              include: { accessControls: true }
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

    async deleteAccessControlByFormId({formId},client=tx){
      try {
        return await client.accessControl.deleteMany({
          where :{
            formId
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
            formId
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

    // async updateFormDetails(updateDetails,client=tx){
    //   try {
    //     const {id,status,maxSubmissions,endDate,startDate} = updateDetails;
    //     return await client.form.update({
    //       where : {
    //        id
    //       },
    //       data :{
    //        startDate,
    //        endDate,
    //        maxSubmissions,
    //        status
    //       }
    //     })
    //   } catch (error) {
    //     console.error('DB Error in FormRepository.updateFormDetails',error)
    //     throw new Error('Database error while updating form details Forms')
    //   }
    // }

}