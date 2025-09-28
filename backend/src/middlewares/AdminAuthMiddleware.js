import jwt from 'jsonwebtoken'
import { sendError } from '../utilities/response.js';
import { STATUS_CODES } from '../utilities/constants/statusCodeConstants.js';

export const adminAuthMiddleware = async(req,res,next)=>{
   const token = req.cookies.authToken; 

    if (!token) {
        return sendError(res,STATUS_CODES.UNAUTHORIZED,false,"Authorization Token missing")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (decoded?.role !== 'ADMIN') {
            return sendError(res,STATUS_CODES.UNAUTHORIZED,false,"You are not authorized to access this resource")
        } 
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.clearCookie('authToken');
        return sendError(res,STATUS_CODES.SERVERERROR,false,"Internal Server Error")
    }
}