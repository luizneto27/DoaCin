import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Pegue a função login do contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password); // Chame a função de login

    if (success) {
      navigate('/'); // Redireciona para o dashboard
    } else {
      setError('Falha no login. Verifique seu email e senha.');
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '50px auto', 
      padding: 20, 
      border: '1px solid var(--border-light)', 
      borderRadius: 8,
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <h1 style={{ color: 'var(--doacin-red)' }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: 8,
              border: '1px solid var(--border-light)',
              borderRadius: 4,
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="password" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: 8,
              border: '1px solid var(--border-light)',
              borderRadius: 4,
              fontSize: 14,
              boxSizing: 'border-box'
            }}
          />
        </div>
        {error && <p style={{ color: 'var(--doacin-red)' }}>{error}</p>}
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: 10,
            backgroundColor: 'var(--doacin-red)',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--doacin-red-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--doacin-red)'}
        >
          Entrar
        </button>
      </form>
      {/* Adicione um link para registro se desejar */}
    </div>
  );
}

export default LoginPage;