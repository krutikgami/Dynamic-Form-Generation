import {Router} from 'express'
import { createForm,publishForm,getFormsById } from '../controllers/form.controller.js'
const router = Router()

router.post('/form',createForm);
router.patch('/form',publishForm)
router.post('/forms',getFormsById)

export default router;