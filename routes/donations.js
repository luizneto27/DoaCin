import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';

// Importações dos controllers
import {
  getDonationHistory,
  confirmDonation,
  createDonation
} from './controllers/donationsController.js';

const router = express.Router();

// ---------------------------------------
// GET /api/donations  → Histórico do usuário
// ---------------------------------------
router.get('/', authMiddleware, getDonationHistory);

// ---------------------------------------
// POST /api/donations  → Criar uma nova doação
// ---------------------------------------
router.post('/', authMiddleware, createDonation);

// ---------------------------------------
// POST /api/donations/confirm  → Confirmar doação via QR Code
// ---------------------------------------
router.post('/confirm', authMiddleware, confirmDonation);

export default router;
