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

// Conteúdo para: src/pages/CampaignsPage.jsx

import React from 'react';

function CampaignsPage() {
  return (
    <div>
      <h1>Página de Campanhas</h1>
      <p>(Esta é uma página de placeholder).</p>
    </div>
  );
}

export default CampaignsPage;