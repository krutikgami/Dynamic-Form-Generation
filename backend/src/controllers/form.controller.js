import { FormService } from '../services/form.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js';
import {sendError,sendResponse} from '../utilities/response.js'
import {getForms} from '../resources/UserResources.js'
import {createUserRole} from '../utilities/constants/codeConstants.js'
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
        const{q} = req.query;
        const results =  await formService.getFormsByIdService(id,role,q);
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        const data = role === createUserRole ? results : results.map(form => getForms(form));
        return sendResponse(res, STATUS_CODES.OK, true, "Forms fetched successfully", data);
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
        const {formId} = req.body;
        const result = await formService.getFormSubmissionService(formId);
        return sendResponse(res,STATUS_CODES.OK,true,"Form Data Fetched Successfully",result)
    } catch (error) {
        console.error('Controller Error in getFormSubmissionData',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}