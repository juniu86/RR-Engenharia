import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn('Supabase environment variables not configured. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ─── Obras ───────────────────────────────────────────────────────────────────

export async function getObras(userId: string) {
  const { data, error } = await supabase
    .from('obras')
    .select(`
      *,
      obra_users!inner(user_id)
    `)
    .eq('obra_users.user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getObra(id: string) {
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getObraStats(obraId: string) {
  const [relatorios, fotos, videos, ocorrencias, atividades, comentarios] = await Promise.all([
    supabase.from('relatorios').select('id', { count: 'exact' }).eq('obra_id', obraId),
    supabase.from('fotos').select('id', { count: 'exact' }).eq('obra_id', obraId),
    supabase.from('videos').select('id', { count: 'exact' }).eq('obra_id', obraId),
    supabase.from('ocorrencias').select('id', { count: 'exact' }).eq('relatorio_id.obra_id', obraId),
    supabase.from('atividades').select('id', { count: 'exact' }),
    supabase.from('comentarios').select('id', { count: 'exact' }).eq('obra_id', obraId),
  ])
  return {
    relatorios: relatorios.count ?? 0,
    fotos: fotos.count ?? 0,
    videos: videos.count ?? 0,
    ocorrencias: ocorrencias.count ?? 0,
    atividades: atividades.count ?? 0,
    comentarios: comentarios.count ?? 0,
  }
}

export async function createObra(data: Record<string, unknown>) {
  const { data: obra, error } = await supabase
    .from('obras')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return obra
}

export async function updateObra(id: string, data: Record<string, unknown>) {
  const { data: obra, error } = await supabase
    .from('obras')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return obra
}

// ─── Relatórios ──────────────────────────────────────────────────────────────

export async function getRelatorios(obraId: string) {
  const { data, error } = await supabase
    .from('relatorios')
    .select('*')
    .eq('obra_id', obraId)
    .order('numero', { ascending: false })
  if (error) throw error
  return data
}

export async function getRelatorio(id: string) {
  const { data, error } = await supabase
    .from('relatorios')
    .select(`
      *,
      obra:obras(*),
      mao_de_obra(*),
      equipamentos(*),
      atividades(*),
      ocorrencias(*),
      checklist(*),
      comentarios(*),
      fotos(*),
      videos(*),
      anexos(*)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createRelatorio(data: Record<string, unknown>) {
  const { data: rel, error } = await supabase
    .from('relatorios')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return rel
}

export async function updateRelatorio(id: string, data: Record<string, unknown>) {
  const { data: rel, error } = await supabase
    .from('relatorios')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return rel
}

export async function updateRelatorioStatus(id: string, status: string) {
  return updateRelatorio(id, { status, updated_at: new Date().toISOString() })
}

export async function getNextRelatorioNumber(obraId: string) {
  const { data } = await supabase
    .from('relatorios')
    .select('numero')
    .eq('obra_id', obraId)
    .order('numero', { ascending: false })
    .limit(1)
  return (data?.[0]?.numero ?? 0) + 1
}

// ─── Seções do Relatório ──────────────────────────────────────────────────────

export async function upsertMaoDeObra(relatorioId: string, items: Record<string, unknown>[]) {
  await supabase.from('mao_de_obra').delete().eq('relatorio_id', relatorioId)
  if (items.length === 0) return
  const { error } = await supabase.from('mao_de_obra').insert(
    items.map(i => ({ ...i, relatorio_id: relatorioId }))
  )
  if (error) throw error
}

export async function upsertEquipamentos(relatorioId: string, items: Record<string, unknown>[]) {
  await supabase.from('equipamentos').delete().eq('relatorio_id', relatorioId)
  if (items.length === 0) return
  const { error } = await supabase.from('equipamentos').insert(
    items.map(i => ({ ...i, relatorio_id: relatorioId }))
  )
  if (error) throw error
}

export async function upsertAtividades(relatorioId: string, items: Record<string, unknown>[]) {
  await supabase.from('atividades').delete().eq('relatorio_id', relatorioId)
  if (items.length === 0) return
  const { error } = await supabase.from('atividades').insert(
    items.map(i => ({ ...i, relatorio_id: relatorioId }))
  )
  if (error) throw error
}

export async function upsertOcorrencias(relatorioId: string, items: Record<string, unknown>[]) {
  await supabase.from('ocorrencias').delete().eq('relatorio_id', relatorioId)
  if (items.length === 0) return
  const { error } = await supabase.from('ocorrencias').insert(
    items.map(i => ({ ...i, relatorio_id: relatorioId }))
  )
  if (error) throw error
}

export async function upsertChecklist(relatorioId: string, items: Record<string, unknown>[]) {
  await supabase.from('checklist').delete().eq('relatorio_id', relatorioId)
  if (items.length === 0) return
  const { error } = await supabase.from('checklist').insert(
    items.map(i => ({ ...i, relatorio_id: relatorioId }))
  )
  if (error) throw error
}

export async function addComentario(data: Record<string, unknown>) {
  const { data: c, error } = await supabase.from('comentarios').insert(data).select().single()
  if (error) throw error
  return c
}

// ─── Fotos & Vídeos ───────────────────────────────────────────────────────────

export async function getFotos(obraId: string, relatorioId?: string) {
  let q = supabase.from('fotos').select('*').eq('obra_id', obraId)
  if (relatorioId) q = q.eq('relatorio_id', relatorioId)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getVideos(obraId: string, relatorioId?: string) {
  let q = supabase.from('videos').select('*').eq('obra_id', obraId)
  if (relatorioId) q = q.eq('relatorio_id', relatorioId)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFoto(id: string, url: string) {
  const path = url.split('/storage/v1/object/public/fotos/')[1]
  if (path) await supabase.storage.from('fotos').remove([path])
  const { error } = await supabase.from('fotos').delete().eq('id', id)
  if (error) throw error
}

// ─── Anexos ──────────────────────────────────────────────────────────────────

export async function getAnexos(relatorioId: string) {
  const { data, error } = await supabase
    .from('anexos')
    .select('*')
    .eq('relatorio_id', relatorioId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function addAnexo(data: Record<string, unknown>) {
  const { data: a, error } = await supabase.from('anexos').insert(data).select().single()
  if (error) throw error
  return a
}

export async function deleteAnexo(id: string, url: string) {
  const path = url.split('/storage/v1/object/public/anexos/')[1]
  if (path) await supabase.storage.from('anexos').remove([path])
  const { error } = await supabase.from('anexos').delete().eq('id', id)
  if (error) throw error
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function getObraUsers(obraId: string) {
  const { data, error } = await supabase
    .from('obra_users')
    .select('*, user_profiles(*)')
    .eq('obra_id', obraId)
  if (error) throw error
  return data
}
