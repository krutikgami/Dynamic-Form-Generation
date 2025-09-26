import {Router} from 'express'
import { createForm,publishForm,getFormsById,updateForm,formSubmissions,viewForm,getFormSubmissionData } from '../controllers/form.controller.js'
import { authMiddlewareToken } from '../middlewares/AuthMiddlewareToken.js';
const router = Router()

router.post('/form',createForm);
router.patch('/form',publishForm)
router.get('/forms',authMiddlewareToken,getFormsById)
router.patch('/updateForm',updateForm)
router.post('/form/submission',authMiddlewareToken,formSubmissions);
router.post('/form/view',authMiddlewareToken,viewForm)
router.post('/form/submission/data',authMiddlewareToken,getFormSubmissionData);

export default router;