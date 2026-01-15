import express from 'express';
import { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { validateQuestion } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateQuestion, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', validateQuestion, updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
