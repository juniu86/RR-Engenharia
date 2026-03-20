import { useState } from 'react';
import type { SavedProposal, ProposalStatus } from './App';

const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; bg: string; border: string }> = {
  rascunho:      { label: 'Rascunho',       color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
  enviada:       { label: 'Enviada',         color: '#0963ed', bg: '#eff6ff', border: '#bdd9f7' },
  em_negociacao: { label: 'Em Negociação',   color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  ganha:         { label: 'Ganha',           color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
  perdida:       { label: 'Perdida',         color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  cancelada:     { label: 'Cancelada',       color: '#9ca3af', bg: '#f9fafb', border: '#e5e7eb' },
};

const FILTER_TABS: { key: ProposalStatus | 'todas'; label: string }[] = [
  { key: 'todas',        label: 'Todas' },
  { key: 'rascunho',     label: 'Rascunho' },
  { key: 'enviada',      label: 'Enviada' },
  { key: 'em_negociacao',label: 'Em Negociação' },
  { key: 'ganha',        label: 'Ganha' },
  { key: 'perdida',      label: 'Perdida' },
  { key: 'cancelada',    label: 'Cancelada' },
];

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(d));
}

function daysUntilExpiry(p: SavedProposal): number | null {
  if (p.status !== 'enviada' && p.status !== 'em_negociacao') return null;
  const emissao = new Date(p.data.dataEmissao);
  const expiry = new Date(emissao);
  expiry.setDate(expiry.getDate() + p.data.validadeDias);
  return Math.ceil((expiry.getTime() - Date.now()) / 86400000);
}

interface Props {
  proposals: SavedProposal[];
  onNew: () => void;
  onView: (p: SavedProposal) => void;
  onEdit: (p: SavedProposal) => void;
  onDelete: (id: string) => void;
  onRevise?: (p: SavedProposal) => void;
  onStatusChange: (id: string, status: ProposalStatus, motivoPerda?: string) => void;
}

export default function ProposalList({ proposals, onNew, onView, onEdit, onDelete, onRevise, onStatusChange }: Props) {
  const [filter, setFilter] = useState<ProposalStatus | 'todas'>('todas');
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const pipeline = proposals
    .filter(p => p.status === 'enviada' || p.status === 'em_negociacao')
    .reduce((s, p) => s + p.total, 0);

  const now = new Date();
  const ganhasNoMes = proposals
    .filter(p => {
      if (p.status !== 'ganha') return false;
      const d = new Date(p.updatedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + p.total, 0);

  const totalDecididas = proposals.filter(p => p.status === 'ganha' || p.status === 'perdida').length;
  const totalGanhas = proposals.filter(p => p.status === 'ganha').length;
  const taxaConversao = totalDecididas > 0 ? Math.round((totalGanhas / totalDecididas) * 100) : null;

  // ── Filter & sort ──────────────────────────────────────────────────────────
  const filtered = [...proposals]
    .filter(p => filter === 'todas' || p.status === filter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  function handleDelete(id: string, numero: string) {
    if (window.confirm(`Excluir a proposta ${numero}? Esta ação não pode ser desfeita.`)) {
      onDelete(id);
    }
  }

  function handleStatusSelect(p: SavedProposal, newStatus: ProposalStatus) {
    if (newStatus === p.status) { setChangingStatus(null); return; }
    if (newStatus === 'perdida' || newStatus === 'cancelada') {
      const motivo = window.prompt(
        `Motivo da ${newStatus === 'perdida' ? 'perda' : 'cancelamento'} (opcional):`
      );
      onStatusChange(p.id, newStatus, motivo ?? undefined);
    } else {
      onStatusChange(p.id, newStatus);
    }
    setChangingStatus(null);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#001c3d', margin: 0 }}>Propostas Comerciais</h1>
          <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0' }}>
            {proposals.length} proposta{proposals.length !== 1 ? 's' : ''} no total
          </p>
        </div>
        <button onClick={onNew} style={{
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)',
          color: 'white', border: 'none', borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          boxShadow: '0 4px 16px rgba(9,99,237,0.3)',
        }}>
          + Nova Proposta
        </button>
      </div>

      {/* KPI Cards */}
      {proposals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <KpiCard
            label="Em Pipeline"
            value={formatCurrency(pipeline)}
            sub="enviadas + em negociação"
            color="#0963ed"
          />
          <KpiCard
            label="Ganhas no Mês"
            value={formatCurrency(ganhasNoMes)}
            sub={`${now.toLocaleString('pt-BR', { month: 'long' })} de ${now.getFullYear()}`}
            color="#059669"
          />
          <KpiCard
            label="Taxa de Conversão"
            value={taxaConversao !== null ? `${taxaConversao}%` : '—'}
            sub={totalDecididas > 0 ? `${totalGanhas} de ${totalDecididas} decididas` : 'nenhuma fechada ainda'}
            color={taxaConversao !== null && taxaConversao >= 50 ? '#059669' : '#d97706'}
          />
        </div>
      )}

      {/* Filter tabs */}
      {proposals.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {FILTER_TABS.map(tab => {
            const count = tab.key === 'todas'
              ? proposals.length
              : proposals.filter(p => p.status === tab.key).length;
            const active = filter === tab.key;
            const cfg = tab.key !== 'todas' ? STATUS_CONFIG[tab.key] : null;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `1.5px solid ${active ? (cfg?.border ?? '#001c3d') : '#e5e7eb'}`,
                  background: active ? (cfg?.bg ?? '#f0f7ff') : 'white',
                  color: active ? (cfg?.color ?? '#001c3d') : '#666',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Montserrat', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {tab.label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {proposals.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          padding: '60px 40px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#001c3d', marginBottom: 8 }}>Nenhuma proposta ainda</h2>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>Crie sua primeira proposta comercial clicando no botão acima.</p>
          <button onClick={onNew} style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: '0 4px 16px rgba(9,99,237,0.3)',
          }}>
            + Nova Proposta
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '40px', textAlign: 'center', color: '#999', fontSize: 13,
        }}>
          Nenhuma proposta com status "{STATUS_CONFIG[filter as ProposalStatus]?.label}".
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(p => {
            const cfg = STATUS_CONFIG[p.status ?? 'rascunho'];
            const days = daysUntilExpiry(p);
            const expiring = days !== null && days <= 5;

            return (
              <div key={p.id} style={{
                background: 'white', borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                borderLeft: `4px solid ${cfg.color}`,
              }}>
                {/* Number badge */}
                <div style={{
                  background: p.revisao ? '#0963ed' : '#001c3d',
                  color: 'white', borderRadius: 8, padding: '7px 12px',
                  textAlign: 'center', minWidth: 120, flexShrink: 0,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.65, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {p.revisao ? `Revisão ${String(p.revisao).padStart(2, '0')}` : 'Proposta'}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, marginTop: 3, letterSpacing: 0.5 }}>{p.numero}</div>
                </div>

                {/* Client info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#001c3d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.clienteNome}
                  </div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 3, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span>Criada {formatDate(p.createdAt)}</span>
                    {expiring && (
                      <span style={{
                        background: days! <= 0 ? '#fef2f2' : '#fffbeb',
                        color: days! <= 0 ? '#dc2626' : '#d97706',
                        border: `1px solid ${days! <= 0 ? '#fca5a5' : '#fcd34d'}`,
                        borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700,
                      }}>
                        {days! <= 0 ? 'VENCIDA' : `Vence em ${days}d`}
                      </span>
                    )}
                    {p.motivoPerda && (
                      <span style={{ color: '#dc2626', fontSize: 10, fontStyle: 'italic' }} title={p.motivoPerda}>
                        ↳ {p.motivoPerda.length > 40 ? p.motivoPerda.slice(0, 40) + '…' : p.motivoPerda}
                      </span>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0963ed' }}>{formatCurrency(p.total)}</div>
                </div>

                {/* Status badge / selector */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  {changingStatus === p.id ? (
                    <select
                      autoFocus
                      value={p.status ?? 'rascunho'}
                      onChange={e => handleStatusSelect(p, e.target.value as ProposalStatus)}
                      onBlur={() => setChangingStatus(null)}
                      style={{
                        padding: '5px 10px', borderRadius: 20,
                        border: `1.5px solid ${cfg.border}`,
                        background: cfg.bg, color: cfg.color,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setChangingStatus(p.id)}
                      title="Clique para alterar o status"
                      style={{
                        padding: '5px 12px', borderRadius: 20,
                        border: `1.5px solid ${cfg.border}`,
                        background: cfg.bg, color: cfg.color,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Montserrat', sans-serif",
                        transition: 'opacity 0.15s',
                      }}
                    >
                      {cfg.label} ▾
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => onView(p)} style={btnStyle('#f0f7ff', '#0963ed', '#bdd9f7')}>Ver</button>
                  <button onClick={() => onEdit(p)} style={btnStyle('#f8f9fb', '#001c3d', '#e5e7eb')}>Editar</button>
                  {onRevise && (
                    <button onClick={() => onRevise(p)} title="Criar revisão" style={btnStyle('#f8f9fb', '#6b7280', '#e5e7eb')}>↪</button>
                  )}
                  <button
                    onClick={() => handleDelete(p.id, p.numero)}
                    style={{ padding: '7px 10px', background: 'none', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: "'Montserrat', sans-serif" }}
                  >✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      padding: '16px 20px',
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color, marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function btnStyle(bg: string, color: string, border: string): React.CSSProperties {
  return {
    padding: '7px 12px', background: bg, color, border: `1px solid ${border}`,
    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
  };
}
