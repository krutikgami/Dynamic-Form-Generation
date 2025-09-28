import {Router} from 'express'
import {createUSer,loginUser,getEmailSearchByUSer} from '../controllers/user.controller.js'
import { validate } from '../middlewares/validate.js';
import { createUserSchema,loginUserSchema,searchUserSchema } from '../validations/user.validations.js';
import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';

const router = Router();

router.post('/create',validate(createUserSchema),createUSer);
router.post('/login',validate(loginUserSchema),loginUser);
router.get('/search',adminAuthMiddleware, getEmailSearchByUSer)

export default router;