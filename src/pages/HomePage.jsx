// Conteúdo para: src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard'; // Importa o novo componente

// --- DADOS FALSOS (MOCK DATA) ---
const mockDashboardData = {
  capibasBalance: 120, // Saldo de Capibas
  lastDonationDate: '2025-10-01T10:00:00Z' // Data da última doação
};
// ---------------------------------

// Função para calcular próxima doação (Ex: 60 dias)
function getNextDonationDate(dateString) {
  if (!dateString) return null;
  const lastDate = new Date(dateString);
  lastDate.setDate(lastDate.getDate() + 60); // Adiciona 60 dias
  return lastDate.toLocaleDateString('pt-BR'); // Formato BR
}

function HomePage() {
  // Inicializa o estado com os dados falsos
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false); // Não precisamos carregar nada

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

  if (loading) {
    return <div>Carregando...</div>;
  }

  const nextDonationDate = getNextDonationDate(dashboardData.lastDonationDate);
  const lastDonationDate = dashboardData.lastDonationDate 
    ? new Date(dashboardData.lastDonationDate).toLocaleDateString('pt-BR') 
    : null;

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Meu Painel</h2>
      
      {/* Critério 1: Saldo de Capibas visível */}
      <StatCard
        title="Meu Saldo"
        value={dashboardData.capibasBalance}
        unit="Capibas"
      />
      
      {/* Critério 3: Data da última/próxima doação */}
      <div className="cooldown-info" style={{ marginTop: '20px', textAlign: 'left' }}>
        <h3>Acompanhe sua Doação</h3>
        {lastDonationDate ? (
          <>
            <p>Última doação confirmada: {lastDonationDate}</p>
            <p><strong>Você pode doar novamente a partir de: {nextDonationDate}</strong></p>
          </>
        ) : (
          <p>Você ainda não tem doações confirmadas.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;