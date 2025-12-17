import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocalCard from "../components/LocalCard"; 
import LoadingSkeleton from "../components/LoadingSkeleton";
import Toast from "../components/Toast";
import { authFetch } from "../../services/api.js";
import "./CampaignsPage.css";

// --- ÍCONES ---
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FlyToLocation({ activeLocal }) {
  const map = useMap();
  useEffect(() => {
    if (activeLocal) {
      map.flyTo([activeLocal.latitude, activeLocal.longitude], 16, { duration: 1.5 });
    }
  }, [activeLocal, map]);
  return null;
}

function CampaignsPage() {
  const [locals, setLocals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("todos");
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    authFetch("/api/campaigns/locals")
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;

       
        const realData = (json.data || []).map((loc) => {
          const rawType = (loc.type || "").toLowerCase();
          let tipoTraduzido = "fixo"; 
          if (rawType.includes("fix")) tipoTraduzido = "fixo";
          else if (rawType.includes("event")) tipoTraduzido = "evento";

          return {
            ...loc, 
            
            
            dataInicio: loc.dataInicio || loc.eventStartDate,
            dataFim:    loc.dataFim    || loc.eventEndDate,

            latitude: parseFloat(loc.latitude), 
            longitude: parseFloat(loc.longitude),
            type: tipoTraduzido 
          };
        });
        // ---------------------------------------------

        setLocals(realData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro:", err);
        if (!mounted) return;
        setError("Erro ao carregar locais.");
        setLoading(false);
        showToast('Erro ao carregar locais de doação. Tente novamente.', 'error');
      });

    return () => { mounted = false; };
  }, []);

  const filteredLocals = locals.filter((local) => {
    if (filterType === "todos") return true;
    return local.type === filterType;
  });

  const countFixos = locals.filter(l => l.type === "fixo").length;
  const countEventos = locals.filter(l => l.type === "evento").length;

  if (loading) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-header">
          <LoadingSkeleton type="title" />
        </div>
        <div className="campaigns-loading">
          <div className="spinner"></div>
          <p>Carregando mapa e locais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-page">
        <div className="campaigns-header">
          <h1 className="campaigns-title">Campanhas de Doação em Recife</h1>
        </div>
        <div className="campaigns-error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <div className="campaigns-header">
        <h1 className="campaigns-title">Campanhas de Doação em Recife</h1>
        <p className="campaigns-subtitle">Encontre o hemocentro ou evento mais próximo de você.</p>
      </div>

      <div className="filter-container">
        <button 
          className={`filter-button ${filterType === "todos" ? "active" : ""}`}
          onClick={() => setFilterType("todos")}
        >
          Todos
          <span className="count">{locals.length}</span>
        </button>
        <button 
          className={`filter-button ${filterType === "fixo" ? "active" : ""}`}
          onClick={() => setFilterType("fixo")}
        >
          Fixos
          <span className="count">{countFixos}</span>
        </button>
        <button 
          className={`filter-button ${filterType === "evento" ? "active orange" : ""}`}
          onClick={() => setFilterType("evento")}
        >
          Eventos
          <span className="count">{countEventos}</span>
        </button>
      </div>

      {filteredLocals.length === 0 ? (
        <div className="campaigns-empty">
          <div className="empty-icon">🗺️</div>
          <p className="empty-title">Nenhum local encontrado</p>
          <p className="empty-description">
            Não há {filterType === "todos" ? "locais" : filterType === "fixo" ? "pontos fixos" : "eventos"} disponíveis no momento.
          </p>
        </div>
      ) : (
        <div className="campaigns-grid">
          <div className="map-wrapper">
            <MapContainer center={[-8.05428, -34.8813]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <FlyToLocation activeLocal={selectedLocal} />
              {filteredLocals.map((local) => {
                 if (isNaN(local.latitude) || isNaN(local.longitude)) { return null; }
                 const markerIcon = local.type === "evento" ? orangeIcon : redIcon;
                 return (
                  <Marker key={local.id} position={[local.latitude, local.longitude]} icon={markerIcon} eventHandlers={{ click: () => setSelectedLocal(local) }}>
                    <Popup>
                      <strong>{local.name}</strong> <br />
                      <span style={{color: local.type === 'evento' ? 'orange' : 'red', fontWeight: 'bold'}}>{local.type === 'evento' ? 'Evento Temporário' : 'Ponto Fixo'}</span> <br/>
                      {local.address}
                      {local.type === 'evento' && local.dataInicio && (
                        <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid var(--border-light)', paddingTop: '5px' }}>
                          📅 Início: {new Date(local.dataInicio).toLocaleDateString('pt-BR')} <br/>
                          {local.dataFim && <>🏁 Fim: {new Date(local.dataFim).toLocaleDateString('pt-BR')}</>}
                        </div>
                      )}
                    </Popup>
                  </Marker>
                 );
              })}
            </MapContainer>
          </div>

          <div className="locals-list">
            {filteredLocals.map((local) => {
              const isSelected = selectedLocal?.id === local.id;
              return (
                <div 
                  key={local.id} 
                  onClick={() => {
                    setSelectedLocal(local);
                    showToast(`📍 Local selecionado: ${local.name}`, 'info');
                  }}
                  className={`local-item-wrapper ${isSelected ? 'selected' : ''}`}
                >
                  <LocalCard local={local} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default CampaignsPage;