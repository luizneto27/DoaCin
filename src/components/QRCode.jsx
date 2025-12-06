// card pra exibir QR Code

import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { authFetch } from "../../services/api"; // Importar authFetch para chamar o backend
import qrcodeImg from "../assets/qrcode.svg";

function QRCode() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Estado para loading do botão
  const { addCapibas } = useDashboard();

  const handleConfirmDonation = async () => {
    if (isProcessing) return; // Evita duplo clique
    setIsProcessing(true);

    try {
      // 1. Chama o backend para salvar a doação no banco de dados
      const response = await authFetch('/api/donations/confirm', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error("Erro ao processar doação");
      }

      // 2. Se deu certo no banco, atualiza o visual (Context)
      addCapibas(100); // Adiciona 100 Capibas e atualiza contadores locais
      
      alert("Doação confirmada com sucesso! Você ganhou 100 Capibas.");
      setIsOpen(false);

    } catch (error) {
      console.error(error);
      alert("Não foi possível confirmar a doação. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
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
            <h1 style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>
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
              <p style={{ marginBottom: "8px", color: "#333" }}>
                <strong>Como usar?</strong>
              </p>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#555" }}>
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
                disabled={isProcessing}
                style={{
                  backgroundColor: isProcessing ? "#9ca3af" : "#16a34a", // Cinza se loading, Verde se normal
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  color: "white",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  fontWeight: "bold"
                }}
              >
                {isProcessing ? "Confirmando..." : "Confirmar Doação ✔"}
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