import type { SavedProposal } from './App';

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(d));
}

interface Props {
  proposals: SavedProposal[];
  onNew: () => void;
  onView: (p: SavedProposal) => void;
  onEdit: (p: SavedProposal) => void;
  onDelete: (id: string) => void;
  onRevise?: (p: SavedProposal) => void;
}

export default function ProposalList({ proposals, onNew, onView, onEdit, onDelete, onRevise }: Props) {
  function handleDelete(id: string, numero: string) {
    if (window.confirm(`Excluir a proposta ${numero}? Esta ação não pode ser desfeita.`)) {
      onDelete(id);
    }
  }

  const sorted = [...proposals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#001c3d', margin: 0 }}>Propostas Comerciais</h1>
          <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0' }}>
            {proposals.length} proposta{proposals.length !== 1 ? 's' : ''} salva{proposals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onNew}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: '0 4px 16px rgba(9,99,237,0.3)',
            transition: 'box-shadow 0.2s',
          }}
        >
          + Nova Proposta
        </button>
      </div>

      {proposals.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          padding: '60px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#001c3d', marginBottom: 8 }}>Nenhuma proposta ainda</h2>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>Crie sua primeira proposta comercial clicando no botão acima.</p>
          <button
            onClick={onNew}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #0963ed 0%, #0751c8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif",
              boxShadow: '0 4px 16px rgba(9,99,237,0.3)',
            }}
          >
            + Nova Proposta
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(p => (
            <div
              key={p.id}
              style={{
                background: 'white',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Number badge */}
              <div style={{
                background: p.revisao ? '#0963ed' : '#001c3d',
                color: 'white',
                borderRadius: 8,
                padding: '8px 14px',
                textAlign: 'center',
                minWidth: 130,
                flexShrink: 0,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.65, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {p.revisao ? `Revisão ${String(p.revisao).padStart(2, '0')}` : 'Proposta'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, marginTop: 3, letterSpacing: 0.5 }}>{p.numero}</div>
              </div>

              {/* Client info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#001c3d',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {p.clienteNome}
                </div>
                <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>
                  Criada em {formatDate(p.createdAt)}
                  {p.updatedAt !== p.createdAt && (
                    <span> · Editada em {formatDate(p.updatedAt)}</span>
                  )}
                  <span style={{ marginLeft: 8, color: '#ccc' }}>·</span>
                  <span style={{ marginLeft: 8 }}>{p.data.itens.length} item{p.data.itens.length !== 1 ? 's' : ''}</span>
                  {!p.showLinePrices && (
                    <span style={{
                      marginLeft: 8,
                      background: '#f0f7ff',
                      color: '#0963ed',
                      borderRadius: 4,
                      padding: '1px 6px',
                      fontSize: 10,
                      fontWeight: 600,
                    }}>
                      Preço global
                    </span>
                  )}
                </div>
              </div>

              {/* Total */}
              <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0963ed' }}>{formatCurrency(p.total)}</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => onView(p)}
                  title="Visualizar proposta"
                  style={{
                    padding: '7px 14px',
                    background: '#f0f7ff',
                    color: '#0963ed',
                    border: '1px solid #bdd9f7',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Ver
                </button>
                <button
                  onClick={() => onEdit(p)}
                  title="Editar proposta"
                  style={{
                    padding: '7px 14px',
                    background: '#f8f9fb',
                    color: '#001c3d',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.numero)}
                  title="Excluir proposta"
                  style={{
                    padding: '7px 12px',
                    background: 'none',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
