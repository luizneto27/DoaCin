// Conteúdo para: routes/auth.js

import express from 'express';
// Assumindo que seu controller está em 'controllers/authController.js'
// Note o '.js' no final
import { register, login } from './controllers/authController.js'; 

const router = express.Router(); // Esta linha estava faltando

router.post('/register', register);
router.post('/login', login);

export default router; // Mude de module.exports para export default