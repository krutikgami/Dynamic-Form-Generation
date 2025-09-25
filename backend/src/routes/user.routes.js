import {Router} from 'express'
import {createUSer,loginUser,getEmailSearchByUSer} from '../controllers/user.controller.js'
const router = Router();

router.post('/create',createUSer);
router.post('/login',loginUser);
router.get('/search',getEmailSearchByUSer)

export default router;