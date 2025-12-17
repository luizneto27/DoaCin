import React from 'react';
import './DonationHistoryItem.css';

function DonationHistoryItem({ date, location, status, points }) {
  const getStatusText = (status) => {
    const statusMap = {
      confirmed: 'Confirmada',
      pending: 'Pendente',
      rejected: 'Rejeitada'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="donation-history-item">
      <div className="donation-item-row">
        <span className="donation-item-label">Data:</span>
        <span className="donation-item-value">{date}</span>
      </div>

      <div className="donation-item-row">
        <span className="donation-item-label">Local:</span>
        <span className="donation-item-value">{location}</span>
      </div>

      <div className="donation-item-row">
        <span className="donation-item-label">Status:</span>
        <span className={`donation-status ${status}`}>
          {getStatusText(status)}
        </span>
      </div>

      {status === 'confirmed' && points && (
        <div className="donation-item-row">
          <span className="donation-item-label">Pontos:</span>
          <span className="donation-points">{points} Capibas</span>
        </div>
      )}
    </div>
  );
}

export default DonationHistoryItem;