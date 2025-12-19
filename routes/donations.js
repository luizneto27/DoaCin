import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { getDonationHistory, confirmDonation, createDonation } from './controllers/donationsController.js';

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas ao historico de doacoes

// define a rota para obter o historico de doacoes protegida por middleware de autenticacao
router.get('/', authMiddleware, getDonationHistory); // primeiro passa pelo authMiddleware antes de chamar getDonationHistory

// Criar nova doação
router.post('/', authMiddleware, createDonation);

// Confirmar doação via QR Code
router.post('/confirm', authMiddleware, confirmDonation);

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/donations