import React from "react";
import { useNavigate } from "react-router-dom";

function LocalCard({ local }) {
  if (!local) return null;

  const navigate = useNavigate();

  const { id, name, address, hours, contact, type, LinkMaps } = local;


  const rawInicio = local.dataInicio || local.eventStartDate;
  const rawFim    = local.dataFim    || local.eventEndDate;
  const dataInicioFormatada = rawInicio ? new Date(rawInicio).toLocaleDateString('pt-BR') : null;
  const dataFimFormatada    = rawFim    ? new Date(rawFim).toLocaleDateString('pt-BR')    : null;

  const tipoLimpo = (type || "").toLowerCase();
  const isEvento = tipoLimpo.includes("event") || tipoLimpo.includes("evento");

 
  const googleMapsUrl = LinkMaps 
    ? LinkMaps 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`;

  return (
    <div
      className="local-card"
      style={{
        border: "1px solid #f3f4f6",
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* TÍTULO E TIPO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1f2937", fontWeight: "600" }}>
          {name}
        </h3>
        {type && (
          <span style={{
              fontSize: "0.7rem", padding: "4px 10px", borderRadius: "20px",
              background: isEvento ? "#fff7ed" : "#f5f3ff",
              color: isEvento ? "#c2410c" : "#4f46e5", fontWeight: "700"
            }}>
            {isEvento ? 'EVENTO' : 'FIXO'}
          </span>
        )}
      </div>

      {/* ENDEREÇO E INFO */}
      {address && <p style={{ margin: 0, color: "#4b5563", fontSize: "0.9rem" }}>📍 {address}</p>}
      {hours && <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>🕒 {hours}</p>}
      
      {isEvento && dataInicioFormatada && (
        <div style={{ color: "#ea580c", fontSize: "0.9rem", fontWeight: "500" }}>
           📅 {dataInicioFormatada} {dataFimFormatada ? `até ${dataFimFormatada}` : ''}
        </div>
      )}

      {contact && (
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
          📞 <a href={`tel:${contact}`} style={{ color: "#2563eb", textDecoration: "none" }}>{contact}</a>
        </p>
      )}

      {/* BOTÕES DE AÇÃO */}
      <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
        
        {/* BOTÃO MAPA */}
        <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, textAlign: "center", padding: "10px", borderRadius: "8px",
              background: "#fff", border: "1px solid #e5e7eb", color: "#374151",
              textDecoration: "none", fontSize: "0.9rem", cursor: "pointer"
            }}
        >
          Ver no mapa
        </a>

        {/* BOTÃO AGENDAR (Corrigido para /doacoes) */}
        <button
          onClick={(e) => {
             e.stopPropagation(); // Impede cliques acidentais no container
             navigate('/doacoes'); 
          }}
          style={{
            flex: 1, textAlign: "center", padding: "10px", borderRadius: "8px",
            background: "#10b981", border: "none", color: "white",
            fontWeight: "600", cursor: "pointer"
          }}
        >
          Agendar
        </button>
      </div>
    </div>
  );
}

export default LocalCard;