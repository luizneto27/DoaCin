import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocalCard from "../components/LocalCard"; 
import { authFetch } from "../../services/api.js";

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
      });

    return () => { mounted = false; };
  }, []);

  const filteredLocals = locals.filter((local) => {
    if (filterType === "todos") return true;
    return local.type === filterType;
  });

  const countFixos = locals.filter(l => l.type === "fixo").length;
  const countEventos = locals.filter(l => l.type === "evento").length;

  const styles = {
    
    container: { 
        padding: "20px", 
        maxWidth: "1400px", 
        margin: "0 auto", 
        height: "100vh", 
        display: "flex",
        flexDirection: "column",
        overflow: "hidden" 
    },
    header: { marginBottom: "15px", flexShrink: 0 },
    title: { marginTop: "10px", fontSize: "2rem", color: "var(--doacin-red)" },
    filterContainer: { display: "flex", gap: "10px", marginBottom: "15px", flexShrink: 0 },
    
    filterBtn: (isActive, color) => ({
      padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: "bold",
      backgroundColor: isActive ? color : "#e0e0e0", color: isActive ? "#fff" : "#333", transition: "0.3s"
    }),

    
    gridLayout: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr", 
      gap: "20px",
      height: "calc(100vh - 180px)", 
      minHeight: "400px"
    },

    mapWrapper: {
      borderRadius: "15px", overflow: "hidden", border: "1px solid #ddd", height: "100%", position: "relative"
    },
    
    listWrapper: {
      overflowY: "auto", 
      paddingRight: "10px", 
      height: "100%", 
      paddingBottom: "20px"
    }
  };

  return (
    <div style={styles.container} className="page-container">
      <div style={styles.header}>
        <h1 style={styles.title}>Campanhas de Doação em Recife</h1>
        <p style={{ color: "#666", marginTop: "5px" }}>Encontre o hemocentro ou evento mais próximo.</p>
      </div>

      <div style={styles.filterContainer}>
        <button style={styles.filterBtn(filterType === "todos", "var(--doacin-red)")} onClick={() => setFilterType("todos")}>Todos ({locals.length})</button>
        <button style={styles.filterBtn(filterType === "fixo", "var(--doacin-red)")} onClick={() => setFilterType("fixo")}>Fixos ({countFixos})</button>
        <button style={styles.filterBtn(filterType === "evento", "var(--warning-orange)")} onClick={() => setFilterType("evento")}>Eventos ({countEventos})</button>
      </div>

      {loading ? ( <p>Carregando mapa...</p> ) : error ? ( <p style={{ color: "red" }}>{error}</p> ) : (
        <div style={styles.gridLayout} className="map-layout">
          {/* MAPA */}
          <div style={styles.mapWrapper} className="map-wrapper">
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
                        <div style={{ marginTop: '5px', fontSize: '0.9em', borderTop: '1px solid #eee', paddingTop: '5px' }}>
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

          {/* LISTA LATERAL */}
          <div style={styles.listWrapper} className="list-wrapper custom-scroll">
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredLocals.map((local) => {
                const isSelected = selectedLocal?.id === local.id;
                return (
                  <div key={local.id} onClick={() => setSelectedLocal(local)}
                      style={{
                        cursor: "pointer", transition: "all 0.2s",
                        borderLeft: isSelected ? "4px solid var(--doacin-red)" : "4px solid transparent",
                        paddingLeft: isSelected ? "8px" : "0",
                        transform: isSelected ? "translateX(5px)" : "none"
                      }}
                  >
                      <LocalCard local={local} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* --- CORREÇÃO DO SCROLL MOBILE E SCROLLBAR --- */}
      <style>{`
        /* Scrollbar Desktop */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 10px; }
        
        /* === CORREÇÃO PARA CELULAR (O pulo do gato) === */
        @media (max-width: 768px) { 
          /* 1. Destrava a altura da página para permitir rolagem */
          .page-container {
             height: auto !important;
             overflow: visible !important;
             display: block !important;
          }

          /* 2. Coloca o Mapa em cima e a Lista embaixo */
          .map-layout { 
             display: flex !important;
             flex-direction: column;
             height: auto !important; 
          }
          
          /* 3. Mapa com altura fixa no celular */
          .map-wrapper { 
             height: 400px !important; 
             margin-bottom: 20px;
             flex-shrink: 0;
          }

          /* 4. Lista com altura livre (para você poder descer a página) */
          .list-wrapper {
             height: auto !important;
             overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CampaignsPage;