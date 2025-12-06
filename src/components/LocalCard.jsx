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
        border: "1px solid #f3f4f6", 
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)", 
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif" 
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1f2937", fontWeight: "600", lineHeight: "1.2" }}>
          {name}
        </h3>
        {type && (
          <span
            style={{
              fontSize: "0.7rem",
              padding: "4px 10px",
              borderRadius: "20px",
              background: isEvento ? "#fff7ed" : "#f5f3ff", 
              color: isEvento ? "#c2410c" : "#4f46e5", 
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
        <p style={{ margin: 0, color: "#4b5563", fontSize: "0.9rem", lineHeight: "1.4" }}>
          📍 {address}
        </p>
      )}

      {hours && (
        <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
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
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
          📞 <a href={`tel:${contact}`} style={{ color: "#2563eb", textDecoration: "none" }}>{contact}</a>
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
              background: "#f9fafb", 
              border: "1px solid #e5e7eb", 
              color: "#374151", 
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
            background: "#10b981", 
            border: "none", 
            color: "white", 
            textDecoration: "none", 
            fontSize: "0.85rem",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)" 
          }}
        >
          Agendar
        </a>
      </div>
    </div>
  );
}

export default LocalCard;