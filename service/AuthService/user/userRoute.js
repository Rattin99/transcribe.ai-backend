import express from 'express';
import { userController } from './userController';
import validateUser from './../../../utils/validator';

const router = express.Router();

router.post('/create-user',validateUser,userController.createUser);
router.post('/login-user',userController.login)
export const userRoutes = router;