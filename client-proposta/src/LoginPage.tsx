import { useState } from 'react';

const PASSWORD = 'rr2024';

export default function LoginPage({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem('rr-auth', '1');
      onAuth();
    } else {
      setError('Senha incorreta');
      setValue('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #001c3d 0%, #002863 100%)',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        borderRadius: 16,
        padding: '40px 36px',
        width: 340,
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        <img
          src="/logo-rr.png"
          alt="RR Engenharia"
          style={{ height: 56, marginBottom: 4 }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.nextElementSibling?.setAttribute('style', 'display:block');
          }}
        />
        <div style={{ width: 56, height: 56, background: '#001c3d', borderRadius: 12, alignItems: 'center', justifyContent: 'center', display: 'none' }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 20 }}>RR</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#001c3d', margin: 0 }}>RR ENGENHARIA</h1>
          <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>Gerador de Propostas</p>
        </div>
        <input
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          placeholder="Senha de acesso"
          autoFocus
          style={{
            width: '100%',
            padding: '12px 16px',
            border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: 10,
            fontSize: 14,
            outline: 'none',
            fontFamily: "'Montserrat', sans-serif",
            transition: 'border-color 0.2s',
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '-12px 0 0', alignSelf: 'flex-start' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
