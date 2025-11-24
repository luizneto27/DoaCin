// card pra exibir QR Code

import React from "react";
import { useDashboard } from "../context/DashboardContext";
import qrcodeImg from "../assets/qrcode.svg";

function QRCode() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { addCapibas } = useDashboard();

  const handleConfirmDonation = () => {
    addCapibas(100); // Adiciona 100 Capibas
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="button-qr-code"
      >
        QR Code
      </button>

      {/* Popup Modal pra exibir o QR Code */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
              Meu QR Code de Doador
            </h1>
            <div
              className="imprimir-qr-code"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "24px 0",
              }}
            >
              <img
                src={qrcodeImg}
                alt="QR Code"
                style={{ width: "200px", height: "auto" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
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

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid gray",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  color: "rgba(235, 14, 14, 0.87)",
                  cursor: "pointer",
                }}
              >
                Imprimir QR Code
              </button>

              <button
                type="button"
                onClick={handleConfirmDonation}
                style={{
                  backgroundColor: "#269d17ff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Confirmar Doação ✔
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                backgroundColor: "transparent",
                border: "none",
                color: "#999",
                cursor: "pointer",
                fontSize: "24px",
                lineHeight: 1,
                padding: "4px",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default QRCode;
