import React from "react";

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
    <div
      className="local-card"
      style={{
        border: "1px solid var(--border-light)", 
        borderRadius: "12px",
        padding: "16px",
        background: "var(--bg-primary)",
        boxShadow: "var(--shadow-sm)", 
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif" 
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: "600", lineHeight: "1.2" }}>
          {name}
        </h3>
        {type && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "4px 10px",
              borderRadius: "20px",
              background: isEvento ? "#fff7ed" : "#ede9fe", 
              color: isEvento ? "#c2410c" : "#7c3aed", 
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flexShrink: 0,
              marginLeft: "8px"
            }}
          >
            {isEvento ? 'Evento' : 'Fixo'}
          </span>
        )}
      </div>

      
      {address && (
        <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.9rem", lineHeight: "1.4" }}>
          📍 {address}
        </p>
      )}

      {hours && (
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          🕒 {hours}
        </p>
      )}

      {isEvento && dataInicioFormatada && (
        <div style={{ 
            marginTop: "4px",
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: "#ea580c", 
            fontSize: "0.9rem",
            fontWeight: "500"
        }}>
           <span>📅</span>
           <span>
              {dataInicioFormatada} {dataFimFormatada ? ` até ${dataFimFormatada}` : ''}
           </span>
        </div>
      )}

      {contact && (
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          📞 <a href={`tel:${contact}`} style={{ color: "var(--doacin-red)", textDecoration: "none" }}>{contact}</a>
        </p>
      )}

      <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
        {address && (
           <a
            href={`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: "center",
              padding: "10px", 
              borderRadius: "8px", 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border-light)", 
              color: "var(--text-primary)", 
              textDecoration: "none", 
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "0.2s"
            }}
          >
            Ver no mapa
          </a>
        )}

        <a
          href={`/agendar?localId=${id}`}
          style={{
            flex: 1, textAlign: "center",
            padding: "10px", 
            borderRadius: "8px", 
            background: "var(--doacin-red)", 
            border: "none", 
            color: "white", 
            textDecoration: "none", 
            fontSize: "0.85rem",
            fontWeight: "600",
            boxShadow: "var(--shadow-sm)",
            transition: "background-color 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--doacin-red-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--doacin-red)"}
        >
          Agendar
        </a>
      </div>
    </div>
  );
}

export default LocalCard;