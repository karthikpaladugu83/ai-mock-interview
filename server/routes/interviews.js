import express from 'express';
import auth from '../middleware/auth.js';
import {
  listInterviews,
  listInterviewStats,
  createInterviewHandler,
  getInterviewHandler,
  getInterviewQuestionsHandler,
  generateInterviewQuestionsHandler,
  submitInterviewAnswersHandler,
  getInterviewFeedbackHandler,
  deleteInterviewHandler,
} from '../controllers/interviewController.js';

const router = express.Router();

router.get('/', auth, listInterviews);
router.get('/stats', auth, listInterviewStats);
router.post('/', auth, createInterviewHandler);
router.get('/:id', auth, getInterviewHandler);
router.get('/:id/questions', auth, getInterviewQuestionsHandler);
router.post('/:id/generate', auth, generateInterviewQuestionsHandler);
router.post('/:id/submit', auth, submitInterviewAnswersHandler);
router.get('/:id/feedback', auth, getInterviewFeedbackHandler);
router.delete('/:id', auth, deleteInterviewHandler);

export default router;
