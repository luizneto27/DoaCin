import express from 'express';
import authMiddleware from './controllers/middleware/auth.js';
import { getDonationHistory } from './controllers/donationsController.js';

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas ao historico de doacoes

// define a rota para obter o historico de doacoes protegida por middleware de autenticacao
router.get('/', authMiddleware, getDonationHistory); // primeiro passa pelo authMiddleware antes de chamar getDonationHistory

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/donations

// melhorias praticas que se aplicam a este arquivo:
    // 1. A consulta usa prisma.donation.findMany sem paginação; para usuários com muitos registros isso pode retornar muita informação e impactar memória/latência.Filtrar/orderBy por userId e donationDate deve ter índices no DB para performance.include: { pontoColeta: { select: { nome: true } } } evita N+1 pois traz relação em uma mesma query (bom).