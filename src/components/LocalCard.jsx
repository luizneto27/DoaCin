import React from "react";
import "./LocalCard.css";

function LocalCard({ local }) {
  if (!local) return null;

  const { id, name, address, hours, contact, type } = local;

  const rawInicio = local.dataInicio || local.eventStartDate;
  const rawFim    = local.dataFim    || local.eventEndDate;
  const dataInicioFormatada = rawInicio ? new Date(rawInicio).toLocaleDateString('pt-BR') : null;
  const dataFimFormatada    = rawFim    ? new Date(rawFim).toLocaleDateString('pt-BR')    : null;

  const tipoLimpo = (type || "").toLowerCase();
  const isEvento = tipoLimpo.includes("event") || tipoLimpo.includes("evento");

  return (
    <div className="local-card">
      <div className="local-card-header">
        <h3 className="local-card-title">{name}</h3>
        {type && (
          <span className={`local-card-badge ${isEvento ? 'event' : 'fixed'}`}>
            {isEvento ? 'Evento' : 'Fixo'}
          </span>
        )}
      </div>

      <div className="local-card-info">
        {address && (
          <p className="local-card-address">
            <span className="icon">📍</span>
            {address}
          </p>
        )}

        {hours && (
          <p className="local-card-hours">
            <span className="icon">🕒</span>
            {hours}
          </p>
        )}

        {isEvento && dataInicioFormatada && (
          <p className="local-card-date">
            <span className="icon">📅</span>
            <span>
              {dataInicioFormatada} {dataFimFormatada ? ` até ${dataFimFormatada}` : ''}
            </span>
          </p>
        )}

        {contact && (
          <p className="local-card-contact">
            <span className="icon">📞</span>
            <a href={`tel:${contact}`}>{contact}</a>
          </p>
        )}
      </div>

      <div className="local-card-actions">
        {address && (
          <a
            href={`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="local-card-button secondary"
          >
            Ver no mapa
          </a>
        )}

        <a
          href={`/agendar?localId=${id}`}
          className="local-card-button primary"
        >
          Agendar
        </a>
      </div>
    </div>
  );
}

export default LocalCard;