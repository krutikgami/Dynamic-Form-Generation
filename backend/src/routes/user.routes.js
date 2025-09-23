import {Router} from 'express'
import {createUSer,loginUser} from '../controllers/user.controller.js'
const router = Router();

router.post('/create',createUSer);
router.post('/login',loginUser);

export default router;