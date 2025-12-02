import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DonationHistoryItem from "../components/DonationHistoryItem";
import { authFetch } from "../../services/api";

function DonationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [showNewDonation, setShowNewDonation] = useState(false);
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
        const livesSaved = data.reduce(
          (sum, d) => sum + (d.pointsEarned || 0),
          0
        );
        const pending = data.filter((d) => d.status === "pendente").length;

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
          livesSaved: prev.livesSaved + (newDonation.pointsEarned || 0),
          pending: prev.pending + (newDonation.status === "pendente" ? 1 : 0),
        }));
      })
      .catch((err) => {
        console.error("Erro ao registrar doação:", err);
        alert(`Erro: ${err.message}`);
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
    return <div>Carregando histórico...</div>;
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
            }}
          >
            Minhas Doações
          </h1>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "14px",
            }}
          >
            Histórico completo das suas doações de sangue
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#E63946",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          + Nova Doação
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Total de Doações */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#E63946",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              fontSize: "20px",
            }}
          >
            🩸
          </div>
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Total de Doações
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
            }}
          >
            {stats.totalDonations}
          </p>
        </div>

        {/* Vidas Salvas */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#E83E8C",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              fontSize: "20px",
            }}
          >
            ❤️
          </div>
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Vidas Salvas
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
            }}
          >
            {stats.livesSaved}
          </p>
        </div>

        {/* Pendentes */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#0D6EFD",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              fontSize: "20px",
            }}
          >
            📈
          </div>
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#666",
              fontSize: "14px",
            }}
          >
            Pendentes
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1a1a1a",
            }}
          >
            {stats.pending}
          </p>
        </div>
      </div>

      {/* Modal / Registro (aparece acima) */}
      {showModal && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          {/* Modal Content */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#E63946",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Registrar Nova Doação
            </h2>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  fontSize: "13px",
                }}
              >
                Data da Doação *
              </label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${
                    formErrors.donationDate ? "#E63946" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              {formErrors.donationDate && (
                <span
                  style={{
                    color: "#E63946",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {formErrors.donationDate}
                </span>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  fontSize: "13px",
                }}
              >
                Hemocentro *
              </label>
              <input
                type="text"
                name="hemocentro"
                placeholder="Nome do hemocentro"
                value={formData.hemocentro}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${
                    formErrors.hemocentro ? "#E63946" : "#ddd"
                  }`,
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  color: "#999",
                }}
              />
              {formErrors.hemocentro && (
                <span
                  style={{
                    color: "#E63946",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  {formErrors.hemocentro}
                </span>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#1a1a1a",
                fontSize: "13px",
              }}
            >
              Observações (opcional)
            </label>
            <textarea
              name="observacoes"
              placeholder="Adicione detalhes sobre sua doação..."
              value={formData.observacoes}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minHeight: "100px",
                fontFamily: "inherit",
                boxSizing: "border-box",
                color: "#999",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#D97B00",
            }}
          >
            <strong style={{ color: "#D97B00" }}>Atenção:</strong> Para ganhar
            suas Capibas, apresente seu QR Code no hemocentro para validação da
            doação!
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "12px 24px",
                border: "1px solid #ddd",
                backgroundColor: "white",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 24px",
                backgroundColor: "#E63946",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              📋 Registrar Doação
            </button>
          </div>
        </div>
      )}

      {/* Novo formulário de doação (controlado por showNewDonation) */}
      {showNewDonation && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#E63946",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Nova Doação
            </h2>
            <button
              onClick={() => setShowNewDonation(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999",
                padding: 0,
              }}
            >
              ✕
            </button>
          </div>

          <p>
            Criar nova doação{" "}
            {prefillLocalId
              ? `(local id: ${prefillLocalId})`
              : ""}
          </p>

          {/* Aqui você pode colocar o formulário específico para a nova doação */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  fontSize: "13px",
                }}
              >
                Data da Doação
              </label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  fontSize: "13px",
                }}
              >
                Hemocentro
              </label>
              <input
                type="text"
                name="hemocentro"
                placeholder="Nome do hemocentro"
                value={formData.hemocentro}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  color: "#999",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#1a1a1a",
                fontSize: "13px",
              }}
            >
              Observações (opcional)
            </label>
            <textarea
              name="observacoes"
              placeholder="Adicione detalhes sobre sua doação..."
              value={formData.observacoes}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minHeight: "100px",
                fontFamily: "inherit",
                boxSizing: "border-box",
                color: "#999",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#D97B00",
            }}
          >
            <strong style={{ color: "#D97B00" }}>Atenção:</strong> Para ganhar
            suas Capibas, apresente seu QR Code no hemocentro para validação da
            doação!
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setShowNewDonation(false)}
              style={{
                padding: "12px 24px",
                border: "1px solid #ddd",
                backgroundColor: "white",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 24px",
                backgroundColor: "#E63946",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              📋 Registrar Doação
            </button>
          </div>
        </div>
      )}

      {/* Histórico (sempre visível abaixo) */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            color: "#E63946",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          Histórico de Doações
        </h2>

        {donations.length > 0 ? (
          <div>
            {donations.map((donation) => (
              <DonationHistoryItem
                key={donation.id}
                date={new Date(donation.donationDate).toLocaleDateString("pt-BR")}
                location={donation.location?.name || donation.hemocentro || "-"}
                status={donation.status}
                points={donation.pointsEarned}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "16px",
                opacity: 0.3,
              }}
            >
              🩸
            </div>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              Nenhuma doação registrada
            </p>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Registre sua primeira doação e comece a acumular Capibas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationsPage;