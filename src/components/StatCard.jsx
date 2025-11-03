// card simples para exibir o saldo de capibas
import React from 'react';

function StatCard({ title, value, unit }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {value} 
        <span style={{ fontSize: '16px', fontWeight: 'normal' }}>{unit}</span>
      </p>
    </div>
  );
}

export default StatCard;