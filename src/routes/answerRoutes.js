import express from 'express';
import { createAnswer, getAnswersByQuestion, updateAnswer, deleteAnswer } from '../controllers/answerController.js';
import { validateAnswer } from '../middleware/validation.js';

const router = express.Router();

router.post('/:question_id/answers', validateAnswer, createAnswer);
router.get('/:question_id/answers', getAnswersByQuestion);
router.put('/:question_id/answers/:answer_id', validateAnswer, updateAnswer);
router.delete('/:question_id/answers/:answer_id', deleteAnswer);

export default router;
