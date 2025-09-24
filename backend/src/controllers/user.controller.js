import { UserService } from '../services/user.service.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js'
import {sendError,sendResponse} from '../utilities/response.js'
import jwt from 'jsonwebtoken'

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

export const loginUser = async(req,res)=>{
    try {
        const userData = req.body;
        const validUser = await userService.loginUserService(userData);
        const token = jwt.sign(
            {
                id: validUser.id,
                email : validUser.email,
                role : validUser.role,
                name : validUser.name
            },
            process.env.JWT_TOKEN,
            {expiresIn : '2h'}
        )
        res.cookie('authToken',token,{
            httpOnly: true,
            secure : true,
            maxAge: 7200000
        })
        res.cookie('authTokenClient',token,{
            httpOnly : false,
            secure : true,
            maxAge : 7200000
        })
        return sendResponse(res,STATUS_CODES.OK,true,'User LoggedIn Successfully!') 
    } catch (error) {
        console.error('Controller Error in loginUser',error)
        return sendError(res,STATUS_CODES.BADREQUEST,false,error.message)
    }
}