import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import QRCode from "../components/QRCode.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import { authFetch } from "../../services/api";
import DonationCooldown from "../components/DonationCooldown.jsx"; // 1. Importar

//calcular tempo para a prox doacao (FUNÇÃO REMOVIDA, pois a lógica agora está no DonationCooldown)
// function getNextDonationDate(dateString) {
// ...
// }

function HomePage() {
  const { dashboardData, setDashboardData } = useDashboard();
  const [loading, setLoading] = useState(true);

  // 2. useEffect ATUALIZADO para buscar os novos dados
  useEffect(() => {
    const saved = localStorage.getItem("dashboardData");
    let parsedData = null;
    if (saved) {
      try {
        parsedData = JSON.parse(saved);
        setDashboardData(parsedData);
        // Considera carregado se tiver os dados, mas revalida se estiverem incompletos
        if (parsedData.genero != null && parsedData.weight != null && parsedData.birthDate != null) {
          setLoading(false);
        } else {
          // Força a busca se os dados essenciais para o cooldown estiverem faltando
          parsedData = null; 
        }
      } catch (err) {
        console.warn(
          "Falha ao parsear dashboardData salvo, buscando da API",
          err
        );
        parsedData = null; // Força a busca
      }
    }
    
    // Se não tinha dados salvos OU se os dados estão incompletos
    if (!parsedData) {
      setLoading(true);
      authFetch("/api/dashboard") //requer token
        .then((res) => res.json())
        .then((data) => {
          setDashboardData(data); // 'data' agora inclui genero, weight, birthDate, etc.
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar dashboard:", err);
          setLoading(false);
        });
    }
  }, [setDashboardData]); // Dependência está correta

  
  // 3. Lógica de data antiga REMOVIDA
  // const nextDonationDate = getNextDonationDate(dashboardData.lastDonationDate);
  // const lastDonationDate = dashboardData.lastDonationDate
  //   ? new Date(dashboardData.lastDonationDate).toLocaleDateString("pt-BR")
  //   : null;

  // 4. Indicador de loading ATUALIZADO
  // Espera até que tenhamos os dados buscados (ou do cache) para carregar
  if (loading && dashboardData.genero == null) { // Verifica um dado que vem da API
    //indicador de loading
    return <div>Carregando painel...</div>;
  }

  return (
    <div>
      <h2 style={{ textAlign: "left" }}>Meu Painel</h2>

      <div
        className="painel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          border: "1px solid gray",
          padding: "16px",
          margin: "8px",
          borderRadius: "8px",
        }}
      >
        {/* Critério 1: Saldo de Capibas visível (Isto foi mantido) */}
        <StatCard
          title="Meu Saldo"
          value={dashboardData.capibasBalance}
          unit=" Capibas"
        />

        {/* Critério 2: Botão para Visualizar a página com o QR Code (Isto foi mantido) */}
        <QRCode />
      </div>

      {/* 5. Seção de Cooldown SUBSTITUÍDA */}
      {/* Esta seção substitui o 'div.cooldown-info' antigo */}
      {!loading && (
        <DonationCooldown
          lastDonationDate={dashboardData.lastDonationDate}
          genero={dashboardData.genero}
          donationCountLastYear={dashboardData.donationCountLastYear}
          birthDate={dashboardData.birthDate}
          weight={dashboardData.weight}
        />
      )}
    </div>
  );
}

export default HomePage;