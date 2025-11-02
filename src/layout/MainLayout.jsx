//Este componente renderizará a barra lateral esquerda fixa e a área de conteúdo principal onde as páginas serão exibidas.

// Barra Lateral:
// ○ Receberá dados do AuthContext (nome do usuário, email).
// ○ Buscará os dados do "Suas Conquistas" (total de doações, vidas salvas) e "Saldo
// Capibas" de um endpoint (ex: GET /api/user/stats) ou do endpoint GET /api/user/me.
// ○ Usará NavLink do react-router-dom para a navegação.
// ○ Terá uma função de "Sair" (logout) que limpa o AuthContext e o localStorage


// Conteúdo para: src/layout/MainLayout.jsx

import React from 'react';
// Importe o Outlet e o Link (para navegação)
import { Outlet, Link } from 'react-router-dom'; 

function MainLayout() {
  return (
    <div style={{ display: 'flex' }}>
      {/* 1. UMA BARRA LATERAL (SIDEBAR) SIMPLES PARA NAVEGAÇÃO */}
      <nav style={{ 
        width: '200px', 
        borderRight: '1px solid #ccc', 
        padding: '16px', 
        minHeight: '100vh' 
      }}>
        <h2>DoaCIn</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '8px 0' }}>
            <Link to="/">Home (Painel)</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/doacoes">Minhas Doações</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/campanhas">Campanhas</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/quiz">Quiz</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/regras">Regras</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/perfil">Perfil</Link>
          </li>
          <li style={{ margin: '8px 0' }}>
            <Link to="/login">Sair (Login)</Link>
          </li>
        </ul>
      </nav>

      {/* 2. A ÁREA DE CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '16px' }}>
        {/* O <Outlet /> renderiza o componente da rota atual aqui */}
        {/* (Ex: HomePage, DonationsPage, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;