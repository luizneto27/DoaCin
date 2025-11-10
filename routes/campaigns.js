import express from "express";
import authMiddleware from "./controllers/middleware/auth.js";
import {
  getLocalsCampaign,
  createLocalCampaign,
} from "./controllers/campaignLocals.js";

const router = express.Router();

// GET /api/campaigns/locals -> lista todos os locais (opcional ?campaignId=)
router.get("/locals", authMiddleware, getLocalsCampaign);

// POST /api/campaigns/locals -> cria um novo local
router.post("/locals", authMiddleware, createLocalCampaign);

export default router;
