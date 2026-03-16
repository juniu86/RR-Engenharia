import { useState } from 'react';
import { EMPRESA } from '../lib/constants';

interface LoginPageProps {
  onAuth: () => void;
}

const ACCESS_KEY = 'rr2024';

export default function LoginPage({ onAuth }: LoginPageProps) {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha === ACCESS_KEY) {
      sessionStorage.setItem('rr-auth', '1');
      onAuth();
    } else {
      setErro('Senha incorreta');
      setSenha('');
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">
        <img src={EMPRESA.logo} alt="RR Engenharia" className="login-logo" />
        <h1 className="login-title">RR ENGENHARIA</h1>
        <p className="login-subtitle">Gerador de Propostas</p>

        <input
          type="password"
          value={senha}
          onChange={(e) => { setSenha(e.target.value); setErro(''); }}
          placeholder="Senha de acesso"
          className="login-input"
          autoFocus
        />

        <button type="submit" className="login-btn">
          Entrar
        </button>

        {erro && <p className="login-error">{erro}</p>}
      </form>
    </div>
  );
}
