import React from "react";
import StatCard from "../components/StatCard";
import QRCode from "../components/QRCode";
import { useDashboard } from "../context/DashboardContext";

// Função para calcular próxima doação (Ex: 60 dias)
function getNextDonationDate(dateString) {
  if (!dateString) return null;
  const lastDate = new Date(dateString);
  lastDate.setDate(lastDate.getDate() + 60); // Adiciona 60 dias
  return lastDate.toLocaleDateString("pt-BR"); // Formato BR
}

function HomePage() {
  const { dashboardData } = useDashboard();

  /*
  // O useEffect e o fetch ficarão comentados até o backend estar pronto
  useEffect(() => {
    setLoading(true);
    fetch('/api/dashboard') // Chamada real
    .then(res => res.json())
    .then(data => {
      setDashboardData(data);
      setLoading(false);
    })
    .catch(err => setLoading(false));
  }, []);
  */

  const nextDonationDate = getNextDonationDate(dashboardData.lastDonationDate);
  const lastDonationDate = dashboardData.lastDonationDate
    ? new Date(dashboardData.lastDonationDate).toLocaleDateString("pt-BR")
    : null;

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
        {/* Critério 1: Saldo de Capibas visível */}
        <StatCard
          title="Meu Saldo"
          value={dashboardData.capibasBalance}
          unit=" Capibas"
        />

        {/* Critério 2: Botão para Visualizar a página com o QR Code */}
        <QRCode />
      </div>

      {/* Critério 3: Data da última/próxima doação */}
      <div
        className="cooldown-info"
        style={{ marginTop: "20px", textAlign: "left" }}
      >
        <h3>Acompanhe sua Doação</h3>
        {lastDonationDate ? (
          <>
            <p>Última doação confirmada: {lastDonationDate}</p>
            <p>
              <strong>
                Você pode doar novamente a partir de: {nextDonationDate}
              </strong>
            </p>
          </>
        ) : (
          <p>Você ainda não tem doações confirmadas.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
