import React from 'react';

// O CSS para 'stat-card-new' está em HomePage.css
function StatCard({ title, value, unit, icon }) {
  return (
    <div className="stat-card-new">
      <div className="icon-container">
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>
          <span className="stat-value">{value}</span>
          {unit && <span className="stat-unit"> {unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default StatCard;