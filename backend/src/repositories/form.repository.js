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
            isPublic : formData.isPublic,
            isEditable : formData.isEditable,
            submissionMessage : formData.submissionMessage ? formData.submissionMessage.trim() : null,
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
            id,
            deleted_at : null
          },
          include:{
            accessControls : true,
            excludedUsers : true
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

    async createExcludedUser(formData,client=tx){
      try {
        return await client.excludedUser.create({
          data : {
            formId: formData[0].formId,
            userId : formData[0].userId,
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.createExcludedUser',error)
        throw new Error('Database error while creating Excluded User')
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
    
    async getFormsById(id, role, q, skip, limit, selectUserId) {
      try {
        let where = { deleted_at: null };

        if (role === createUserRole) {
          where.userId = id;
          if (q && q !== 'All') where.status = q;

          if (selectUserId) {
            where.OR = [
              { isPublic: true, excludedUsers: { none: { userId: selectUserId } } },
              { accessControls: { some: { userId: selectUserId } } },
            ];
          }
        } else {
          where.status = { notIn: STATUSNOTIN };
          where.OR = [
            { accessControls: { some: { userId: id } } },
            { isPublic: true, excludedUsers: { none: { userId: id } } },
          ];
        }

        return await prisma.form.findMany({
          where,
          include: {
            accessControls: { select: { userId: true, formId: true, user: { select: { email: true } } } },
            excludedUsers: { select: { userId: true, formId: true, user: { select: { email: true } } } },
            analytics: { select: { totalViews: true, totalSubmissions: true } },
          },
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
        });
      } catch (error) {
        console.error('DB Error in FormRepository.getFormsById', error);
        throw new Error('Database error while getting Forms');
      }
    }


   async countForms(id, role, q, selectUserId) {
      try {
        let where = { deleted_at: null };

        if (role === createUserRole) {
          where.userId = id;
          if (q && q !== 'All') where.status = q;
          if (selectUserId) {
            where.OR = [
              {
                isPublic: true,
                excludedUsers: { none: { userId: selectUserId } },
              },
              {
                accessControls: { some: { userId: selectUserId } },
              },
            ];
          }
        } else {
          where.status = { notIn: STATUSNOTIN };
          where.OR = [
            { accessControls: { some: { userId: id } } },
            { isPublic: true, excludedUsers: { none: { userId: id } } },
          ];
        }

        return await prisma.form.count({ where });
      } catch (error) {
        console.error('DB Error in FormRepository.countForms', error);
        throw new Error('Database error while counting Forms');
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

    async deleteAccessControlByID({where},client=tx){
      try {
        return await client.accessControl.deleteMany({
          where
        })
      } catch (error) {
        console.error('DB Error in FormRepository.updateAccessControl',error)
        throw new Error('Database error while deleting AccessControl Forms')
      }
    }

    async deleteExcludedUserByID({where},client=tx){
      try {
        return await client.excludedUser.deleteMany({
          where
        })
      } catch (error) {
        console.error('DB Error in FormRepository.deleteExcludedUserByUserID',error)
        throw new Error('Database error while deleting exclude user access Forms')
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

    async updateFormCount({formId,data},client=tx){
      try {
        return await client.form.update({
          where : {
            id : formId
          },
          ...(data ? {data} :{}) 
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
            userId,
            deleted_at : null
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormViewed',error)
        throw new Error('Database error while getFormViewed')
      }
    }

    async getFormSubmissionData(formId, submissionWhere = {}, skip , limit) {
      try {
        const hasSubmissionWhere = Object.keys(submissionWhere || {}).length > 0;
        let baseQuery = {
          where: { id: formId },
          include: {
            submissions: {
              where: submissionWhere,
              select: {
                id: true,
                formId: true,
                userId: true,
                data: true,
                deleted_at: true,
                created_at: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        };

        if (hasSubmissionWhere) {
          const safeSkip = Number.isFinite(skip) ? parseInt(skip) : 0;
          const safeLimit = Number.isFinite(limit) ? parseInt(limit) : 1;
          baseQuery.include.submissions.skip = safeSkip;
          baseQuery.include.submissions.take = safeLimit;
        }
        return await prisma.form.findUnique(baseQuery);
      } catch (error) {
        console.error("DB Error in FormRepository.getFormSubmissionData", error);
        throw new Error("Database error while getFormSubmissionData");
      }
    }

    async countFormSubmissions(formId,submissionWhere={}){
      try {
        return await prisma.submission.count({
          where : {
            formId,
            ...submissionWhere
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.countFormSubmissions',error)
        throw new Error('Database error while countFormSubmissions')
      }
    }

    async updateFormSubmission(formId,userId,data){
      try {
        const submission = await prisma.submission.findFirst({
          where: {
            formId,
            userId,
            deleted_at: null
          }
        });

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
            schema : true,
            submissionCount : true,
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.getFormSchemaById',error)
        throw new Error('Database error while getFormSchemaById')
      }
    }

    async deleteUserSubmission(formId,userId,client=tx){
      try {
        await client.submission.updateMany({
          where: { formId, userId, deleted_at: null },
          data: { deleted_at: new Date() },
        });
    return { success: true };
      } catch (error) {
        console.error('DB Error in FormRepository.deleteUserSubmission',error)
        throw new Error('Database error while deleteUserSubmission')
      }
    }

    async deleteFormViews(formId,userId,client=tx){
      try {
        return await client.formView.updateMany({
          where : {
            formId,
            userId
          },
          data :{
            deleted_at : new Date()
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.deleteFormViews',error)
        throw new Error('Database error while deleteFormViews')
      }
    }

    async deleteFormById(formId){
      try {
        return await prisma.form.update({
          where :{
            id : formId,
          },
          data :{
            deleted_at : new Date()
          }
        })
      } catch (error) {
        console.error('DB Error in FormRepository.deleteFormById',error)
        throw new Error('Database error while deleteFormById')
      }
    }
}