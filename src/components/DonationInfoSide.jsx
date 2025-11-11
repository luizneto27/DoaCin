import React from 'react';
import { useDashboard } from '../context/DashboardContext';

// Hook simples para formatar a data (opcional, mas útil)
function useFormattedDate(dateString) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function DonationInfoSide() {
  const { dashboardData } = useDashboard();
  const lastDonationDate = useFormattedDate(dashboardData.lastDonationDate);
  const bloodType = dashboardData.bloodType || 'Não informado';
  const vidasSalvas = (dashboardData.donationCountLastYear || 0) * 4;

  return (
    <div className="info-card info-sidebar">
      <h3 className="card-title">Informações</h3>
      
      {/* O item "Próxima Doação" foi omitido aqui
        pois já está no card principal (DonationCooldown).
        Se quiser adicionar, use a lógica do DonationCooldown.
      */}

      <div className="info-item">
        <h4>Tipo Sanguíneo</h4>
        <p className="blood-type">{bloodType}</p>
      </div>

      <div className="info-item">
        <h4>Última Doação</h4>
        <p>{lastDonationDate || 'Nenhuma doação registrada'}</p>
      </div>

      <div className="info-item">
        <h4>Impacto Total</h4>
        <p>{vidasSalvas} vidas salvas</p>
      </div>
    </div>
  );
}

export default DonationInfoSide;