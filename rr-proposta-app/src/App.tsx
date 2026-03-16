import { useState } from 'react';
import type { DadosProposta } from './types';
import LoginPage from './components/LoginPage';
import PropostaForm from './components/PropostaForm';
import PropostaDoc from './components/PropostaDoc';

export default function App() {
  const [autenticado, setAutenticado] = useState(
    () => sessionStorage.getItem('rr-auth') === '1'
  );
  const [proposta, setProposta] = useState<DadosProposta | null>(null);

  if (!autenticado) {
    return <LoginPage onAuth={() => setAutenticado(true)} />;
  }

  function handleGerar(dados: DadosProposta) {
    setProposta(dados);
  }

  function handleImprimir() {
    window.print();
  }

  function handleVoltar() {
    setProposta(null);
  }

  function handleSair() {
    sessionStorage.removeItem('rr-auth');
    setAutenticado(false);
    setProposta(null);
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8]">
      {/* Header */}
      <header className="no-print" style={{
        background: 'linear-gradient(135deg, #001c3d 0%, #002863 100%)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div className="flex items-center gap-3">
          <img src="/logo-rr.png" alt="RR Engenharia" className="h-10" />
          <div>
            <span className="text-white text-sm font-bold tracking-wider">RR ENGENHARIA</span>
            <span className="text-white/40 text-xs block">Gerador de Propostas</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {proposta && (
            <>
              <button
                onClick={handleVoltar}
                className="px-4 py-2 text-xs font-medium text-white/70 border border-white/15 rounded-lg hover:bg-white/5 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleImprimir}
                className="px-5 py-2 text-xs font-bold text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
                style={{ background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)' }}
              >
                Imprimir / PDF
              </button>
            </>
          )}
          <button
            onClick={handleSair}
            className="px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="py-8 px-4">
        {!proposta ? (
          <PropostaForm onGerar={handleGerar} />
        ) : (
          <PropostaDoc dados={proposta} />
        )}
      </main>
    </div>
  );
}
