import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // carrega as variaveis do arquivo .env
const app = express();
const PORT = process.env.PORT || 3000; // define a porta

app.use(cors()); // permite requisiçoes de origens diferentes (do seu frontend Vite)
app.use(express.json()); // permite que o Express entenda JSON no corpo das requisições

// importaçao das rotas
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import donationRoutes from "./routes/donations.js";
import campaignsRoutes from "./routes/campaigns.js";

// 5. Registro das Rotas na API
// Todas as rotas de autenticação ficarão sob /api/auth
app.use("/api/auth", authRoutes);
// Todas as rotas do dashboard ficarão sob /api/dashboard
app.use("/api/dashboard", dashboardRoutes);
// Todas as rotas de doação ficarão sob /api/donations
app.use("/api/donations", donationRoutes);
// Todas as rotas relacionadas a campanhas e locais ficarão sob /api/campaigns
app.use("/api/campaigns", campaignsRoutes);

// inicia o server na porta definida
app.listen(PORT, () => {
  console.log(`Backend Express rodando na porta ${PORT}`);
});
