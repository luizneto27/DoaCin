import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { getDonationHistory } from './controllers/donationsController.js';

const router = express.Router();

router.get('/', authMiddleware, getDonationHistory);

export default router;