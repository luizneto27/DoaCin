// define as rotas de autenticacao
import express from 'express';
import { register, login } from './controllers/authController.js'; 

const router = express.Router(); // instancia o router do express para agrupar rotas relacionadas a autenticacao

// define as rotas de registro e login
router.post('/register', register); // /register
router.post('/login', login); // /login

export default router; // exporta o router para ser usado em server.js onde sera montado em /api/auth

// melhorias praticas que se aplicam a este arquivo:
    // 1. Validacao de Dados: Use uma biblioteca(joi/zod/express-validator) antes dos handlers para rejeitar requests malformados cedo:
      //ex: router.post('/register', validateRegister, register);

    // 2. Normalizacao de dados: Padronize emails/nomes de usuario (ex: lowercase/trim) antes de chegar ao controller.

    // 3. Rate-limiter: controle quantas requisições uma origem (por exemplo um IP, um usuário, uma chave de API) pode fazer a um endpoint em um intervalo de tempo.
        //Resultado prático: quando o limite é atingido, o servidor responde com um status de erro (normalmente 429 Too Many Requests) e pode incluir cabeçalhos indicando quando o cliente pode tentar de novo.