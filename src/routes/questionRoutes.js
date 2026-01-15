import express from 'express';
import { createQuestion, getAllQuestions, getQuestionById } from '../controllers/questionController.js';
import { validateQuestion } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateQuestion, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

export default router;
