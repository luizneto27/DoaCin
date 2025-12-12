import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext.jsx";
import { authFetch } from "../../services/api";

// Importar o CSS
import "./HomePage.css";

// Importar os componentes
import StatCard from "../components/StatCard.jsx";
import QRCode from "../components/QRCode.jsx";
import DonationCooldown from "../components/DonationCooldown.jsx";
import DonationInfoSide from "../components/DonationInfoSide.jsx";
import RecentActivity from "../components/RecentActivity.jsx";

// --- Ícones para os StatCards (Definidos inline) ---
const IconCapiba = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {/* Este é o ícone de gota de sangue do seu MainLayout, mas branco */}
    <path d="M12 21.35l-1.45-1.45C5.4 15.35 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.85-8.55 11.4L12 21.35z" />
  </svg>
);
const IconDoacao = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {/* Ícone de gota de sangue simples para Doações */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
    />
  </svg>
);
const IconVidas = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {/* Ícone de coração para Vidas Salvas */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    />
  </svg>
);
// --- Fim dos Ícones ---

function HomePage() {
  const { dashboardData, setDashboardData } = useDashboard();
  const [latestDonation, setLatestDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dashboardMounted = true;
    let activityMounted = true;

    // 1. Carregar dados do Dashboard
    const loadDashboardData = async () => {
      try {
        const saved = localStorage.getItem("dashboardData");
        if (saved) setDashboardData(JSON.parse(saved));

        const data = await authFetch("/api/dashboard").then((res) =>
          res.json()
        );
        if (dashboardMounted) setDashboardData(data);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
      } finally {
        if (dashboardMounted) setLoading(false);
      }
    };

    // 2. Carregar Atividade Recente
    const loadRecentActivity = async () => {
      try {
        const historyData = await authFetch("/api/donations").then((res) =>
          res.json()
        );
        if (activityMounted && historyData && historyData.length > 0) {
          setLatestDonation(historyData[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar histórico de doações:", err);
      }
    };

    loadDashboardData();
    loadRecentActivity();

    return () => {
      dashboardMounted = false;
      activityMounted = false;
    };
  }, [setDashboardData]);

  if (loading) {
    return <div>Carregando painel...</div>;
  }

  const {
    capibasBalance = 0,
    donationCountLastYear = 0,
    nome = "Doador",
  } = dashboardData || {};

  const vidasSalvas = donationCountLastYear * 4;

  return (
    <div className="home-page-container">
      {/* --- NOVO CONTÊINER DO BANNER VERMELHO --- */}
      <div className="home-banner-container">
        {/* --- CABEÇALHO --- */}
        <div className="home-header">
          <div className="welcome-message">
            {/* Adicionei o emoji '👋' da imagem de destino */}
            <h1>Olá, {nome}! 👋</h1>
            <p>Sua próxima doação pode salvar até 4 vidas ❤️</p>
          </div>
          <div className="header-actions">
            <Link to="/doacoes" className="button-primary">
              + Nova Doação
            </Link>
            {/* O QRCode é renderizado aqui, mas os estilos em CSS
                vão mudar sua aparência para o botão translúcido */}
            <QRCode />
          </div>
        </div>

        {/* --- LINHA DE STATS --- */}
        <div className="stats-row">
          <StatCard
            title="Capibas"
            value={capibasBalance}
            icon={<IconCapiba />}
          />
          <StatCard
            title="Doações"
            value={donationCountLastYear}
            /* Removi o 'unit' para bater com a imagem de destino */
            icon={<IconDoacao />}
          />
          <StatCard
            title="Vidas Salvas"
            value={vidasSalvas}
            icon={<IconVidas />}
          />
        </div>
      </div>
      {/* --- FIM DO CONTÊINER DO BANNER VERMELHO --- */}

      {/* --- LAYOUT EM GRID (RESTO DA PÁGINA) --- */}
      <div className="home-grid-layout">
        {/* Coluna Principal (Esquerda) */}
        <div className="main-column">
          {/* Card de Cooldown */}
          <DonationCooldown
            lastDonationDate={dashboardData.lastDonationDate}
            genero={dashboardData.genero}
            donationCountLastYear={dashboardData.donationCountLastYear}
            birthDate={dashboardData.birthDate}
            weight={dashboardData.weight}
          />

          {/* Card de Atividades Recentes */}
          <RecentActivity latestDonation={latestDonation} />
        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="sidebar-column">
          {/* Card de Informações */}
          <DonationInfoSide />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
