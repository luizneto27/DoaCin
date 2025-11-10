import React from "react";

function LocalCard({ local }) {
  if (!local) return null;

  const { id, name, address, hours, contact, type } = local;
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`
    : null;

  return (
    <div
      className="local-card"
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18 }}>{name}</h3>
        {type && (
          <span
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 9999,
              background: "#eef2ff",
              color: "#4f46e5",
            }}
          >
            {type}
          </span>
        )}
      </div>

      {address && <p style={{ margin: "8px 0" }}>{address}</p>}

      {hours && (
        <p style={{ margin: "4px 0", color: "#374151" }}>
          <strong>Horário:</strong> {hours}
        </p>
      )}

      {contact && (
        <p style={{ margin: "4px 0" }}>
          <strong>Contato:</strong>{" "}
          <a href={`tel:${contact}`} style={{ color: "#2563eb" }}>
            {contact}
          </a>
        </p>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        {mapsHref && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              background: "#fff",
              border: "1px solid #d1d5db",
              color: "#111827",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Ver no mapa
          </a>
        )}

        <a
          href={`/agendar?localId=${id}`}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: "#10b981",
            border: "1px solid #10b981",
            color: "white",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          Agendar doação
        </a>
      </div>
    </div>
  );
}

export default LocalCard;