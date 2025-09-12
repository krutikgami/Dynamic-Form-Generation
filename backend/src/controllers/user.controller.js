import { UserService } from '../services/user.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js'
import {sendError,sendResponse} from '../utilities/response.js'

const userService = new UserService();

export const createUSer = async(req,res)=>{
    try {
        const userData = req.body;
        console.log(userData)
        const result = await userService.createUserService(userData);
        return sendResponse(res,STATUS_CODES.CREATED,true,'User Created SuccessFully',result)
    } catch (error) {
        console.error('Controller Error in Create User',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}