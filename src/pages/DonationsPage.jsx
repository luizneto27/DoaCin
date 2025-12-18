import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authFetch } from "../../services/api";
import "./DonationsPage.css";
import Toast from "../components/Toast";
import LoadingSkeleton from "../components/LoadingSkeleton";

function DonationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    donationDate: new Date().toISOString().split("T")[0],
    hemocentro: "",
    observacoes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesSaved: 0,
    pending: 0,
  });
  const [showNewDonation, setShowNewDonation] = useState(true);
  const [prefillLocalId, setPrefillLocalId] = useState(null);

  useEffect(() => {
    setLoading(true);
    authFetch("/api/donations", { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha na autenticação ou erro no servidor");
        }
        return res.json();
      })
      .then((data) => {
        setDonations(data);

        // Calcular estatísticas
        const totalDonations = data.length;
        const livesSaved = totalDonations * 4; // 4 vidas salvas por doação
        const pending = data.filter((d) => d.status === "pending").length;

        setStats({
          totalDonations,
          livesSaved,
          pending,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar doações:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // se a navegação veio com state.openNew = true, abrir o formulário
    if (location?.state?.openNew) {
      setPrefillLocalId(location.state.prefillLocalId ?? null);
      setShowNewDonation(true);
      // opcional: limpar o state para evitar reabrir ao navegar back/forward
      // history.replaceState pode ser usado se necessário
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.donationDate) {
      errors.donationDate = "Data da doação é obrigatória";
    }
    if (!formData.hemocentro.trim()) {
      errors.hemocentro = "Hemocentro é obrigatório";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    authFetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donationDate: formData.donationDate,
        hemocentro: formData.hemocentro,
        observacoes: formData.observacoes || null, // garante que seja null se vazio
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Erro ao criar doação");
          });
        }
        return res.json();
      })
      .then((newDonation) => {
        console.log("Doação criada com sucesso:", newDonation);

        // fecha modal e limpa form
        setShowModal(false);
        setShowNewDonation(false); // fecha também o outro formulário se estiver aberto
        setFormData({
          donationDate: new Date().toISOString().split("T")[0],
          hemocentro: "",
          observacoes: "",
        });
        setFormErrors({});

        // atualiza lista e estatísticas sem reload
        setDonations((prev) => [newDonation, ...prev]);
        setStats((prev) => ({
          totalDonations: prev.totalDonations + 1,
          livesSaved: (prev.totalDonations + 1) * 4,
          pending: prev.pending + (newDonation.status === "pending" ? 1 : 0),
        }));

        setToast({ message: 'Doação registrada com sucesso!', type: 'success' });
      })
      .catch((err) => {
        console.error("Erro ao registrar doação:", err);
        setToast({ message: `Erro: ${err.message}`, type: 'error' });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // handler público para abrir o modal (usado pela navegação)
  const handleNewDonationClick = () => {
    setShowModal(true);
  };

  // Abre o modal quando a página é acessada com state.openModal === true
  useEffect(() => {
    if (location?.state?.openModal) {
      handleNewDonationClick();
      // limpa o state da navegação para não reabrir ao voltar
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location?.state?.openModal, navigate, location?.pathname]);

  if (loading) {
    return (
      <div className="donations-page">
        <div className="donations-header">
          <LoadingSkeleton type="title" />
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="donations-page">
      {/* Header */}
      <div className="donations-header">
        <h1 className="donations-title">Minhas Doações</h1>
      </div>

      {/* Modal / Registro (aparece acima) */}
      {showModal && (
        <div className="donation-modal">
          {/* Modal Content */}
          <div className="modal-header">
            <h2 className="modal-title">Agendar Nova Doação</h2>
            <button onClick={() => setShowModal(false)} className="close-button">
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Data da Doação *</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                className={`form-input ${formErrors.donationDate ? 'error' : ''}`}
              />
              {formErrors.donationDate && (
                <span className="form-error">{formErrors.donationDate}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Hemocentro *</label>
              <input
                type="text"
                name="hemocentro"
                placeholder="Nome do hemocentro"
                value={formData.hemocentro}
                onChange={handleInputChange}
                className={`form-input ${formErrors.hemocentro ? 'error' : ''}`}
              />
              {formErrors.hemocentro && (
                <span className="form-error">{formErrors.hemocentro}</span>
              )}
            </div>
          </div>

          <div className="form-group-full">
            <label className="form-label">
              Observações (opcional)
            </label>
            <textarea
              name="observacoes"
              placeholder="Adicione detalhes sobre sua doação..."
              value={formData.observacoes}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>

          <div className="alert-warning">
            <strong>Atenção:</strong> Para ganhar suas Capibas, apresente seu QR Code no hemocentro para validação da doação!
          </div>

          <div className="button-grid">
            <button 
              onClick={() => setShowModal(false)} 
              className="button-cancel"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit} 
              className="button-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner spinner-small spinner-white"></span>
                  Agendando...
                </>
              ) : (
                <>
                  Agendar Doação
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Novo formulário de doação (controlado por showNewDonation) */}
      {showNewDonation && (
        <div className="donation-modal">
          <div className="modal-header">
            <h2 className="modal-title">Agendar Nova Doação</h2>
            <button onClick={() => setShowNewDonation(false)} className="close-button">
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Data da Doação *</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                className={`form-input ${formErrors.donationDate ? 'error' : ''}`}
              />
              {formErrors.donationDate && (
                <span className="form-error">{formErrors.donationDate}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Hemocentro *</label>
              <input
                type="text"
                name="hemocentro"
                placeholder="Nome do hemocentro"
                value={formData.hemocentro}
                onChange={handleInputChange}
                className={`form-input ${formErrors.hemocentro ? 'error' : ''}`}
              />
              {formErrors.hemocentro && (
                <span className="form-error">{formErrors.hemocentro}</span>
              )}
            </div>
          </div>

          <div className="form-group-full">
            <label className="form-label">Observações (opcional)</label>
            <textarea
              name="observacoes"
              placeholder="Adicione detalhes sobre sua doação..."
              value={formData.observacoes}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>

          <div className="alert-warning">
            <strong>Atenção:</strong> Para ganhar suas Capibas, apresente seu QR Code no hemocentro para validação da doação!
          </div>

          <div className="button-grid">
            <button 
              onClick={() => setShowNewDonation(false)} 
              className="button-cancel"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit} 
              className="button-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner spinner-small spinner-white"></span>
                  Agendando...
                </>
              ) : (
                <>
                 Agendar Doação
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Histórico (sempre visível abaixo) */}
      <div className="history-card">
        <h2 className="history-title">Histórico de Doações</h2>

        {donations.length > 0 ? (
          <ul className="donation-list">
            {donations.map((donation, index) => (
              <li key={donation.id} className="donation-item">
                <div className="donation-info">
                  <h4 className="donation-location">
                    {donation.location?.name || donation.hemocentro || "-"}
                  </h4>
                  <p className="donation-date">
                    {new Date(donation.donationDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="donation-status-container">
                  <span className={`donation-status ${donation.status === "confirmed" ? "confirmed" : "pending"}`}>
                    {donation.status === "confirmed" ? "Confirmada" : "Pendente"}
                  </span>
                  {donation.status === "confirmed" && (
                    <p className="donation-points">
                      +{donation.pointsEarned} Capibas
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🩸</div>
            <p className="empty-title">Nenhuma doação registrada</p>
            <p className="empty-description">
              Registre sua primeira doação e comece a acumular Capibas!
            </p>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default DonationsPage;
