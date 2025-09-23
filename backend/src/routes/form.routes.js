import {Router} from 'express'
import { createForm,publishForm,getFormsById,updateForm } from '../controllers/form.controller.js'
const router = Router()

router.post('/form',createForm);
router.patch('/form',publishForm)
router.post('/forms',getFormsById)
router.patch('/updateForm',updateForm)

export default router;