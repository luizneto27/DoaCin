// define as rotas de autenticacao
import express from 'express';
import { register, login } from './controllers/authController.js'; 

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas a autenticacao

// define as rotas de registro e login
router.post('/register', register); // /register
router.post('/login', login); // /login

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/auth

