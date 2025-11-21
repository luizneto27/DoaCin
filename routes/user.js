import express from 'express';
import authMiddleware from './controllers/middleware/auth.js'; 
import { updateUserProfile } from './controllers/userController.js';

const router = express.Router();


router.put('/me', authMiddleware, updateUserProfile);

export default router;