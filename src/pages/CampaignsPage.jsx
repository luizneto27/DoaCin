// Componentes: Tabs (Todos, Fixos, Eventos), LocationListItem.
// ● Lógica de Dados:
// ○ Chamada para GET /api/locations.
// ○ Estado local (useState) para gerenciar a aba ativa ("todos", "fixos", "eventos") e filtrar
// a lista de locais.
// ● Integração do Mapa:
// ○ Use uma biblioteca como react-leaflet ou @react-google-maps/api.
// ○ Mapeie os locais da API como marcadores no mapa.
// ○ (Opcional) Fazer o mapa interagir com a lista (clicar na lista centraliza o mapa, clicar
// no marcador destaca o item da lista).

import React, { useEffect, useState } from "react";
import LocalCard from "../components/LocalCard";
import { authFetch } from "../../services/api.js";

function CampaignsPage() {
  const [locals, setLocals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // form state for creating a new local
  const [form, setForm] = useState({
    name: "",
    address: "",
    hours: "",
    contact: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    authFetch("/api/campaigns/locals")
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return;
        setLocals(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar locais:", err);
        if (!mounted) return;
        setError("Não foi possível carregar os locais");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await authFetch("/api/campaigns/locals", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Erro ao criar local");
      // append created local to state so it shows immediately
      setLocals((prev) => [...prev, json.data]);
      setForm({ name: "", address: "", hours: "", contact: "" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao criar local");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>Página de Campanhas</h1>

      <section>
        <h2>Hemocentros</h2>
        {loading ? (
          <p>Carregando locais...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : locals.length === 0 ? (
          <p>Nenhum local cadastrado.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {locals.map((local) => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        )}
      </section>

      
    </div>
  );
}

export default CampaignsPage;
