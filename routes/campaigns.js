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

