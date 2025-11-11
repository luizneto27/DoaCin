import React from 'react';
// Importa NavLink para o estilo de link ativo
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext'; // Importar o DashboardContext
import './MainLayout.css'; // Importar o novo CSS

// --- Ícones (Definidos inline para simplicidade) ---
// Você pode substituí-los por 'react-icons' ou arquivos SVG se preferir
const IconBloodDrop = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
  </svg>
);

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);
const IconDoacoes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const IconCampanhas = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);
const IconQuiz = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconRegras = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const IconPerfil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const IconSair = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
);

// --- Componente Principal ---

function MainLayout() {
  const { logout } = useAuth();
  
  // Buscar dados do dashboard (que agora inclui nome e email)
  const { dashboardData } = useDashboard();
  const { 
    capibasBalance = 0, 
    donationCountLastYear = 0, 
    nome, 
    email 
  } = dashboardData || {};

  // Lógica da imagem: 2 doações = 8 vidas salvas (1 doação = 4 vidas)
  const vidasSalvas = donationCountLastYear * 4;
  
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); 
    logout();
    navigate('/login'); 
  };

  // Função para definir a classe do NavLink (para o .active)
  const getNavLinkClass = ({ isActive }) => 
    isActive ? 'nav-link active' : 'nav-link';
  
  return (
    <div className="layout-container">
      {/* ===== BARRA LATERAL ===== */}
      <nav className="sidebar">
        
        {/* 1. Cabeçalho */}
        <div className="sidebar-header">
          
          <div className="sidebar-logo">
            <IconBloodDrop />
          </div>
          <div className="sidebar-title">
            <h1>Doacin</h1>
            <p>Doe Sangue, Salve Vidas</p>
          </div>
        </div>

        {/* 2. Saldo Capibas */}
        <div className="capibas-saldo">
          <p>Saldo Capibas</p>
          <span className="saldo">{capibasBalance}</span>
        </div>

        {/* 3. Navegação */}
        <div className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/" className={getNavLinkClass} end>
                <IconHome /> Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/doacoes" className={getNavLinkClass}>
                <IconDoacoes /> Minhas Doações
              </NavLink>
            </li>
            <li>
              <NavLink to="/campanhas" className={getNavLinkClass}>
                <IconCampanhas /> Campanhas
              </NavLink>
            </li>
             <li>
              <NavLink to="/quiz" className={getNavLinkClass}>
                <IconQuiz /> Quiz
              </NavLink>
            </li>
             <li>
              <NavLink to="/regras" className={getNavLinkClass}>
                <IconRegras /> Regras
              </NavLink>
            </li>
             <li>
              <NavLink to="/perfil" className={getNavLinkClass}>
                <IconPerfil /> Perfil
              </NavLink>
            </li>
          </ul>
        </div>

        {/* 4. Conquistas */}
        <div className="conquistas-card">
          <h3>Suas Conquistas</h3>
          <div className="conquistas-stats">
            <div>
              <p>Doações:</p>
              <span className="stat-number">{donationCountLastYear}</span>
            </div>
            <div>
              <p>Vidas Salvas:</p>
              <span className="stat-number">{vidasSalvas}</span>
            </div>
          </div>
        </div>

        {/* 5. Footer (Usuário e Sair) */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <IconPerfil />
            </div>
            <div className="user-details">
              <h4>{nome || 'Carregando...'}</h4>
              <p>{email || '...'}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <IconSair />
            Sair
          </button>
        </div>
      </nav>
      
      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="main-content">
        {/* O <Outlet /> renderiza a página atual aqui */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;