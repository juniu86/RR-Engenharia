import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import FormPage from './FormPage';
import ProposalDocument from './ProposalDocument';
import ProposalList from './ProposalList';
import { apiLoadProposals, apiSaveProposal, apiDeleteProposal, apiPeekSeq, apiConsumeSeq } from './api';

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
  valorGlobal?: number;
  prazoExecucao: string;
  condicoesPagamento: string;
  observacoes: string;
}

export interface SavedProposal {
  id: string;
  numero: string;
  clienteNome: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  data: ProposalData;
  showLinePrices: boolean;
  revisao?: number;
  parentId?: string;
}

type AppView = 'list' | 'form' | 'document';

function clientAbbr(razaoSocial: string): string {
  return razaoSocial.trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'CLI';
}

export async function peekNextNumber(razaoSocial: string): Promise<string> {
  const year = new Date().getFullYear();
  const next = await apiPeekSeq(year);
  return `${clientAbbr(razaoSocial)}-${year}-${String(next).padStart(3, '0')}`;
}

export async function consumeNextNumber(razaoSocial: string): Promise<string> {
  const year = new Date().getFullYear();
  const consumed = await apiConsumeSeq(year);
  return `${clientAbbr(razaoSocial)}-${year}-${String(consumed).padStart(3, '0')}`;
}

function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rr-auth') === '1');
  const [view, setView] = useState<AppView>('list');
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProposal, setEditingProposal] = useState<SavedProposal | null>(null);
  const [viewingProposal, setViewingProposal] = useState<SavedProposal | null>(null);

  useEffect(() => {
    if (authed) {
      apiLoadProposals()
        .then(setProposals)
        .catch((e: unknown) => alert('Erro ao carregar propostas. Verifique a conexão.\n\n' + (e instanceof Error ? e.message : String(e))))
        .finally(() => setLoading(false));
    }
  }, [authed]);

  async function handleSave(data: ProposalData, showLinePrices: boolean, existingId?: string): Promise<void> {
    const total = showLinePrices
      ? data.itens.reduce((s, i) => s + i.quantidade * i.valorUnitario, 0)
      : (data.valorGlobal ?? 0);
    const now = new Date().toISOString();
    let saved: SavedProposal;

    if (existingId) {
      const existing = proposals.find(p => p.id === existingId)!;
      saved = { ...existing, data, showLinePrices, total, clienteNome: data.cliente.razaoSocial, numero: data.numero, updatedAt: now };
    } else {
      saved = {
        id: crypto.randomUUID(),
        numero: data.numero,
        clienteNome: data.cliente.razaoSocial,
        total,
        createdAt: now,
        updatedAt: now,
        data,
        showLinePrices,
        revisao: editingProposal?.revisao,
        parentId: editingProposal?.parentId,
      };
    }

    await apiSaveProposal(saved);
    const updated = await apiLoadProposals();
    setProposals(updated);
    setViewingProposal(saved);
    setEditingProposal(null);
    setView('document');
  }

  async function handleDelete(id: string) {
    try {
      await apiDeleteProposal(id);
      setProposals(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Erro ao excluir proposta. Tente novamente.');
    }
  }

  function handleEdit(proposal: SavedProposal) {
    setEditingProposal(proposal);
    setViewingProposal(null);
    setView('form');
  }

  function handleRevision(proposal: SavedProposal) {
    const parentId = proposal.parentId || proposal.id;
    const baseNumero = proposal.numero.replace(/-REV\d+$/i, '');
    const allRelated = proposals.filter(p => p.parentId === parentId || p.id === parentId);
    const maxRev = allRelated.reduce((mx, p) => Math.max(mx, p.revisao ?? 0), 0);
    const nextRev = maxRev + 1;
    const revTemplate: SavedProposal = {
      ...proposal,
      id: '',
      numero: `${baseNumero}-REV${String(nextRev).padStart(2, '0')}`,
      revisao: nextRev,
      parentId,
    };
    setEditingProposal(revTemplate);
    setViewingProposal(null);
    setView('form');
  }

  function handleView(proposal: SavedProposal) {
    setViewingProposal(proposal);
    setView('document');
  }

  function handleNewProposal() {
    setEditingProposal(null);
    setViewingProposal(null);
    setView('form');
  }

  function handleBackToList() {
    setView('list');
    setEditingProposal(null);
    setViewingProposal(null);
    apiLoadProposals().then(setProposals).catch(() => {});
  }

  if (!authed) {
    return <LoginPage onAuth={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f3f5f8', fontFamily: "'Montserrat', sans-serif" }}>
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
          {view !== 'list' && (
            <button onClick={handleBackToList} className="btn-secondary-header">
              ← Propostas
            </button>
          )}
          {view === 'document' && viewingProposal && (
            <>
              <button onClick={() => handleRevision(viewingProposal)} className="btn-secondary-header">
                ↪ Criar Revisão
              </button>
              <button onClick={() => handleEdit(viewingProposal)} className="btn-secondary-header">
                ✎ Editar
              </button>
              <button onClick={() => window.print()} className="btn-primary-header">
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
            onClick={() => { sessionStorage.removeItem('rr-auth'); setAuthed(false); setView('list'); }}
            style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px' }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '32px 16px' }}>
        {loading && view === 'list' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666', fontSize: 14 }}>
            Carregando propostas...
          </div>
        )}
        {!loading && view === 'list' && (
          <ProposalList
            proposals={proposals}
            onNew={handleNewProposal}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRevise={handleRevision}
          />
        )}
        {!loading && view === 'form' && (
          <FormPage
            initialProposal={editingProposal}
            onSave={handleSave}
            revisionMode={!!(editingProposal && !editingProposal.id)}
          />
        )}
        {!loading && view === 'document' && viewingProposal && (
          <ProposalDocument
            data={viewingProposal.data}
            showLinePrices={viewingProposal.showLinePrices}
          />
        )}
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
