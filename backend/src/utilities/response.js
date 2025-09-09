import {STATUS_CODES} from './constants/statusCodeConstants.js'

export const sendResponse = (res, statusCode = STATUS_CODES.OK, success = true, message, data = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data
    });
}

export const sendError = (res, statusCode = STATUS_CODES.SERVERERROR, success= false, message = 'Internal Server Error') => {
    return res.status(statusCode).json({
        success,
        message
    });
}