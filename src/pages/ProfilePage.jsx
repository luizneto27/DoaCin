import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { authFetch } from '../../services/api';
import Toast from '../components/Toast';
import LoadingSkeleton from '../components/LoadingSkeleton';

function ProfilePage() {

  const [nome, setNome] = useState('Carregando...');
  const [email, setEmail] = useState('Carregando...');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoRed, setTipoSanguineo] = useState(''); 
  const [peso, setPeso] = useState('');
  const [genero, setGenero] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Carrega dados do perfil do usuário
  useEffect(() => {
    
    
    const fetchUserProfile = async () => {
      console.log('Buscando dados atualizados do perfil...'); 
      try {
        const response = await authFetch('/api/dashboard'); 
        if (!response.ok) throw new Error('Falha ao buscar dados');
        
        const data = await response.json();
        
        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone ?? ''); 
        setTipoSanguineo(data.bloodType ?? ''); 
        setPeso(data.weight ?? '');
        setGenero(data.genero ?? '');     
        
        if (data.birthDate) {
          const dateObj = new Date(data.birthDate);
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
          const year = dateObj.getUTCFullYear();
          setDataNascimento(`${day}/${month}/${year}`);
        } else {
          setDataNascimento('');
        }
      } catch (error) {
        console.error("Erro no useEffect:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserProfile();

    window.addEventListener('focus', fetchUserProfile);

    return () => {
      window.removeEventListener('focus', fetchUserProfile);
    };

  }, []); 
  
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setIsLoading(true);

    const dadosParaEnviar = {
      telefone: telefone,
      dataNascimento: dataNascimento,
      tipoRed: tipoRed,
      peso: peso,
      genero: genero,
    };

    try {
      const response = await authFetch('/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o perfil');
      }

      await response.json();
      setToast({ message: 'Perfil salvo com sucesso!', type: 'success' });

    } catch (error) {
      console.error('Erro no handleSubmit:', error);
      setToast({ message: 'Erro ao salvar o perfil. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="profile-page">
      
      <div className="profile-header">
        <h2 className="profile-title">Meu Perfil</h2>
        <p className="profile-subtitle">Gerencie suas informações pessoais</p>
      </div>

      {initialLoading ? (
        <div className="profile-loading-container">
          <LoadingSkeleton type="profile" />
        </div>
      ) : (
        <div className="profile-container">
          <div className="profile-card profile-form-card">
            
            <div className="profile-form-header">
              <div className="profile-avatar-large"></div>
              <div className="profile-header-info">
                <h3 className="profile-user-name">{nome}</h3>
              </div>
            </div>

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
                    placeholder="dd/mm/aaaa"
                  />
                </div>
              </div>

              {}
              <div className="form-grid three-cols">
                
                {}
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

                {}
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

                {}
                <div className="form-group">
                  <label className="form-label" htmlFor="genero">Gênero</label>
                  <select
                    className="form-select"
                    id="genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>

              </div>

              {}
              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner spinner-small spinner-white"></span>
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </form>

          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ProfilePage;