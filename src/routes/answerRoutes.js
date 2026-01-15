import express from 'express';
import { createAnswer, getAnswersByQuestion } from '../controllers/answerController.js';
import { validateAnswer } from '../middleware/validation.js';

const router = express.Router();

router.post('/:question_id/answers', validateAnswer, createAnswer);
router.get('/:question_id/answers', getAnswersByQuestion);

export default router;
