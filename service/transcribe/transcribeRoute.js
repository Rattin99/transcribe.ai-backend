import express from 'express';
import { transcribeController } from './transcribeController';
import authenticateToken from './../AuthService/authmiddleware';

const router = express.Router();

router.post('/insert-meeting-name',authenticateToken,transcribeController.userMeetingInsertController)
router.post('/insert-transcribe-data',authenticateToken,transcribeController.transcribeDataInsertController)
router.post('/insert-notes-data',authenticateToken,transcribeController.notesDataInsertController)
router.post('/insert-summary-data',authenticateToken,transcribeController.summaryDataInsertController)
router.get('/get-all-data',authenticateToken,transcribeController.getAllData)

export const transcribeRoutes = router;