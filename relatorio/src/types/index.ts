export type ObraStatus = 'em_andamento' | 'concluida' | 'paralisada'
export type RelatorioStatus = 'preenchendo' | 'enviado' | 'aprovado'
export type WeatherTempo = 'claro' | 'nublado' | 'chuvoso' | 'garoa'
export type WeatherCondicao = 'praticavel' | 'impraticavel' | 'parcialmente_praticavel'
export type UserRole = 'admin' | 'engenheiro' | 'cliente'

export interface Obra {
  id: string
  nome: string
  endereco: string
  contratante: string
  responsavel: string
  numero_contrato: string
  prazo_contratual: number
  data_inicio: string
  data_fim?: string
  status: ObraStatus
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface ObraStats {
  relatorios: number
  atividades: number
  ocorrencias: number
  comentarios: number
  fotos: number
  videos: number
}

export interface Relatorio {
  id: string
  obra_id: string
  numero: number
  data: string
  status: RelatorioStatus
  modelo: string
  clima_manha_tempo: WeatherTempo
  clima_manha_condicao: WeatherCondicao
  clima_tarde_tempo: WeatherTempo
  clima_tarde_condicao: WeatherCondicao
  observacoes?: string
  created_at: string
  updated_at: string
  obra?: Obra
}

export interface MaoDeObra {
  id: string
  relatorio_id: string
  funcao: string
  quantidade: number
  observacao?: string
}

export interface Equipamento {
  id: string
  relatorio_id: string
  nome: string
  quantidade: number
  observacao?: string
}

export interface Atividade {
  id: string
  relatorio_id: string
  descricao: string
  progresso: number
  observacao?: string
}

export interface Ocorrencia {
  id: string
  relatorio_id: string
  tipo: string
  descricao: string
  impacto?: string
}

export interface ChecklistItem {
  id: string
  relatorio_id: string
  item: string
  concluido: boolean
}

export interface Comentario {
  id: string
  relatorio_id: string
  obra_id?: string
  usuario_nome: string
  texto: string
  created_at: string
}

export interface Foto {
  id: string
  obra_id: string
  relatorio_id?: string
  url: string
  legenda?: string
  created_at: string
}

export interface Video {
  id: string
  obra_id: string
  relatorio_id?: string
  url: string
  thumbnail_url?: string
  legenda?: string
  duracao?: number
  created_at: string
}

export interface Anexo {
  id: string
  relatorio_id: string
  nome: string
  url: string
  tamanho: number
  created_at: string
}

export interface ObraUser {
  id: string
  obra_id: string
  user_id: string
  role: UserRole
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  nome: string
  role: UserRole
  avatar_url?: string
}
