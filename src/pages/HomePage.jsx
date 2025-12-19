import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext.jsx";
import { authFetch } from "../../services/api";
import "./HomePage.css";
import StatCard from "../components/StatCard.jsx";
import QRCode from "../components/QRCode.jsx";
import DonationCooldown from "../components/DonationCooldown.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";

// Ícones SVG para os cards de estatísticas
const IconPendente = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    {/* Ícone de relógio para Pendentes */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
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

function HomePage() {
  const { dashboardData, setDashboardData } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dashboardMounted = true;

    // Carregar dados do Dashboard
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

    loadDashboardData();

    return () => {
      dashboardMounted = false;
    };
  }, [setDashboardData]);

  if (loading) {
    return (
      <div className="home-page-container">
        <LoadingSkeleton type="banner" />
        <div style={{ marginTop: '24px' }}>
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  const {
    donationCountLastYear = 0,
    nome = "Doador",
    pendingDonations = 0,
  } = dashboardData || {};

  const vidasSalvas = donationCountLastYear * 4;

  return (
    <div className="home-page-container">
      {/* --- NOVO CONTÊINER DO BANNER VERMELHO --- */}
      <div className="home-banner-container">
        {/* --- CABEÇALHO --- */}
        <div className="home-header">
          <div className="welcome-message">
            <h1>Olá, {nome}! </h1>

          </div>
          <div className="header-actions">
            <Link 
              to="/doacoes" 
              state={{ openNew: true }}
              className="button-primary"
            >
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
            title="Doações Pendentes"
            value={pendingDonations}
            icon={<IconPendente />}
          />
          <StatCard
            title="Doações este Ano"
            value={donationCountLastYear}
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

      {/* --- CARD DE COOLDOWN --- */}
      <DonationCooldown
        lastDonationDate={dashboardData.lastDonationDate}
        genero={dashboardData.genero}
        donationCountLastYear={dashboardData.donationCountLastYear}
        birthDate={dashboardData.birthDate}
        weight={dashboardData.weight}
      />
    </div>
  );
}

export default HomePage;
