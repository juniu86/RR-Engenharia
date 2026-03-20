import type { ProposalData } from './App';

const RR = {
  razaoSocial: 'RR ENGENHARIA E SOLUÇÕES LTDA.',
  cnpj: '46.887.631/0001-75',
  endereco: 'Av. das Américas nº 4.200, Sala 106 do bloco 08, Edifício Geneve, Centro Empresarial Barrashopping, Barra da Tijuca, Rio de Janeiro/RJ CEP 22640-102',
  site: 'www.rres.com.br',
  email: 'contato@rres.com.br',
  slogan: 'Sua parceira em obras e instalações',
};

const OBRIGACOES_RR = [
  'Executar os serviços descritos nesta proposta com diligência e competência técnica.',
  'Designar um responsável técnico para acompanhamento e coordenação das atividades.',
  'Fornecer todos os equipamentos, ferramentas e mão de obra necessários à execução dos serviços.',
  'Cumprir todas as normas de segurança do trabalho e legislação ambiental aplicável.',
  'Emitir relatórios de progresso e documentação técnica conforme solicitado.',
  'Garantir a qualidade dos serviços prestados pelo prazo estabelecido em contrato.',
];

const CONDICOES_GERAIS = [
  'Esta proposta não contempla taxas, impostos ou obrigações fiscais incidentes sobre o contratante.',
  'Quaisquer alterações de escopo deverão ser formalizadas por escrito e poderão implicar em revisão de valores e prazos.',
  'A RR Engenharia reserva-se o direito de subcontratar serviços especializados, mantendo a responsabilidade técnica.',
  'Pendências na documentação de acesso ao local de trabalho poderão impactar o prazo de execução sem responsabilidade da contratada.',
  'Eventuais interferências não previstas (tubulações, estruturas, contaminações) serão tratadas como aditivos contratuais.',
  'Os serviços serão prestados em dias úteis, em horário comercial, salvo acordo específico em contrato.',
];

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function numberToWords(n: number): string {
  if (n === 0) return 'zero reais';
  const ones = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
    'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function toWords(num: number): string {
    if (num === 0) return '';
    if (num === 100) return 'cem';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' e ' + ones[num % 10] : '');
    const h = hundreds[Math.floor(num / 100)];
    const rest = num % 100;
    return rest ? h + ' e ' + toWords(rest) : h;
  }

  const reais = Math.floor(n);
  const centavos = Math.round((n - reais) * 100);
  const parts: string[] = [];

  if (reais >= 1000000) {
    const m = Math.floor(reais / 1000000);
    parts.push(toWords(m) + (m === 1 ? ' milhão' : ' milhões'));
  }
  if (reais % 1000000 >= 1000) {
    const t = Math.floor((reais % 1000000) / 1000);
    parts.push(toWords(t) + (t === 1 ? ' mil' : ' mil'));
  }
  if (reais % 1000 > 0) {
    parts.push(toWords(reais % 1000));
  }

  let result = parts.join(', ');
  const lastComma = result.lastIndexOf(', ');
  if (lastComma > 0 && !result.substring(lastComma + 2).includes(', ')) {
    result = result.substring(0, lastComma) + ' e ' + result.substring(lastComma + 2);
  }
  result += reais === 1 ? ' real' : ' reais';
  if (centavos > 0) result += ' e ' + toWords(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  return result;
}

interface Props {
  data: ProposalData;
  showLinePrices: boolean;
}

export default function ProposalDocument({ data, showLinePrices }: Props) {
  const total = (data.escopoTexto || !showLinePrices) && data.valorGlobal !== undefined
    ? data.valorGlobal
    : data.itens.reduce((s, i) => s + i.quantidade * i.valorUnitario, 0);
  const validadeDate = new Date(data.dataEmissao);
  validadeDate.setDate(validadeDate.getDate() + data.validadeDias);

  return (
    <div className="proposta-wrapper">
      {/* Accent bar */}
      <div style={{ height: 6, background: 'linear-gradient(90deg, #001c3d 0%, #0963ed 100%)', borderRadius: '4px 4px 0 0' }} />

      <div className="proposta-content">

        {/* Header */}
        <header className="proposta-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src="/logo-rr.png"
              alt="RR Engenharia"
              style={{ height: 52 }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#001c3d', letterSpacing: 1 }}>RR ENGENHARIA</div>
              <div style={{ fontSize: 11, color: '#666' }}>{RR.slogan}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>Proposta Comercial</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0963ed', lineHeight: 1.1 }}>Nº {data.numero}</div>
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{formatDate(data.dataEmissao)}</div>
          </div>
        </header>

        <div className="proposta-divider" />

        {/* RR Info */}
        <section className="proposta-section proposta-rr-box">
          <div className="proposta-dados-row">
            <div>
              <span className="proposta-label">Razão Social</span>
              <span className="proposta-valor">{RR.razaoSocial}</span>
            </div>
            <div>
              <span className="proposta-label">CNPJ</span>
              <span className="proposta-valor">{RR.cnpj}</span>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>
            <span className="proposta-label">Endereço</span>
            <span className="proposta-valor">{RR.endereco}</span>
          </div>
          <div className="proposta-dados-row" style={{ marginTop: 6 }}>
            <div>
              <span className="proposta-label">Site</span>
              <span className="proposta-valor">{RR.site}</span>
            </div>
            <div>
              <span className="proposta-label">E-mail</span>
              <span className="proposta-valor">{RR.email}</span>
            </div>
          </div>
        </section>

        {/* Client */}
        <section className="proposta-section proposta-cliente-box">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">TOMADOR DO SERVIÇO</span>
          </h2>
          <div className="proposta-dados-row">
            <div>
              <span className="proposta-label">Razão Social</span>
              <span className="proposta-valor fw-bold">{data.cliente.razaoSocial || '[NOME DO CLIENTE]'}</span>
            </div>
            <div>
              <span className="proposta-label">CNPJ</span>
              <span className="proposta-valor">{data.cliente.cnpj || '—'}</span>
            </div>
          </div>
          {data.cliente.endereco && (
            <div style={{ marginTop: 6 }}>
              <span className="proposta-label">Endereço</span>
              <span className="proposta-valor">{data.cliente.endereco}</span>
            </div>
          )}
          <div className="proposta-dados-row" style={{ marginTop: 6 }}>
            {data.cliente.contato && (
              <div>
                <span className="proposta-label">Contato</span>
                <span className="proposta-valor">{data.cliente.contato}</span>
              </div>
            )}
            {data.cliente.telefone && (
              <div>
                <span className="proposta-label">Telefone</span>
                <span className="proposta-valor">{data.cliente.telefone}</span>
              </div>
            )}
            {data.cliente.email && (
              <div>
                <span className="proposta-label">E-mail</span>
                <span className="proposta-valor">{data.cliente.email}</span>
              </div>
            )}
          </div>
          {data.cliente.localExecucao && (
            <div style={{ marginTop: 6 }}>
              <span className="proposta-label">Local de Execução</span>
              <span className="proposta-valor">{data.cliente.localExecucao}</span>
            </div>
          )}
        </section>

        {/* Intro text */}
        <section className="proposta-section">
          <p className="proposta-texto">
            <strong>Prezados,</strong> em atenção, apresentamos nossa proposta comercial para prestação de serviços de engenharia, com base nas diretrizes e necessidades apresentadas.
          </p>
        </section>

        {/* Scope */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">01</span>
            ESCOPO DOS SERVIÇOS
          </h2>

          {data.escopoTexto ? (
            <p className="proposta-texto" style={{ whiteSpace: 'pre-wrap' }}>{data.escopoTexto}</p>
          ) : (
            <table className="proposta-table">
              <thead>
                <tr>
                  <th style={{ width: 32, textAlign: 'center' }}>Nº</th>
                  <th>Descrição da Atividade</th>
                  <th style={{ width: 110, textAlign: 'center' }}>Quantidade</th>
                  {showLinePrices && <th style={{ width: 120, textAlign: 'right' }}>Vlr. Unit.</th>}
                  {showLinePrices && <th style={{ width: 130, textAlign: 'right' }}>Total</th>}
                </tr>
              </thead>
              <tbody>
                {data.itens.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center', color: '#666', fontSize: 11 }}>{idx + 1}</td>
                    <td>{item.descricao}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.quantidade.toLocaleString('pt-BR')} {item.unidade}
                    </td>
                    {showLinePrices && <td style={{ textAlign: 'right' }}>{formatCurrency(item.valorUnitario)}</td>}
                    {showLinePrices && <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.quantidade * item.valorUnitario)}</td>}
                  </tr>
                ))}
              </tbody>
              {showLinePrices && (
                <tfoot>
                  <tr className="proposta-table-total">
                    <td colSpan={4} style={{ textAlign: 'right', paddingRight: 16 }}>TOTAL GERAL</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(total)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </section>

        {/* Obligations */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">02</span>
            OBRIGAÇÕES DAS PARTES
          </h2>
          <h3 className="proposta-subsection-title">2.1 RR Engenharia</h3>
          <ul className="proposta-lista">
            {OBRIGACOES_RR.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <h3 className="proposta-subsection-title" style={{ marginTop: 16 }}>2.2 {data.cliente.razaoSocial || 'Contratante'}</h3>
          <ul className="proposta-lista">
            <li>Fornecer acesso às instalações e documentação necessária para execução dos serviços.</li>
            <li>Designar um responsável para acompanhamento e aprovação das etapas de execução.</li>
            <li>Efetuar os pagamentos nas condições e prazos acordados nesta proposta.</li>
            <li>Comunicar previamente qualquer restrição de acesso, horário ou condição especial.</li>
          </ul>
        </section>

        {/* Value */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">03</span>
            VALOR DOS SERVIÇOS
          </h2>
          <p className="proposta-texto">
            Nosso preço global para execução dos serviços descritos nesta proposta é de{' '}
            <strong style={{ fontSize: 15, color: '#001c3d' }}>{formatCurrency(total)}</strong>{' '}
            <span style={{ color: '#666', fontStyle: 'italic', fontSize: 11 }}>({numberToWords(total)})</span>.
          </p>
        </section>

        {/* Payment */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">04</span>
            CONDIÇÕES DE PAGAMENTO
          </h2>
          <p className="proposta-texto">{data.condicoesPagamento}</p>
        </section>

        {/* Execution time */}
        {data.prazoExecucao && (
          <section className="proposta-section">
            <h2 className="proposta-section-title">
              <span className="proposta-section-num">05</span>
              PRAZO DE EXECUÇÃO
            </h2>
            <p className="proposta-texto">{data.prazoExecucao}</p>
          </section>
        )}

        {/* General conditions */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">{data.prazoExecucao ? '06' : '05'}</span>
            CONDIÇÕES GERAIS
          </h2>
          <ul className="proposta-lista">
            {CONDICOES_GERAIS.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          {data.observacoes && (
            <div style={{ marginTop: 12, padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
              <strong style={{ fontSize: 11, color: '#92400e', textTransform: 'uppercase', letterSpacing: 0.5 }}>Observações adicionais</strong>
              <p style={{ marginTop: 6, fontSize: 12, color: '#001c3d' }}>{data.observacoes}</p>
            </div>
          )}
        </section>

        {/* Validity */}
        <section className="proposta-section">
          <h2 className="proposta-section-title">
            <span className="proposta-section-num">{data.prazoExecucao ? '07' : '06'}</span>
            VALIDADE DA PROPOSTA
          </h2>
          <p className="proposta-texto">
            Esta proposta tem validade de <strong>{data.validadeDias} dias</strong> a contar do envio dessa proposta, sendo válida até <strong>{formatDate(validadeDate)}</strong>.
          </p>
        </section>

        {/* Signature */}
        <section className="proposta-assinatura">
          <div className="proposta-divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: 13, color: '#444', marginBottom: 48 }}>Atenciosamente,</p>
              <div style={{ width: 240, borderBottom: '2px solid #001c3d', marginBottom: 8 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/logo-rr.png" alt="RR Engenharia" style={{ height: 32 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#001c3d' }}>{RR.razaoSocial}</p>
                  <p style={{ fontSize: 11, color: '#666' }}>CNPJ: {RR.cnpj}</p>
                </div>
              </div>
            </div>
            <div style={{ minWidth: 260, textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#999', marginBottom: 40, textAlign: 'right' }}>Ciente e de acordo:</p>
              <div style={{ borderBottom: '2px solid #001c3d', marginBottom: 10 }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: '#001c3d' }}>{data.cliente.razaoSocial}</p>
              {data.cliente.contato && <p style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{data.cliente.contato}</p>}
              <p style={{ fontSize: 10, color: '#aaa', marginTop: 10 }}>Data: ___/___/______</p>
            </div>
          </div>
          <p style={{ marginTop: 24, fontSize: 10, color: '#999', textAlign: 'center' }}>
            Proposta emitida em {formatDate(data.dataEmissao)}
          </p>
        </section>

        {/* Footer */}
        <footer className="proposta-footer">
          <div style={{ height: 4, background: 'linear-gradient(90deg, #001c3d 0%, #0963ed 100%)', marginBottom: 12 }} />
          <p style={{ fontSize: 10 }}>{RR.endereco}</p>
          <p style={{ fontSize: 10 }}>CNPJ: {RR.cnpj} • {RR.site} • {RR.email}</p>
        </footer>

      </div>

      <style>{`
        .proposta-wrapper {
          max-width: 860px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
          border-radius: 4px;
          font-family: 'Montserrat', sans-serif;
        }
        .proposta-content { padding: 40px 52px; }
        .proposta-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .proposta-divider {
          border: none;
          border-top: 2px solid #f0f0f0;
          margin: 16px 0;
        }
        .proposta-section { margin-bottom: 28px; }
        .proposta-rr-box {
          background: #f8f9fb;
          border-radius: 10px;
          padding: 16px 20px;
        }
        .proposta-cliente-box {
          background: #f0f7ff;
          border: 1.5px solid #bdd9f7;
          border-radius: 10px;
          padding: 16px 20px;
        }
        .proposta-dados-row {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }
        .proposta-label {
          display: block;
          font-size: 9px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .proposta-valor {
          display: block;
          font-size: 12px;
          color: #001c3d;
        }
        .proposta-valor.fw-bold { font-weight: 700; }
        .proposta-section-title {
          font-size: 12px;
          font-weight: 800;
          color: #001c3d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .proposta-section-num {
          background: #001c3d;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
        }
        .proposta-subsection-title {
          font-size: 11px;
          font-weight: 700;
          color: #001c3d;
          margin-bottom: 8px;
        }
        .proposta-texto {
          font-size: 12px;
          color: #444;
          line-height: 1.7;
        }
        .proposta-lista {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .proposta-lista li {
          font-size: 12px;
          color: #444;
          line-height: 1.6;
          padding: 3px 0 3px 18px;
          position: relative;
        }
        .proposta-lista li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #0963ed;
          font-size: 10px;
          top: 5px;
        }
        .proposta-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .proposta-table th {
          background: #001c3d;
          color: white;
          padding: 8px 12px;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .proposta-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          color: #333;
        }
        .proposta-table tbody tr:nth-child(even) td {
          background: #f9f9f9;
        }
        .proposta-table-total td {
          background: #001c3d !important;
          color: white;
          font-weight: 800;
          font-size: 14px;
          padding: 12px 12px;
        }
        .proposta-assinatura { margin-top: 40px; }
        .proposta-footer {
          margin-top: 32px;
          padding-top: 0;
          text-align: center;
          color: #999;
        }

        @media print {
          .proposta-wrapper { box-shadow: none; border-radius: 0; }
          .proposta-content { padding: 20px 32px; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}
