import {Router} from 'express'
import { createForm,publishForm,getFormsById,updateForm,formSubmissions,viewForm,getFormSubmissionData,updateUserSubmissionData ,getFormSchema} from '../controllers/form.controller.js'
import { adminAuthMiddleware } from '../middlewares/AdminAuthMiddleware.js';
import {validate} from '../middlewares/validate.js'
import {createFormSchema,createSubmissionSchema,publishFormSchema,updateFormSchema} from '../validations/form.validations.js';
import { userLoginAuthMiddleware } from '../middlewares/UserLoginAuth.js';
const router = Router()

router.post('/form', adminAuthMiddleware,validate(createFormSchema), createForm);
router.patch('/form',adminAuthMiddleware, validate(publishFormSchema), publishForm);
router.get('/forms', userLoginAuthMiddleware, getFormsById)
router.patch('/updateForm',adminAuthMiddleware, validate(updateFormSchema), updateForm)
router.post('/form/submission', userLoginAuthMiddleware, validate(createSubmissionSchema), formSubmissions);
router.post('/form/view', userLoginAuthMiddleware, viewForm)
router.post('/form/submission/data',userLoginAuthMiddleware,getFormSubmissionData);
router.patch('/form/submission',userLoginAuthMiddleware,validate(createSubmissionSchema),updateUserSubmissionData);
router.post('/form/schema',userLoginAuthMiddleware,getFormSchema)
export default router;