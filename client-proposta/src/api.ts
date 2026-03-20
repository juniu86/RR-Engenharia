import { supabase } from './supabase';
import type { SavedProposal } from './App';

export async function apiLoadProposals(): Promise<SavedProposal[]> {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Falha ao carregar propostas: ' + error.message);

  return (data ?? []).map(row => ({
    id:             row.id,
    numero:         row.numero,
    clienteNome:    row.cliente_nome,
    total:          row.total,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
    data:           { ...row.data, dataEmissao: new Date(row.data.dataEmissao) },
    showLinePrices: row.show_line_prices,
    status:         row.status ?? 'rascunho',
    motivoPerda:    row.motivo_perda ?? undefined,
    revisao:        row.revisao ?? undefined,
    parentId:       row.parent_id ?? undefined,
  }));
}

export async function apiSaveProposal(proposal: SavedProposal): Promise<void> {
  const { error } = await supabase
    .from('proposals')
    .upsert({
      id:               proposal.id,
      numero:           proposal.numero,
      cliente_nome:     proposal.clienteNome,
      total:            proposal.total,
      created_at:       proposal.createdAt,
      updated_at:       proposal.updatedAt,
      data:             proposal.data,
      show_line_prices: proposal.showLinePrices,
      status:           proposal.status ?? 'rascunho',
      motivo_perda:     proposal.motivoPerda ?? null,
      revisao:          proposal.revisao ?? null,
      parent_id:        proposal.parentId ?? null,
    });

  if (error) throw new Error('Falha ao salvar proposta: ' + error.message);
}

export async function apiDeleteProposal(id: string): Promise<void> {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Falha ao excluir proposta: ' + error.message);
}

export async function apiPeekSeq(year: number): Promise<number> {
  const { data, error } = await supabase
    .from('seq_counters')
    .select('value')
    .eq('year', year)
    .maybeSingle();

  if (error) throw new Error('Falha ao consultar sequência: ' + error.message);
  return (data?.value ?? 39) + 1;
}

export async function apiConsumeSeq(year: number): Promise<number> {
  const { data, error } = await supabase
    .rpc('consume_seq', { p_year: year });

  if (error) throw new Error('Falha ao consumir sequência: ' + error.message);
  return data as number;
}
