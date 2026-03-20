import { useState, useEffect, useRef } from 'react';
import type { ProposalData, LineItem, SavedProposal } from './App';
import { peekNextNumber, consumeNextNumber } from './App';

const DEFAULT_CONDICOES = 'Sinal de 40%, e medições semanais de acordo com os descritivos da planilha com o cronograma.';
const DEFAULT_VALIDADE = 30;

function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

async function fetchCNPJ(cnpj: string) {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) throw new Error('CNPJ deve ter 14 dígitos');
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('CNPJ não encontrado na base da Receita Federal');
    throw new Error('Erro ao consultar CNPJ. Tente novamente.');
  }
  const data = await res.json();
  const parts = [data.logradouro, data.numero, data.complemento, data.bairro, `${data.municipio}/${data.uf}`, `CEP ${data.cep}`].filter(Boolean);
  return {
    razaoSocial: data.razao_social as string,
    endereco: parts.join(', '),
  };
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

let nextId = 1;
function newItem(): LineItem {
  return { id: nextId++, descricao: '', unidade: 'un', quantidade: 1, valorUnitario: 0 };
}

interface Props {
  initialProposal: SavedProposal | null;
  onSave: (data: ProposalData, showLinePrices: boolean, existingId?: string) => void;
  revisionMode?: boolean;
}

export default function FormPage({ initialProposal, onSave, revisionMode }: Props) {
  const isEditing = !!initialProposal && !!initialProposal.id && !revisionMode;
  const initial = initialProposal?.data;

  // Track if user manually edited the number field
  const numberAutoRef = useRef(!isEditing);

  const [numero, setNumero] = useState(() => {
    // For revisions, use the REV-suffixed number from the template (not the original data.numero)
    if (revisionMode && initialProposal) return initialProposal.numero;
    if (initial) return initial.numero;
    return '';
  });
  const [seqPreview, setSeqPreview] = useState<string>('');
  const [cnpj, setCnpj] = useState(initial?.cliente.cnpj ?? '');
  const [razaoSocial, setRazaoSocial] = useState(initial?.cliente.razaoSocial ?? '');
  const [endereco, setEndereco] = useState(initial?.cliente.endereco ?? '');
  const [contato, setContato] = useState(initial?.cliente.contato ?? '');
  const [telefone, setTelefone] = useState(initial?.cliente.telefone ?? '');
  const [email, setEmail] = useState(initial?.cliente.email ?? '');
  const [localExecucao, setLocalExecucao] = useState(initial?.cliente.localExecucao ?? '');
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState('');
  const [itens, setItens] = useState<LineItem[]>(() => {
    if (initial?.itens.length) return initial.itens.map(i => ({ ...i }));
    return [newItem()];
  });
  const [prazoExecucao, setPrazoExecucao] = useState(initial?.prazoExecucao ?? '');
  const [condicoesPagamento, setCondicoesPagamento] = useState(initial?.condicoesPagamento ?? DEFAULT_CONDICOES);
  const [observacoes, setObservacoes] = useState(initial?.observacoes ?? '');
  const [validadeDias, setValidadeDias] = useState(initial?.validadeDias ?? DEFAULT_VALIDADE);
  const [showLinePrices, setShowLinePrices] = useState(initialProposal ? (initialProposal.showLinePrices ?? true) : true);
  const [valorGlobal, setValorGlobal] = useState(initial?.valorGlobal ?? 0);

  // Auto-update proposal number when razaoSocial changes (new proposals only)
  useEffect(() => {
    if (!isEditing && numberAutoRef.current && razaoSocial.trim()) {
      peekNextNumber(razaoSocial).then(num => {
        setNumero(num);
        setSeqPreview(num);
      }).catch(() => {});
    }
  }, [razaoSocial, isEditing]);

  async function handleBuscarCNPJ() {
    setCnpjLoading(true);
    setCnpjError('');
    try {
      const result = await fetchCNPJ(cnpj);
      setRazaoSocial(result.razaoSocial);
      setEndereco(result.endereco);
    } catch (e) {
      setCnpjError(e instanceof Error ? e.message : 'Erro ao buscar CNPJ');
    } finally {
      setCnpjLoading(false);
    }
  }

  function handleCnpjChange(v: string) {
    setCnpj(formatCNPJ(v));
    setCnpjError('');
  }

  function handleNumeroChange(v: string) {
    numberAutoRef.current = false;
    setNumero(v);
  }

  function addItem() { setItens(prev => [...prev, newItem()]); }
  function removeItem(id: number) { setItens(prev => prev.filter(i => i.id !== id)); }
  function updateItem(id: number, field: keyof LineItem, value: string | number) {
    setItens(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  const total = itens.reduce((s, i) => s + i.quantidade * i.valorUnitario, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!razaoSocial.trim()) { alert('Informe a razão social do cliente'); return; }
    if (showLinePrices && total <= 0) { alert('Informe os valores dos itens da proposta'); return; }
    if (!showLinePrices && valorGlobal <= 0) { alert('Informe o valor total dos serviços'); return; }

    // For new proposals (including revisions), consume the sequential number if auto-generated
    let finalNumero = numero.trim();
    if (!isEditing && !revisionMode && numberAutoRef.current) {
      finalNumero = await consumeNextNumber(razaoSocial);
    } else if (!isEditing && !revisionMode && !finalNumero) {
      finalNumero = await consumeNextNumber(razaoSocial);
    } else if (revisionMode) {
      // Revision keeps the pre-set numero (with REV suffix), no counter consumed
      finalNumero = finalNumero || initialProposal!.numero;
    }

    const data: ProposalData = {
      numero: finalNumero,
      dataEmissao: isEditing ? initial!.dataEmissao : new Date(),
      validadeDias,
      cliente: { razaoSocial, cnpj, endereco, contato, telefone, email, localExecucao },
      itens: itens.filter(i => i.descricao.trim()),
      valorGlobal: showLinePrices ? undefined : valorGlobal,
      prazoExecucao,
      condicoesPagamento,
      observacoes,
    };

    onSave(data, showLinePrices, isEditing ? initialProposal?.id : undefined);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 760, margin: '0 auto' }}>

      {(isEditing || revisionMode) && (
        <div style={{
          background: revisionMode ? '#f0f7ff' : '#fffbeb',
          border: `1.5px solid ${revisionMode ? '#bdd9f7' : '#fde68a'}`,
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          fontSize: 12,
          color: revisionMode ? '#0963ed' : '#92400e',
          fontWeight: 600,
        }}>
          {revisionMode
            ? <>↪ Criando revisão — será salva como <strong>{initialProposal!.numero}</strong>.</>
            : <>✎ Editando proposta <strong>{initialProposal!.numero}</strong> — as alterações substituirão a versão salva.</>
          }
        </div>
      )}

      {/* Identification */}
      <Card title="Identificação da Proposta">
        <div className="form-grid-2">
          <Field label="Número da Proposta">
            <input
              className="form-input"
              value={numero}
              onChange={e => handleNumeroChange(e.target.value)}
              placeholder={razaoSocial ? (seqPreview || 'Aguardando...') : 'Preencha o cliente para gerar automaticamente'}
            />
            {!isEditing && !revisionMode && (
              <p style={{ fontSize: 10, color: '#999', margin: '4px 0 0' }}>
                Gerado automaticamente ao salvar. Formato: CLIENTE-ANO-SEQ (reinicia todo ano).
              </p>
            )}
          </Field>
          <Field label="Validade (dias)">
            <input
              className="form-input"
              type="number"
              min={1}
              value={validadeDias}
              onChange={e => setValidadeDias(Number(e.target.value))}
            />
          </Field>
        </div>

      </Card>

      {/* Client */}
      <Card title="Dados do Cliente">
        <Field label="CNPJ do Cliente">
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              value={cnpj}
              onChange={e => handleCnpjChange(e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn-buscar" onClick={handleBuscarCNPJ} disabled={cnpjLoading}>
              {cnpjLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {cnpjError && <p className="form-error">{cnpjError}</p>}
        </Field>
        <div className="form-grid-2">
          <Field label="Razão Social *">
            <input
              className="form-input"
              value={razaoSocial}
              onChange={e => setRazaoSocial(e.target.value)}
              placeholder="Razão social do cliente"
              required
            />
          </Field>
          <Field label="Contato / Responsável">
            <input className="form-input" value={contato} onChange={e => setContato(e.target.value)} placeholder="Nome do responsável" />
          </Field>
        </div>
        <Field label="Endereço">
          <input className="form-input" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Logradouro, número, bairro, cidade/UF" />
        </Field>
        <div className="form-grid-2">
          <Field label="Telefone">
            <input className="form-input" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(21) 99999-9999" />
          </Field>
          <Field label="E-mail">
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@empresa.com.br" type="email" />
          </Field>
        </div>
        <Field label="Local de Execução (se diferente do endereço)">
          <input className="form-input" value={localExecucao} onChange={e => setLocalExecucao(e.target.value)} placeholder="Endereço do local de execução" />
        </Field>
      </Card>

      {/* Services / Items */}
      <Card title="Escopo e Precificação">
        <Field label="Abertura de Custos na Proposta">
          <select
            className="form-input"
            value={showLinePrices ? 'detalhado' : 'global'}
            onChange={e => setShowLinePrices(e.target.value === 'detalhado')}
          >
            <option value="detalhado">Detalhado por item — exibe valor unitário e total de cada linha</option>
            <option value="global">Valor Global — exibe apenas o valor total dos serviços</option>
          </select>
        </Field>

        <div className="items-table">
          <div className="items-header">
            <span style={{ flex: '2 1 0' }}>Descrição</span>
            <span style={{ width: 70, textAlign: 'center' }}>Un.</span>
            <span style={{ width: 80, textAlign: 'center' }}>Qtd</span>
            {showLinePrices && <span style={{ width: 120, textAlign: 'right' }}>Vlr. Unit.</span>}
            {showLinePrices && <span style={{ width: 120, textAlign: 'right' }}>Total</span>}
            <span style={{ width: 36 }}></span>
          </div>

          {itens.map((item, idx) => (
            <div key={item.id} className="items-row">
              <div style={{ flex: '2 1 0', minWidth: 0 }}>
                <input
                  className="item-input"
                  value={item.descricao}
                  onChange={e => updateItem(item.id, 'descricao', e.target.value)}
                  placeholder={`Item ${idx + 40}`}
                />
              </div>
              <div style={{ width: 70 }}>
                <input
                  className="item-input text-center"
                  value={item.unidade}
                  onChange={e => updateItem(item.id, 'unidade', e.target.value)}
                />
              </div>
              <div style={{ width: 80 }}>
                <input
                  className="item-input text-center"
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.quantidade}
                  onChange={e => updateItem(item.id, 'quantidade', Number(e.target.value))}
                />
              </div>
              {showLinePrices && (
                <div style={{ width: 120 }}>
                  <input
                    className="item-input text-right"
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.valorUnitario || ''}
                    placeholder="0,00"
                    onChange={e => updateItem(item.id, 'valorUnitario', Number(e.target.value))}
                  />
                </div>
              )}
              {showLinePrices && (
                <div style={{ width: 120, textAlign: 'right', padding: '0 8px', fontSize: 13, fontWeight: 600, color: '#0963ed', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {formatCurrency(item.quantidade * item.valorUnitario)}
                </div>
              )}
              <div style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={itens.length === 1}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4, borderRadius: 4, opacity: itens.length === 1 ? 0.3 : 1 }}
                  title="Remover item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {showLinePrices && (
            <div className="items-total-row">
              <span style={{ flex: 1 }}>TOTAL GERAL</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#001c3d' }}>{formatCurrency(total)}</span>
            </div>
          )}
        </div>

        <button type="button" onClick={addItem} className="btn-add-item">
          + Adicionar item
        </button>

        {!showLinePrices && (
          <div style={{ marginTop: 18 }}>
            <Field label="Valor Total dos Serviços *">
              <input
                className="form-input"
                type="number"
                min={0}
                step={0.01}
                value={valorGlobal || ''}
                placeholder="0,00"
                onChange={e => setValorGlobal(Number(e.target.value))}
                style={{ fontSize: 16, fontWeight: 700 }}
              />
              <p style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                Valor único exibido na proposta — os itens acima definem o escopo sem abertura de preços.
              </p>
            </Field>
          </div>
        )}
      </Card>

      {/* Conditions */}
      <Card title="Condições Comerciais">
        <Field label="Prazo de Execução">
          <input
            className="form-input"
            value={prazoExecucao}
            onChange={e => setPrazoExecucao(e.target.value)}
            placeholder="Ex: 30 dias corridos após aprovação e assinatura do contrato"
          />
        </Field>
        <Field label="Condições de Pagamento">
          <textarea
            className="form-input"
            rows={3}
            value={condicoesPagamento}
            onChange={e => setCondicoesPagamento(e.target.value)}
          />
        </Field>
        <Field label="Observações / Exclusões">
          <textarea
            className="form-input"
            rows={3}
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Informações adicionais, exclusões do escopo, notas..."
          />
        </Field>
      </Card>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <button type="submit" className="btn-gerar">
          {revisionMode ? '↪ Salvar Revisão →' : isEditing ? '✓ Salvar Alterações' : 'Gerar Proposta →'}
        </button>
      </div>

      <style>{`
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Montserrat', sans-serif;
          outline: none;
          transition: border-color 0.15s;
          color: #001c3d;
          background: white;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: #0963ed; box-shadow: 0 0 0 3px rgba(9,99,237,0.1); }
        .form-error { color: #ef4444; font-size: 11px; margin: 4px 0 0; }
        .btn-buscar {
          padding: 10px 18px;
          background: #0963ed;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-buscar:hover { background: #0751c8; }
        .btn-buscar:disabled { opacity: 0.6; cursor: not-allowed; }

        .items-table { border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .items-header {
          display: flex;
          gap: 0;
          background: #f8f9fb;
          padding: 8px 12px;
          border-bottom: 1.5px solid #e5e7eb;
          font-size: 11px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .items-row {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          gap: 0;
        }
        .items-row:last-of-type { border-bottom: none; }
        .item-input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          outline: none;
        }
        .item-input:focus { border-color: #0963ed; }
        .item-input.text-center { text-align: center; }
        .item-input.text-right { text-align: right; }
        .items-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f0f7ff;
          border-top: 2px solid #0963ed;
          font-size: 13px;
          font-weight: 700;
          color: #001c3d;
        }
        .btn-add-item {
          margin-top: 12px;
          padding: 8px 16px;
          background: none;
          border: 1.5px dashed #0963ed;
          border-radius: 8px;
          color: #0963ed;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.2s;
        }
        .btn-add-item:hover { background: #f0f7ff; }
        .btn-gerar {
          padding: 14px 48px;
          background: linear-gradient(135deg, #0963ed 0%, #0751c8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          box-shadow: 0 4px 20px rgba(9,99,237,0.3);
          transition: all 0.2s;
        }
        .btn-gerar:hover { box-shadow: 0 6px 28px rgba(9,99,237,0.45); transform: translateY(-1px); }
      `}</style>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '24px 28px', marginBottom: 20 }}>
      <h2 style={{ fontSize: 13, fontWeight: 800, color: '#001c3d', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18, paddingBottom: 10, borderBottom: '2px solid #f0f0f0' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}
