import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import QRCode from "../components/QRCode";
import { useDashboard } from "../context/DashboardContext";
import { authFetch } from "../../services/api";

//calcular tempo parqa a prox doacao
function getNextDonationDate(dateString) {
  if (!dateString) return null;
  const lastDate = new Date(dateString);
  lastDate.setDate(lastDate.getDate() + 60); //adiciona 60 dias
  return lastDate.toLocaleDateString("pt-BR");
}

function HomePage() {
  const { dashboardData, setDashboardData } = useDashboard();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardData");
    if (saved) {
      try {
        setDashboardData(JSON.parse(saved));
        setLoading(false);
      } catch (err) {
        // se parse falhar, buscar do backend
        console.warn(
          "Falha ao parsear dashboardData salvo, buscando da API",
          err
        );
        setLoading(true);
        authFetch("/api/dashboard", { method: "GET" }) 
          .then((res) => res.json())
          .then((data) => {
            setDashboardData(data);
            setLoading(false);
          })
          .catch((err2) => {
            console.error("Erro ao buscar dashboard:", err2);
            setLoading(false);
          });
      }
    } else {
      setLoading(true);
      authFetch("/api/dashboard") //requer token
        .then((res) => res.json())
        .then((data) => {
          setDashboardData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar dashboard:", err);
          setLoading(false);
        });
    }
  }, [setDashboardData]);

  const nextDonationDate = getNextDonationDate(dashboardData.lastDonationDate);
  const lastDonationDate = dashboardData.lastDonationDate
    ? new Date(dashboardData.lastDonationDate).toLocaleDateString("pt-BR")
    : null;

  if (loading && dashboardData.lastDonationDate === null) {
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
