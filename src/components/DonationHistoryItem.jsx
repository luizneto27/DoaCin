// Conteúdo para: src/components/DonationHistoryItem.jsx

import React from 'react';

const statusStyles = {
  confirmed: { color: 'green', fontWeight: 'bold' },
  pending: { color: 'orange', fontWeight: 'bold' },
  rejected: { color: 'red', fontWeight: 'bold' }
};

function DonationHistoryItem({ date, location, status, points }) {
  return (
    <div className="donation-item" style={{ border: '1px solid #ccc', padding: '12px', margin: '8px 0', borderRadius: '4px' }}>
      <p><strong>Data:</strong> {date}</p>
      <p><strong>Local:</strong> {location}</p>
      <p><strong>Status:</strong> <span style={statusStyles[status] || {}}>{status}</span></p>
      {status === 'confirmed' && <p><strong>Pontos:</strong> {points} Capibas</p>}
    </div>
  );
}

export default DonationHistoryItem;