// ● Componentes: Formulário com inputs controlados (React useState).
// ● Lógica de Dados:
// ○ useEffect inicial para buscar dados do GET /api/user/me e preencher o formulário.
// ○ Função handleSubmit que envia os dados do formulário para PUT /api/user/me.
// ○ Os campos "Nome" e "E-mail" podem ser definidos como readOnly se forem
// gerenciados por um provedor de identidade.


import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { authFetch } from '../../services/api'; // (Verifique este caminho)

function ProfilePage() {
  
  // --- LÓGICA DE DADOS ---
  const [nome, setNome] = useState('Carregando...');
  const [email, setEmail] = useState('Carregando...');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoRed, setTipoSanguineo] = useState(''); // O estado do React
  const [peso, setPeso] = useState('');
  
  const [capibas, setCapibas] = useState(0);
  const [doacoes, setDoacoes] = useState(0);

  // --- LÓGICA DE DADOS (useEffect) ---
useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authFetch('/api/dashboard'); 

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do usuário');
        }

        const data = await response.json();
        
        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone ?? ''); 
        setTipoSanguineo(data.bloodType ?? ''); 
        setPeso(data.weight ?? '');             
        setCapibas(data.capibasBalance ?? 0); 
        setDoacoes(data.doacoes ?? 0);     
        
        // --- CORREÇÃO DA DATA ---
        // 1. Verificamos se a data existe
        if (data.birthDate) {
          // 2. Criamos um objeto Date com ela
          const dateObj = new Date(data.birthDate);
          
          // 3. Pegamos o dia, mês e ano
          // .padStart(2, '0') garante que '1' vire '01'
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // Mês começa do 0
          const year = dateObj.getUTCFullYear();

          // 4. Salvamos no formato bonito
          setDataNascimento(`${day}/${month}/${year}`);
        } else {
          // Se não tiver data, salvamos como vazio
          setDataNascimento('');
        }
      

      } catch (error) {
        console.error("Erro no useEffect:", error);
      }
    };

    fetchUserProfile();
  }, []);
  // --- LÓGICA DE DADOS (handleSubmit) ---
  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    // (Este será o Passo 3 - Salvar)
    const dadosParaEnviar = {
      telefone,
      dataNascimento, // Vamos precisar converter de volta
      tipoRed, // Vamos precisar converter de volta
      peso,
    };
    
    console.log('Enviando dados para a API (simulação):', dadosParaEnviar);
    alert('Perfil salvo! (Simulação)');
  };

  // --- RENDERIZAÇÃO (Visual) ---
  return (
    <div className="profile-page">
      
      <div className="profile-header">
        <h2 className="profile-title">Meu Perfil</h2>
        <p className="profile-subtitle">Gerencie suas informações pessoais</p>
      </div>

      <div className="profile-container">

        <div className="profile-sidebar">
          <div className="profile-card profile-info-card">
            
            <div className="profile-avatar"></div>

            <h3 className="profile-user-name">{nome}</h3>
            <p className="profile-user-email">{email}</p>

            <div className="stat-block capibas">
              <p className="stat-block-title">Capibas</p>
              <p className="stat-block-value">{capibas}</p> 
            </div>

            <div className="stat-block doacoes">
              <p className="stat-block-title">Doações</p>
              <p className="stat-block-value">{doacoes}</p>
            </div>
          </div>
        </div>

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