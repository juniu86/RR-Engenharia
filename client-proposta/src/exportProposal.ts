import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  convertInchesToTwip,
} from 'docx';
import type { ProposalData } from './App';

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
function fmtCur(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

// ── PDF ──────────────────────────────────────────────────────────────────────
// Corta a página em uma linha de fundo (espaço em branco), nunca no meio de um
// texto ou tabela. O gerador antigo fatiava a imagem em altura fixa e partia o
// conteúdo na emenda das páginas. Se o canvas estiver "tainted" (imagem cross-
// origin), getImageData lança e caímos no corte por altura fixa (modo antigo).
export async function downloadPDF(element: HTMLElement, numero: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const pxPerMm = canvas.width / pageW;          // px do canvas por mm do A4
  const pageHpx = Math.floor(pageH * pxPerMm);   // altura de 1 pagina em px

  const ctx = canvas.getContext('2d');
  let canScan = !!ctx;

  const isBlankRow = (y: number): boolean => {
    if (!ctx) return false;
    try {
      const { data } = ctx.getImageData(0, y, canvas.width, 1);
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) continue;                 // pixel transparente = fundo
        if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) return false;
      }
      return true;
    } catch {
      canScan = false;                                   // canvas tainted: desliga scan
      return false;
    }
  };

  const minPagePx = Math.floor(pageHpx * 0.5);     // evita pagina curta demais
  const searchWindow = Math.floor(pageHpx * 0.18); // procura corte ate 18% acima da emenda

  let sy = 0;        // inicio do recorte (px no canvas)
  let first = true;

  while (sy < canvas.height) {
    let sliceH = Math.min(pageHpx, canvas.height - sy);

    // Nao sendo o ultimo pedaco, sobe procurando uma linha de fundo pra cortar.
    if (canScan && sy + sliceH < canvas.height) {
      const boundary = sy + sliceH;
      const limit = Math.max(sy + minPagePx, boundary - searchWindow);
      for (let y = boundary; y >= limit; y--) {
        if (isBlankRow(y)) {
          sliceH = y - sy;
          break;
        }
      }
    }

    // Recorta o pedaco num canvas proprio e adiciona como pagina do PDF.
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceH;
    const sctx = slice.getContext('2d');
    if (sctx) {
      sctx.fillStyle = '#ffffff';
      sctx.fillRect(0, 0, slice.width, slice.height);
      sctx.drawImage(canvas, 0, sy, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
    }

    const imgData = slice.toDataURL('image/jpeg', 0.92);
    const imgHmm = sliceH / pxPerMm;
    if (!first) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgHmm);
    first = false;

    sy += sliceH;
  }

  pdf.save(`Proposta-${numero}.pdf`);
}

// ── Word ─────────────────────────────────────────────────────────────────────
const DARK = '001C3D';
const BLUE = '0963ED';

const darkHeading = (text: string): Paragraph =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: DARK, size: 22 })],
    spacing: { before: 280, after: 100 },
  });

const subHeading = (text: string): Paragraph =>
  new Paragraph({
    children: [new TextRun({ text, bold: true, color: DARK, size: 20 })],
    spacing: { before: 160, after: 80 },
  });

const body = (text: string, opts?: { italic?: boolean; color?: string }): Paragraph =>
  new Paragraph({
    children: [new TextRun({ text, italic: opts?.italic, color: opts?.color, size: 18 })],
    spacing: { after: 80 },
  });

const bullet = (text: string): Paragraph =>
  new Paragraph({
    children: [new TextRun({ text, size: 18 })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

const infoRow = (label: string, value: string): Paragraph =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 18, color: '555555' }),
      new TextRun({ text: value || '—', size: 18 }),
    ],
    spacing: { after: 60 },
  });

const divider = (): Paragraph =>
  new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } }, spacing: { before: 200, after: 200 } });

export async function downloadWord(data: ProposalData, showLinePrices: boolean, numero: string): Promise<void> {
  const total = (data.escopoTexto || !showLinePrices) && data.valorGlobal !== undefined
    ? data.valorGlobal
    : data.itens.reduce((s, i) => s + i.quantidade * i.valorUnitario, 0);

  const validadeDate = new Date(data.dataEmissao);
  validadeDate.setDate(validadeDate.getDate() + data.validadeDias);

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

  // Scope table (if line-by-line mode)
  const scopeRows: TableRow[] = showLinePrices && !data.escopoTexto
    ? [
        new TableRow({
          tableHeader: true,
          children: [
            ...['Nº', 'Descrição', 'Qtd', ...(showLinePrices ? ['Vlr. Unit.', 'Total'] : [])].map(h =>
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18 })] })],
                shading: { type: ShadingType.SOLID, color: DARK },
                width: { size: h === 'Nº' ? 5 : h === 'Descrição' ? 45 : 16, type: WidthType.PERCENTAGE },
              })
            ),
          ],
        }),
        ...data.itens.map((item, idx) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(idx + 1))], width: { size: 5, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(item.descricao)], width: { size: 45, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(`${item.quantidade} ${item.unidade}`)], width: { size: 16, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph(fmtCur(item.valorUnitario))], width: { size: 17, type: WidthType.PERCENTAGE } }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: fmtCur(item.quantidade * item.valorUnitario), bold: true })] })], width: { size: 17, type: WidthType.PERCENTAGE } }),
            ],
          })
        ),
      ]
    : [];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Calibri', size: 18 } } },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
            },
          },
        },
        children: [
          // ── Cabeçalho ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'RR ENGENHARIA E SOLUÇÕES LTDA.', bold: true, size: 28, color: DARK })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'CNPJ: 46.887.631/0001-75 • www.rres.com.br • contato@rres.com.br', size: 16, color: '666666' })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Av. das Américas nº 4.200, Sala 106, Bloco 08, Barra da Tijuca, Rio de Janeiro/RJ', size: 16, color: '666666' })],
            spacing: { after: 200 },
          }),

          divider(),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'PROPOSTA COMERCIAL', bold: true, size: 26, color: DARK, allCaps: true })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Nº ${data.numero}`, bold: true, size: 36, color: BLUE })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: fmtDate(data.dataEmissao), size: 20, color: '444444' })],
            spacing: { after: 280 },
          }),

          divider(),

          // ── Cliente ──
          darkHeading('Tomador do Serviço'),
          infoRow('Razão Social', data.cliente.razaoSocial),
          infoRow('CNPJ', data.cliente.cnpj),
          ...(data.cliente.endereco ? [infoRow('Endereço', data.cliente.endereco)] : []),
          ...(data.cliente.contato  ? [infoRow('Contato',  data.cliente.contato)]  : []),
          ...(data.cliente.telefone ? [infoRow('Telefone', data.cliente.telefone)] : []),
          ...(data.cliente.email    ? [infoRow('E-mail',   data.cliente.email)]    : []),
          ...(data.cliente.localExecucao ? [infoRow('Local de Execução', data.cliente.localExecucao)] : []),

          // ── Introdução ──
          divider(),
          body('Prezados, em atenção, apresentamos nossa proposta comercial para prestação de serviços de engenharia, com base nas diretrizes e necessidades apresentadas.'),

          // ── Escopo ──
          darkHeading('01 — Escopo dos Serviços'),
          ...(data.escopoTexto
            ? [body(data.escopoTexto)]
            : scopeRows.length > 0
              ? [new Table({ rows: scopeRows, width: { size: 100, type: WidthType.PERCENTAGE } })]
              : []
          ),

          // ── Obrigações ──
          darkHeading('02 — Obrigações das Partes'),
          subHeading('2.1 RR Engenharia'),
          ...OBRIGACOES_RR.map(bullet),
          subHeading(`2.2 ${data.cliente.razaoSocial || 'Contratante'}`),
          bullet('Fornecer acesso às instalações e documentação necessária para execução dos serviços.'),
          bullet('Designar um responsável para acompanhamento e aprovação das etapas de execução.'),
          bullet('Efetuar os pagamentos nas condições e prazos acordados nesta proposta.'),
          bullet('Comunicar previamente qualquer restrição de acesso, horário ou condição especial.'),

          // ── Valor ──
          darkHeading('03 — Valor dos Serviços'),
          new Paragraph({
            children: [
              new TextRun({ text: 'Preço global para execução dos serviços: ', size: 18 }),
              new TextRun({ text: fmtCur(total), bold: true, size: 22, color: DARK }),
            ],
            spacing: { after: 80 },
          }),

          // ── Pagamento ──
          darkHeading('04 — Condições de Pagamento'),
          body(data.condicoesPagamento),

          // ── Prazo ──
          ...(data.prazoExecucao ? [
            darkHeading('05 — Prazo de Execução'),
            body(data.prazoExecucao),
          ] : []),

          // ── Condições gerais ──
          darkHeading(`${data.prazoExecucao ? '06' : '05'} — Condições Gerais`),
          ...CONDICOES_GERAIS.map(bullet),
          ...(data.observacoes ? [
            new Paragraph({ spacing: { before: 160, after: 80 } }),
            subHeading('Observações Adicionais'),
            body(data.observacoes),
          ] : []),

          // ── Validade ──
          darkHeading(`${data.prazoExecucao ? '07' : '06'} — Validade da Proposta`),
          body(`Esta proposta tem validade de ${data.validadeDias} dias a contar do envio, sendo válida até ${fmtDate(validadeDate)}.`),

          // ── Assinaturas ──
          divider(),
          new Paragraph({ spacing: { before: 400, after: 80 } }),
          new Paragraph({
            children: [new TextRun({ text: 'Atenciosamente,', size: 18, italics: true })],
            spacing: { after: 400 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: DARK }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'RR ENGENHARIA E SOLUÇÕES LTDA.', bold: true, size: 18, color: DARK })] }),
                      new Paragraph({ children: [new TextRun({ text: 'CNPJ: 46.887.631/0001-75', size: 16, color: '666666' })] }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: DARK }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: data.cliente.razaoSocial || 'Contratante', bold: true, size: 18, color: DARK })] }),
                      new Paragraph({ children: [new TextRun({ text: `Contato: ${data.cliente.contato || ''}`, size: 16, color: '666666' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Data: ___/___/______', size: 16, color: '999999', italics: true })] }),
                    ],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `Proposta-${numero}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
