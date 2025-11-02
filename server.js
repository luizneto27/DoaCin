// 1. Importações (agora usando 'import')
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Necessário para rotas

dotenv.config(); // Carrega as variáveis do arquivo .env
const app = express();
const PORT = process.env.PORT || 3000; // Define a porta (pode adicionar PORT=3000 ao .env)

// 3. Middlewares
app.use(cors()); // Permite requisições de origens diferentes (do seu frontend Vite)
app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições

// 4. Importação das Rotas (adicionamos .js no final)
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import donationRoutes from './routes/donations.js';

// 5. Registro das Rotas na API
// Todas as rotas de autenticação ficarão sob /api/auth
app.use('/api/auth', authRoutes);
// Todas as rotas do dashboard ficarão sob /api/dashboard
app.use('/api/dashboard', dashboardRoutes);
// Todas as rotas de doação ficarão sob /api/donations
app.use('/api/donations', donationRoutes);

// 6. Iniciar o Servidor
app.listen(PORT, () => {
  console.log(`Backend Express rodando na porta ${PORT}`);
});