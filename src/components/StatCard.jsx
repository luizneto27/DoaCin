// card simples para exibir o saldo de capibas
import React from 'react';

function StatCard({ title, value, unit }) {
  return (
    <div className="stat-card" style={{ border: '1px solid gray', padding: '16px', margin: '8px', borderRadius: '8px' }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        {value} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>{unit}</span>
      </p>
    </div>
  );
}

export default StatCard;