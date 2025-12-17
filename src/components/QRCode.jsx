// card pra exibir QR Code

import React, { useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import { authFetch } from "../../services/api";
import qrcodeImg from "../assets/qrcode.svg";
import Toast from "./Toast";
import "./QRCode.css";

function QRCode() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const { addCapibas } = useDashboard();

  const handleConfirmDonation = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await authFetch("/api/donations/confirm", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao processar doação");
      }

      const data = await response.json();
      const pointsEarned = data.donation?.pointsEarned || 4;

      addCapibas(pointsEarned);

      setToast({ 
        message: `Doação confirmada com sucesso! Você ganhou ${pointsEarned} Capibas.`, 
        type: 'success' 
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setToast({ message: `Erro: ${error.message}`, type: 'error' });
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

      {isOpen && (
        <div className="qrcode-modal-overlay">
          <div className="qrcode-modal-content">
            <h1 className="qrcode-modal-header">Meu QR Code de Doador</h1>

            <div className="qrcode-image-container">
              <img
                src={qrcodeImg}
                alt="QR Code"
                className="qrcode-image"
              />
            </div>

            <div className="qrcode-instructions">
              <p className="qrcode-instructions-title">
                <strong>Como usar?</strong>
              </p>
              <ol className="qrcode-instructions-list">
                <li>Registre sua doação na página de doações</li>
                <li>Apresente este QR Code no hemocentro</li>
                <li>O funcionário irá escaneá-lo</li>
                <li>Sua doação será confirmada automaticamente</li>
                <li>Você ganhará 100 Capibas! 🎉</li>
              </ol>
            </div>

            <div className="qrcode-actions">
              <button
                type="button"
                onClick={() => window.print()}
                className="qrcode-btn-print"
              >
                Imprimir QR Code
              </button>

              <button
                type="button"
                onClick={handleConfirmDonation}
                disabled={isProcessing}
                className={`qrcode-btn-confirm ${isProcessing ? 'loading' : ''}`}
              >
                {isProcessing ? '' : 'Confirmar Doação ✔'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="qrcode-close-btn"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default QRCode;
