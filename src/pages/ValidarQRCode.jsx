import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../context/DashboardContext";

function ValidarQRCode() {
  const navigate = useNavigate();
  const { addCapibas } = useDashboard();

  const handleConfirmDonation = () => {
    addCapibas(100); // Adiciona 100 Capibas
    navigate("/"); // Volta para a HomePage
  };
  return (
    <div className="validar-qr-code">
      <h1>Meu QR Code de Doador:</h1>
      <div
        className="imprimir-qr-code"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
          border: "1px solid rgba(235, 14, 14, 0.87)",
          padding: "16px",
          borderRadius: "8px",
          maxWidth: "232px", // 200px image + 16px padding on each side
        }}
      >
        <img
          src="src\assets\qrcode.svg"
          alt="QR Code"
          style={{ width: "200px", height: "auto" }}
        />
      </div>
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <p style={{ marginBottom: "8px" }}>
          <strong>Como usar?</strong>
        </p>
        <ol style={{ margin: 0, paddingLeft: "20px" }}>
          <li>Apresente este QR Code no hemocentro</li>
          <li>O funcionário irá escaneá-lo</li>
          <li>Sua doação será registrada automaticamente</li>
          <li>Você ganhará 100 Capibas! 🎉</li>
        </ol>
      </div>

      <button
        onClick={() => window.print()}
        style={{
          backgroundColor: "#fff",
          border: "1px solid gray",
          padding: "16px",
          margin: "8px",
          borderRadius: "8px",
          color: "rgba(235, 14, 14, 0.87)",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Imprimir QR Code
      </button>

      <button
        onClick={handleConfirmDonation}
        style={{
          backgroundColor: "#269d17ff",
          border: "1px solid gray",
          padding: "16px",
          margin: "8px",
          borderRadius: "8px",
          color: "white",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Confirmar Doação ✔
      </button>
    </div>
  );
}

export default ValidarQRCode;
