import { FormService } from '../services/form.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js';
import {sendError,sendResponse} from '../utilities/response.js'

const formService = new FormService();
export const createForm = async(req,res) =>{
    try {
     const formData = req.body;
     const result = await formService.createFormService(formData);
     return sendResponse(res, STATUS_CODES.CREATED, true, "Form created successfully", result);
    } catch (error) {
     console.error('Controller Error in Create Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const publishForm = async(req,res) => {
    try {
        const formData = req.body;
        const result = await formService.publishFormService(formData);
        return sendResponse(res, STATUS_CODES.OK, true, "Form Published successfully", result);
    } catch (error) {
     console.error('Controller Error in publish Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const getFormsById = async(req,res)=>{
    try {
        const {id} = req.body;
        const results =  await formService.getFormsByIdService(id);
        return sendResponse(res, STATUS_CODES.CREATED, true, "Forms fetched successfully", results);
    } catch (error) {
     console.error('Controller Error in getting Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}