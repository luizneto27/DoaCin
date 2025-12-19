import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import conectaService from "./services/conectaService.js";

dotenv.config(); // carrega as variaveis do arquivo .env
const app = express();
const PORT = process.env.PORT || 3000; // define a porta

app.use(cors()); // permite requisiçoes de origens diferentes
app.use(express.json()); // permite que o Express entenda JSON no corpo das requisições

// importaçao das rotas
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import donationRoutes from "./routes/donations.js";
import campaignsRoutes from "./routes/campaigns.js";
import userRoutes from './routes/user.js';

// Registro das Rotas na API
// Todas as rotas de autenticação ficarão sob /api/auth
app.use("/api/auth", authRoutes);
// Todas as rotas do dashboard ficarão sob /api/dashboard
app.use("/api/dashboard", dashboardRoutes);
// Todas as rotas de doação ficarão sob /api/donations
app.use("/api/donations", donationRoutes);
// Todas as rotas relacionadas a campanhas e locais ficarão sob /api/campaigns
app.use("/api/campaigns", campaignsRoutes);
// rota do perfil
app.use('/api/user', userRoutes); 

app.listen(PORT, async () => {
  console.log(`Backend Express rodando na porta ${PORT}`);

  // Inicializa a autenticação com o Conecta Recife ao subir o servidor
  try {
    await conectaService.initialize();
    console.log(" Serviço Conecta Recife inicializado com sucesso.");
  } catch (error) {
    console.error(" Aviso: Falha ao inicializar serviço Conecta Recife. O sistema tentará novamente na primeira requisição.");
  }
}); 