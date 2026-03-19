import { useState } from 'react';
import LoginPage from './LoginPage';
import FormPage from './FormPage';
import ProposalDocument from './ProposalDocument';

export interface LineItem {
  id: number;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
}

export interface ProposalData {
  numero: string;
  dataEmissao: Date;
  validadeDias: number;
  cliente: {
    razaoSocial: string;
    cnpj: string;
    endereco: string;
    contato: string;
    telefone: string;
    email: string;
    localExecucao: string;
  };
  itens: LineItem[];
  prazoExecucao: string;
  condicoesPagamento: string;
  observacoes: string;
}

function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rr-auth') === '1');
  const [proposal, setProposal] = useState<ProposalData | null>(null);

  if (!authed) {
    return <LoginPage onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f3f5f8', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <header className="no-print" style={{
        background: 'linear-gradient(135deg, #001c3d 0%, #002863 100%)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo-rr.png" alt="RR Engenharia" style={{ height: 40 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>RR ENGENHARIA</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block' }}>Gerador de Propostas</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {proposal && (
            <>
              <button
                onClick={() => setProposal(null)}
                className="btn-secondary-header"
              >
                ← Nova proposta
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary-header"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }}>
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Imprimir / PDF
              </button>
            </>
          )}
          <button
            onClick={() => { sessionStorage.removeItem('rr-auth'); setAuthed(false); setProposal(null); }}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '32px 16px' }}>
        {proposal
          ? <ProposalDocument data={proposal} />
          : <FormPage onGerar={setProposal} />
        }
      </main>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; }
        }
        .btn-primary-header {
          background: linear-gradient(135deg, #0963ed 0%, #0751c8 100%);
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: box-shadow 0.2s;
        }
        .btn-primary-header:hover { box-shadow: 0 4px 16px rgba(9,99,237,0.35); }
        .btn-secondary-header {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.2s;
        }
        .btn-secondary-header:hover { background: rgba(255,255,255,0.14); }
      `}</style>
    </div>
  );
}

export default App;
