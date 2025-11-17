import express from 'express';
// 1. Importamos o "guarda" (o mesmo do dashboard)
import authMiddleware from './controllers/middleware/auth.js'; 
// 2. Importamos o "funcionário" que acabamos de criar
import { updateUserProfile } from './controllers/userController.js';

const router = express.Router();

// 3. Criamos a rota PUT
// Quando uma chamada PUT chegar em /me,
// 1º: o authMiddleware vai verificar o token
// 2º: o updateUserProfile vai rodar
router.put('/me', authMiddleware, updateUserProfile);

export default router;