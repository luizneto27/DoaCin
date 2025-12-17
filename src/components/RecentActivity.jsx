import React from 'react';
import './RecentActivity.css';

function RecentActivity({ latestDonation }) {
  
  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'status-confirmed';
    if (status === 'pending') return 'status-pending';
    return 'status-rejected'; // ou outro
  };

  return (
    <div className="info-card activity-card">
      <h3 className="card-title">Atividades Recentes</h3>
      <ul className="activity-list">
        {latestDonation ? (
          <li className="activity-item">
            <div className="location-info">
              <h4>{latestDonation.location?.name || 'Local não informado'}</h4>
              <p>{new Date(latestDonation.donationDate).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="status-info">
              <span className={`status ${getStatusClass(latestDonation.status)}`}>
                {latestDonation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
              </span>
              {latestDonation.status === 'confirmed' && (
                <p className="points">+{latestDonation.pointsEarned} Capibas</p>
              )}
            </div>
          </li>
        ) : (
          <p>Nenhuma atividade recente para mostrar.</p>
        )}
      </ul>
      {/* Pode adicionar um link para "Ver tudo" aqui */}
    </div>
  );
}

export default RecentActivity;