import { UserService } from '../services/user.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js'
import {sendError,sendResponse} from '../utilities/response.js'
import {expiresIn,maxAge} from '../utilities/constants/codeConstants.js'
import jwt from 'jsonwebtoken'

const userService = new UserService();

export const createUSer = async(req,res)=>{
    try {
        const result = await userService.createUserService(req.body);
        return sendResponse(res,STATUS_CODES.CREATED,true,'User Created SuccessFully',result)
    } catch (error) {
        console.error('Controller Error in Create User',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const loginUser = async(req,res)=>{
    try {
        const validUser = await userService.loginUserService(req.body);
        const token = jwt.sign(
            {
                id: validUser.id,
                email : validUser.email,
                role : validUser.role,
                name : validUser.name
            },
            process.env.JWT_TOKEN,
            {expiresIn}
        )
        res.cookie('authToken',token,{
            httpOnly: true,
            secure : true,
            maxAge
        })
        res.cookie('authTokenClient',token,{
            httpOnly : false,
            secure : true,
            maxAge
        })
        return sendResponse(res,STATUS_CODES.OK,true,'User LoggedIn Successfully!') 
    } catch (error) {
        console.error('Controller Error in loginUser',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}

export const getEmailSearchByUSer=async(req,res)=>{
    try {
        const {q,role} = req.query;
        const results = await userService.getEmailSearchByUSerService(q,role);
        console.log(results)
        return sendResponse(res,STATUS_CODES.OK,true,'Users Fetched Successfully',results) 
    } catch (error) {
        console.error('Controller Error in getEmailSearchByUSer',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}