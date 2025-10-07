import { FormService } from '../services/form.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js';
import {sendError,sendResponse} from '../utilities/response.js'
import {getForms,adminFormManagerRes,adminFormAnalytics, adminFormRenderer} from '../resources/UserResources.js'
import {createUserRole, getFormsService} from '../utilities/constants/codeConstants.js'
const formService = new FormService();
export const createForm = async(req,res) =>{
    try {
     const result = await formService.createFormService(req.body,req?.user?.id);
     return sendResponse(res, STATUS_CODES.CREATED, true, "Form created successfully", result);
    } catch (error) {
     console.error('Controller Error in Create Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const publishForm = async(req,res) => {
    try {
        const result = await formService.publishFormService(req.body);
        return sendResponse(res, STATUS_CODES.OK, true, "Form Published successfully", result);
    } catch (error) {
     console.error('Controller Error in publish Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const getFormsById = async(req,res)=>{
    try {
        const {id,role} = req?.user;
        const{q,resp,userId,page,limit} = req.query;
        const {results,meta} =  await formService.getFormsByIdService(id,role,q,userId,page,limit);
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        let data;
        if(role === createUserRole){
            if(resp === getFormsService.manager){
                data = results.map(form => adminFormManagerRes(form))
            }else if(resp === getFormsService.analytics){
                data = results.map(form => adminFormAnalytics(form))
            }else if (resp === getFormsService.renderer) {
                data = results.map(form => adminFormRenderer(form))
            }else{
                data = results
            }
        }else{
            data = results.map(form => getForms(form));
        }
        return sendResponse(res, STATUS_CODES.OK, true, "Forms fetched successfully", data, meta);
    } catch (error) {
        console.error('Controller Error in getting Form',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const updateForm = async(req,res)=>{
    try {
        const updatedForm = await formService.updateFormService(req.body);
        return sendResponse(res, STATUS_CODES.OK, true, "Forms Updated successfully", updatedForm);
    } catch (error) {
     console.error('Controller Error in updating Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const formSubmissions = async(req,res)=>{
    try {
        const userId = req?.user?.id;
        const result = await formService.createFormSubmissionsService(req.body,userId);
        return sendResponse(res,STATUS_CODES.CREATED,true,"Submission entry created successfully",result);
    } catch (error) {
        console.error('Controller Error in formSubmissions',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const viewForm = async(req,res)=>{
    try {
        const userId = req?.user?.id;
        const {formId} = req.body;
        console.log(userId);
        await formService.viewFormSubmissionService({formId,userId});
        return sendResponse(res,STATUS_CODES.OK,true,"Form Viewed Successfully",null);
    } catch (error) {
        console.error('Controller Error in viewForm',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}


export const getFormSubmissionData = async(req,res)=>{
    try {
        const {formId,status,email,page,limit} = req.body;
        const userId = req.user.id
        const role = req.user.role
        const {response,meta} = await formService.getFormSubmissionService(formId,userId,role,status,email,page,limit);
        return sendResponse(res,STATUS_CODES.OK,true,"Form Data Fetched Successfully",response,meta);
    } catch (error) {
        console.error('Controller Error in getFormSubmissionData',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const updateUserSubmissionData = async(req,res)=>{
    try {
        let userId;
        const {formId,data} = req.body;
        const role = req?.user.role
        if(role === createUserRole){
            userId = req.body.userId
        }else{
            userId = req?.user?.id;
        }
        const updatedUser = await formService.updateUserDataService(formId,data,userId,role);
        return sendResponse(res,STATUS_CODES.OK,true,"User Data Updated SuccessFully",updatedUser);
    } catch (error) {
        console.error('Controller Error in updateUserSubmissionData',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const getFormSchema = async(req,res)=>{
    try {
        const {formId} = req.body;
        const getSchema = await formService.getFormSchemaByIdService(formId)
        return sendResponse(res,STATUS_CODES.OK,true,"Form Schema Fetched Successfully",getSchema);
    } catch (error) {
        console.error('Controller Error in getFormSchema',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const deleteUserSubmission = async(req,res)=>{
    try {
        const {formId,userId} = req.body;
        await formService.deleteUserSubmissionService(formId,userId);
        return sendResponse(res,STATUS_CODES.OK,true,"User Submission Deleted Successfully",null);
    } catch (error) {
         console.error('Controller Error in deleteUserSubmission',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const deleteAdminForm = async(req,res)=>{
    try {
        const {formId} = req.body;
        const deletedForm = await formService.deleteFormByIdService(formId);
        return sendResponse(res,STATUS_CODES.OK,true,"Form Deleted Successfully",null);
    } catch (error) {
        console.error('Controller Error in deleteAdminForm',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}