import {Router} from 'express'
import { createForm,publishForm,getFormsById,updateForm } from '../controllers/form.controller.js'
import { authMiddlewareToken } from '../middlewares/AuthMiddlewareToken.js';
const router = Router()

router.post('/form',createForm);
router.patch('/form',publishForm)
router.get('/forms',authMiddlewareToken,getFormsById)
router.patch('/updateForm',updateForm)

export default router;