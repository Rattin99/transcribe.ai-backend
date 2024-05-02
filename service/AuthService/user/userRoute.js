import express from 'express';
import { userController } from './userController';
import validateUser from './../../../utils/validator';
import authenticateToken from '../authmiddleware';

const router = express.Router();

router.post('/create-user',validateUser,userController.createUser);
router.post('/login-user',userController.login)
router.get('/get-user-profile',authenticateToken,userController.getProfile)
export const userRoutes = router;