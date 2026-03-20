import type { SavedProposal } from './App';

const API_BASE = '/api.php';

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Auth-Token': 'rr2024',
  };
}

export async function apiLoadProposals(): Promise<SavedProposal[]> {
  const res = await fetch(`${API_BASE}?action=list`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Falha ao carregar propostas');
  const data = await res.json() as SavedProposal[];
  return data.map(p => ({
    ...p,
    data: { ...p.data, dataEmissao: new Date(p.data.dataEmissao) },
  }));
}

export async function apiSaveProposal(proposal: SavedProposal): Promise<void> {
  const res = await fetch(`${API_BASE}?action=save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(proposal),
  });
  if (!res.ok) throw new Error('Falha ao salvar proposta');
}

export async function apiDeleteProposal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}?action=delete`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Falha ao excluir proposta');
}

export async function apiPeekSeq(year: number): Promise<number> {
  const res = await fetch(`${API_BASE}?action=peek_seq&year=${year}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Falha ao consultar sequência');
  const data = await res.json() as { next: number };
  return data.next;
}

export async function apiConsumeSeq(year: number): Promise<number> {
  const res = await fetch(`${API_BASE}?action=consume_seq`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ year }),
  });
  if (!res.ok) throw new Error('Falha ao consumir sequência');
  const data = await res.json() as { consumed: number };
  return data.consumed;
}
