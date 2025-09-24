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
        const {id,role} = req?.user;
        const results =  await formService.getFormsByIdService(id,role);
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        return sendResponse(res, STATUS_CODES.OK, true, "Forms fetched successfully", results);
    } catch (error) {
        console.error('Controller Error in getting Form',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const updateForm = async(req,res)=>{
    try {
        const formData = req.body;
        const updatedForm = await formService.updateFormService(formData);
        return sendResponse(res, STATUS_CODES.OK, true, "Forms Updated successfully", updatedForm);
    } catch (error) {
     console.error('Controller Error in updating Form',error)
     return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

// export const updateFormDetails = async(req,res)=>{
//     try {
//         const updateDetails = req.body;
//         const result = await formService.updateDetailsFormService(updateDetails);
//         return sendResponse(res,STATUS_CODES.OK,true,'Form Details update successfully',result);
//     } catch (error) {
//         console.error('Controller Error in updateFormDetails',error)
//         return sendError(res,STATUS_CODES.BADREQUEST,false,error.message);
//     }
// }