import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/');
      } else {
        setError('Falha no login. Verifique seu email e senha.');
      }
    } catch (err) {
      setError('Erro ao tentar fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Login</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button 
            type="submit" 
            className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {!isLoading && 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          Não tem uma conta? <a href="/register" className="login-footer-link">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;