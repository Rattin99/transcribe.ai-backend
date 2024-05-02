import express from 'express';
import { transcribeController } from './transcribeController';
import authenticateToken from './../AuthService/authmiddleware';

const router = express.Router();
router.get('/get-all-data',authenticateToken,transcribeController.getAllData)
router.get('/get-single-data/:id',authenticateToken,transcribeController.getSingleDataController)
router.get('/get-shareable-data/:id',transcribeController.getSingleDataFree)
router.put('/update-meeting-name/:id',authenticateToken,transcribeController.updateUserMeetingController)
router.delete('/delete-meeting/:id',authenticateToken,transcribeController.deleteMeetingController)
export const transcribeRoutes = router;