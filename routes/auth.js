import  express from 'express';


export const router = express.Router();
import {login,register,checkEmail,checkUsername,updateAvatar,deleteUser} from '../controllers/auth.js'

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/checkUsername').post(checkUsername)
router.route('/checkEmail').post(checkEmail)
router.route('/updateAvatar').put(updateAvatar)
router.route('/deleteUser/:username').delete(deleteUser)
