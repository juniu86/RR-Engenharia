import { useState } from 'react';
import type { DadosProposta } from './types';
import PropostaForm from './components/PropostaForm';
import PropostaDoc from './components/PropostaDoc';

export default function App() {
  const [proposta, setProposta] = useState<DadosProposta | null>(null);

  function handleGerar(dados: DadosProposta) {
    setProposta(dados);
  }

  function handleImprimir() {
    window.print();
  }

  function handleVoltar() {
    setProposta(null);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="no-print bg-gradient-to-r from-rr-dark to-rr-secondary text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-rr.png" alt="RR Engenharia" className="h-12" />
          <span className="text-lg font-bold">Gerador de Propostas</span>
        </div>
        {proposta && (
          <div className="flex gap-3">
            <button
              onClick={handleVoltar}
              className="px-4 py-2 text-sm border border-white/30 rounded hover:bg-white/10 transition-colors"
            >
              Voltar ao Formulário
            </button>
            <button
              onClick={handleImprimir}
              className="px-4 py-2 text-sm bg-rr-primary rounded font-medium hover:bg-blue-700 transition-colors"
            >
              Imprimir / PDF
            </button>
          </div>
        )}
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
