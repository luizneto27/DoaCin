import express from "express";
import authMiddleware from "./controllers/middleware/auth.js";
import {
  getLocalsCampaign,
  createLocalCampaign,
} from "./controllers/campaignLocals.js";

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas a locais de campanhas

// GET /api/campaigns/locals -> lista todos os locais de campanha
router.get("/locals", authMiddleware, getLocalsCampaign);

// POST /api/campaigns/locals -> cria um novo local
router.post("/locals", authMiddleware, createLocalCampaign);

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/campaigns

// melhorias praticas que se aplicam a este arquivo:
  // 1. Validacao de Dados: Usar zod/joi/express-validator para validar body do POST e query params do GET; normalizar e sanitizar entradas.
  
  // 2. Paginação no GET /locals: Se muitos locais existirem, retornar todos pode ser pesado. Implementar paginação (limit, offset) para melhorar performance e UX.

  // 3. Adicionar filtros: Suportar ?campaignId=, ?type=, ?q= (search por nome/endereço) e faixa de horário se aplicável.

  // 4. Não retornar error.message ao cliente; usar logger (pino/winston) para armazenar stack trace e retornar { message: "Erro interno" } com código de correlação.
