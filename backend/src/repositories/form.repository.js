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
    
    async getFormsById(id){
      try {
        return await prisma.form.findMany({
          where :{
            userId : id
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormsById',error)
        throw new Error('Database error while getting Forms')
      }
    }
}