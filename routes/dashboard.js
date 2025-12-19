import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { getDashboardStats } from './controllers/dashboardController.js';

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas ao dashboard

// define a rota do dashboard protegida por middleware de autenticacao
router.get('/', authMiddleware, getDashboardStats); // primeiro passa pelo authMiddleware antes de chamar getDashboardStats

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/dashboard

