// ● Componentes: Formulário com inputs controlados (React useState).
// ● Lógica de Dados:
// ○ useEffect inicial para buscar dados do GET /api/user/me e preencher o formulário.
// ○ Função handleSubmit que envia os dados do formulário para PUT /api/user/me.
// ○ Os campos "Nome" e "E-mail" podem ser definidos como readOnly se forem
// gerenciados por um provedor de identidade.


import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

// Lembre-se, export nomeado!
function ProfilePage() {
  
  // --- LÓGICA DE DADOS (Componentes Controlados) ---
  
  // Dados que vêm da API (e são readOnly)
  const [nome, setNome] = useState('Carregando...');
  const [email, setEmail] = useState('Carregando...');
  
  // Dados que o usuário pode editar
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoRed, setTipoSanguineo] = useState('');
  const [peso, setPeso] = useState('');

  // --- LÓGICA DE DADOS (useEffect) ---
  useEffect(() => {
    // Aqui você fará o GET /api/user/me
    // Por enquanto, vamos usar os dados do "Lorem Ipsum" (modelo)
    
    // Simula a busca da API
    setTimeout(() => {
      setNome('Bruno Maximo da Costa');
      setEmail('bmc5@cin.ufpe.br');
      setTelefone('(81) 99999-9999');
      setDataNascimento('01/01/1990');
      setTipoSanguineo('O+');
      setPeso('75');
    }, 1000); // Simula 1s de loading

  }, []); // O array vazio [] faz isso rodar só uma vez

  // --- LÓGICA DE DADOS (handleSubmit) ---
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o reload da página
    
    // Aqui você fará o PUT /api/user/me
    const dadosParaEnviar = {
      telefone,
      dataNascimento,
      tipoRed,
      peso,
    };
    
    console.log('Enviando dados para a API:', dadosParaEnviar);
    alert('Perfil salvo! (Simulação)');
  };

  // --- RENDERIZAÇÃO (Visual) ---
  return (
    <div className="profile-page">
      
      {/* Títulos */}
      <h2 className="profile-title">Meu Perfil</h2>
      <p className="profile-subtitle">Gerencie suas informações pessoais</p>

      {/* Container das Colunas */}
      <div className="profile-container">

        {/* --- Coluna Esquerda (Sidebar Card) --- */}
        <div className="profile-sidebar">
          <div className="profile-card profile-info-card">
            
            <div className="profile-avatar">
              {/* Vazio por enquanto, pois não estamos usando react-icons */}
            </div>

            <h3 className="profile-user-name">{nome}</h3>
            <p className="profile-user-email">{email}</p>

            <div className="stat-block capibas">
              <p className="stat-block-title">Capibas</p>
              <p className="stat-block-value">0</p>
            </div>

            <div className="stat-block doacoes">
              <p className="stat-block-title">Doações</p>
              <p className="stat-block-value">0</p>
            </div>
          </div>
        </div>

        {/* --- Coluna Direita (Formulário) --- */}
        <div className="profile-content">
          <div className="profile-card">
            
            <h3 className="profile-form-title">Informações Pessoais</h3>

            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label" htmlFor="nome">Nome Completo</label>
                <input
                  className="form-input"
                  type="text"
                  id="nome"
                  value={nome}
                  readOnly 
                />
                <p className="form-helper-text">Nome não pode ser alterado</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">E-mail</label>
                <input
                  className="form-input"
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                />
                <p className="form-helper-text">E-mail não pode ser alterado</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="telefone">Telefone</label>
                  <input
                    className="form-input"
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(99) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dataNascimento">Data de Nascimento</label>
                  <input
                    className="form-input"
                    type="text"
                    id="dataNascimento"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    placeholder="dd / mm / aaaa"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="tipoRed">Tipo Sanguíneo</label>
                  <select
                    className="form-select"
                    id="tipoRed"
                    value={tipoRed}
                    onChange={(e) => setTipoSanguineo(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="peso">Peso (kg)</label>
                  <input
                    className="form-input"
                    type="number"
                    id="peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ex: 70"
                  />
                </div>
              </div>

              <button type="submit" className="form-button">
                Salvar Alterações
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
export default ProfilePage;