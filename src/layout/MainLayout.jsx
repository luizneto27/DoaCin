//Este componente renderizará a barra lateral esquerda fixa e a área de conteúdo principal onde as páginas serão exibidas.

// Barra Lateral:
// ○ Receberá dados do AuthContext (nome do usuário, email).
// ○ Buscará os dados do "Suas Conquistas" (total de doações, vidas salvas) e "Saldo
// Capibas" de um endpoint (ex: GET /api/user/stats) ou do endpoint GET /api/user/me.
// ○ Usará NavLink do react-router-dom para a navegação.
// ○ Terá uma função de "Sair" (logout) que limpa o AuthContext e o localStorage


import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; 
import { useAuth} from '../context/AuthContext';


function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); //impede a navegação padrao do link
    logout();
    navigate('/login'); //redireciona para o login
  };

  return (
    <div style={{ display: 'flex' }}>
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
            <Link to="/login" onClick={handleLogout}>Sair</Link>
          </li>
        </ul>
      </nav>
      
      <main style={{ flex: 1, padding: '16px' }}>
        {/* O <Outlet /> renderiza o componente da rota atual aqui */}
        {/* (Ex: HomePage, DonationsPage, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;