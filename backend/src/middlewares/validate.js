import { STATUS_CODES } from "../utilities/constants/statusCodeConstants.js";
import { sendError } from "../utilities/response.js";
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); 
    next();
  } catch (error) {
    console.error("Validation Error:", error);

    if (error instanceof ZodError) {
      return sendError(
        res,
        STATUS_CODES.BADREQUEST,
        false,
        "Validation failed",
        error.issues.map((err) => ({
          path: err.path.join(".") ,
          message: err.message,
        }))
      );
    }
  }
};
