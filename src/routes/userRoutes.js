import express from 'express';
import { createUser, getUserById } from '../controllers/userController.js';
import { validateUser } from '../middleware/validation.js';

const router = express.Router();

router.post('/', validateUser, createUser);
router.get('/:id', getUserById);

export default router;
