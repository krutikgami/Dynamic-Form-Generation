import {Router} from 'express'
import {createUSer} from '../controllers/user.controller.js'
const router = Router();

router.post('/create',createUSer);

export default router;