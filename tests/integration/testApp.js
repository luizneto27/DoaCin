import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carrega variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Importação das rotas
import authRoutes from "../../routes/auth.js";
import dashboardRoutes from "../../routes/dashboard.js";
import donationRoutes from "../../routes/donations.js";
import campaignsRoutes from "../../routes/campaigns.js";
import userRoutes from '../../routes/user.js';

// Cria aplicação Express para testes (sem iniciar servidor)
const app = express();

app.use(cors());
app.use(express.json());

// Registro das rotas
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use('/api/user', userRoutes);

// Middleware de erro para testes
app.use((err, req, res, next) => {
  console.error('Test error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export { app };
export default app;
