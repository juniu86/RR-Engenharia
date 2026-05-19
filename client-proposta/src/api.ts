import type { SavedProposal } from './App';

const API_BASE = (import.meta.env.VITE_PROPOSAL_API_URL as string | undefined) ?? 'https://api.rres.com.br';

let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>): void {
  _getToken = fn;
}

async function h(): Promise<HeadersInit> {
  const token = _getToken ? await _getToken() : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function ok(res: Response, action: string): Promise<void> {
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${action}: ${res.status} ${msg}`);
  }
}

// ── row shape ───────────────────────────────────────────────────────────────
interface ProposalRow {
  id:               string;
  numero:           string;
  cliente_nome:     string;
  total:            number;
  created_at:       string;
  updated_at:       string;
  data:             Record<string, unknown>;
  show_line_prices: boolean;
  status:           string;
  motivo_perda:     string | null;
  revisao:          number | null;
  parent_id:        string | null;
}

function rowToSaved(row: ProposalRow): SavedProposal {
  return {
    id:             row.id,
    numero:         row.numero,
    clienteNome:    row.cliente_nome,
    total:          Number(row.total),
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
    data:           { ...row.data, dataEmissao: new Date(row.data.dataEmissao as string) } as SavedProposal['data'],
    showLinePrices: Boolean(row.show_line_prices),
    status:         (row.status ?? 'rascunho') as SavedProposal['status'],
    motivoPerda:    row.motivo_perda ?? undefined,
    revisao:        row.revisao ?? undefined,
    parentId:       row.parent_id ?? undefined,
  };
}

function savedToRow(p: SavedProposal): ProposalRow {
  return {
    id:               p.id,
    numero:           p.numero,
    cliente_nome:     p.clienteNome,
    total:            p.total,
    created_at:       p.createdAt,
    updated_at:       p.updatedAt,
    data:             { ...p.data, dataEmissao: (p.data.dataEmissao instanceof Date ? p.data.dataEmissao.toISOString() : p.data.dataEmissao) },
    show_line_prices: p.showLinePrices,
    status:           p.status ?? 'rascunho',
    motivo_perda:     p.motivoPerda ?? null,
    revisao:          p.revisao ?? null,
    parent_id:        p.parentId ?? null,
  };
}

// ── public API ───────────────────────────────────────────────────────────────
export async function apiLoadProposals(): Promise<SavedProposal[]> {
  const res = await fetch(`${API_BASE}/proposta/proposals`, { headers: await h() });
  await ok(res, 'Falha ao carregar propostas');
  const rows: ProposalRow[] = await res.json();
  return rows.map(rowToSaved);
}

export async function apiSaveProposal(proposal: SavedProposal): Promise<void> {
  const res = await fetch(`${API_BASE}/proposta/proposals/${proposal.id}`, {
    method: 'PUT',
    headers: await h(),
    body: JSON.stringify(savedToRow(proposal)),
  });
  await ok(res, 'Falha ao salvar proposta');
}

export async function apiDeleteProposal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/proposta/proposals/${id}`, { method: 'DELETE', headers: await h() });
  await ok(res, 'Falha ao excluir proposta');
}

export async function apiPeekSeq(year: number): Promise<number> {
  const res = await fetch(`${API_BASE}/proposta/seq/${year}/peek`, { headers: await h() });
  await ok(res, 'Falha ao consultar sequência');
  const { next }: { next: number } = await res.json();
  return next;
}

export async function apiConsumeSeq(year: number): Promise<number> {
  const res = await fetch(`${API_BASE}/proposta/seq/${year}/consume`, { method: 'POST', headers: await h() });
  await ok(res, 'Falha ao consumir sequência');
  const { value }: { value: number } = await res.json();
  return value;
}
