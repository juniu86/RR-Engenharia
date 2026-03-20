import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { FileText, AlertTriangle, MessageSquare, Camera, Video, Activity } from 'lucide-react'
import { RelatorioStatusBadge } from '@/components/StatusBadge'
import { PageLoader } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { Obra, Relatorio, Foto, Video as VideoType } from '@/types'

interface ProjectOverviewProps {
  obra: Obra
  obraId: string
}

interface Stats {
  relatorios: number
  atividades: number
  ocorrencias: number
  comentarios: number
  fotos: number
  videos: number
}

export function ProjectOverview({ obra, obraId }: ProjectOverviewProps) {
  const [stats, setStats] = useState<Stats>({ relatorios: 0, atividades: 0, ocorrencias: 0, comentarios: 0, fotos: 0, videos: 0 })
  const [recentRelatorios, setRecentRelatorios] = useState<Relatorio[]>([])
  const [recentFotos, setRecentFotos] = useState<Foto[]>([])
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [obraId])

  async function loadData() {
    setLoading(true)
    try {
      const [
        { count: rel },
        { count: fot },
        { count: vid },
        { count: com },
        relatoriosData,
        fotosData,
        videosData,
      ] = await Promise.all([
        supabase.from('relatorios').select('id', { count: 'exact', head: true }).eq('obra_id', obraId),
        supabase.from('fotos').select('id', { count: 'exact', head: true }).eq('obra_id', obraId),
        supabase.from('videos').select('id', { count: 'exact', head: true }).eq('obra_id', obraId),
        supabase.from('comentarios').select('id', { count: 'exact', head: true }).eq('obra_id', obraId),
        supabase.from('relatorios').select('*').eq('obra_id', obraId).order('numero', { ascending: false }).limit(5),
        supabase.from('fotos').select('*').eq('obra_id', obraId).order('created_at', { ascending: false }).limit(6),
        supabase.from('videos').select('*').eq('obra_id', obraId).order('created_at', { ascending: false }).limit(5),
      ])

      // Count atividades and ocorrencias through relatorios
      const relIds = relatoriosData.data?.map(r => r.id) ?? []
      let atv = 0, ocr = 0
      if (relIds.length > 0) {
        const [{ count: a }, { count: o }] = await Promise.all([
          supabase.from('atividades').select('id', { count: 'exact', head: true }).in('relatorio_id', relIds),
          supabase.from('ocorrencias').select('id', { count: 'exact', head: true }).in('relatorio_id', relIds),
        ])
        atv = a ?? 0
        ocr = o ?? 0
      }

      setStats({
        relatorios: rel ?? 0,
        fotos: fot ?? 0,
        videos: vid ?? 0,
        comentarios: com ?? 0,
        atividades: atv,
        ocorrencias: ocr,
      })
      setRecentRelatorios(relatoriosData.data ?? [])
      setRecentFotos(fotosData.data ?? [])
      setRecentVideos(videosData.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PageLoader />

  const statCards = [
    { label: 'Relatórios', value: stats.relatorios, icon: FileText, href: `/obras/${obraId}/relatorios` },
    { label: 'Atividades', value: stats.atividades, icon: Activity, href: null },
    { label: 'Ocorrências', value: stats.ocorrencias, icon: AlertTriangle, href: null },
    { label: 'Comentários', value: stats.comentarios, icon: MessageSquare, href: null },
    { label: 'Fotos', value: stats.fotos, icon: Camera, href: `/obras/${obraId}/fotos` },
    { label: 'Vídeos', value: stats.videos, icon: Video, href: `/obras/${obraId}/videos` },
  ]

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(s => {
          const card = (
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="text-2xl font-bold text-orange-500">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
              <s.icon size={20} className="text-gray-300" />
            </div>
          )
          return s.href ? (
            <Link key={s.label} href={s.href}>{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reports */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-bold text-orange-500">Relatórios recentes</h2>
            <Link href={`/obras/${obraId}/relatorios`} className="text-xs text-blue-600 hover:underline">
              Ver tudo
            </Link>
          </div>
          {recentRelatorios.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Nenhum relatório ainda</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-5 py-2 font-medium">Data</th>
                  <th className="text-left px-2 py-2 font-medium">N°</th>
                  <th className="text-left px-2 py-2 font-medium">Status</th>
                  <th className="text-left px-2 py-2 font-medium">Modelo</th>
                </tr>
              </thead>
              <tbody>
                {recentRelatorios.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-2.5">
                      <Link href={`/obras/${obraId}/relatorios/${r.id}`} className="text-blue-600 hover:underline">
                        {formatDate(r.data)}
                      </Link>
                    </td>
                    <td className="px-2 py-2.5">
                      <Link href={`/obras/${obraId}/relatorios/${r.id}`} className="text-blue-600 hover:underline">
                        {r.numero}
                      </Link>
                    </td>
                    <td className="px-2 py-2.5">
                      <RelatorioStatusBadge status={r.status} />
                    </td>
                    <td className="px-2 py-2.5 text-gray-600 text-xs flex items-center gap-1">
                      <FileText size={12} />
                      {r.modelo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent photos */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-bold text-orange-500">Fotos recentes</h2>
            <Link href={`/obras/${obraId}/fotos`} className="text-xs text-blue-600 hover:underline">
              Ver tudo
            </Link>
          </div>
          {recentFotos.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">Nenhuma foto ainda</div>
          ) : (
            <div className="p-3 grid grid-cols-3 gap-2">
              {recentFotos.map(f => (
                <div key={f.id} className="aspect-square rounded overflow-hidden bg-gray-100">
                  <img src={f.url} alt={f.legenda ?? ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent videos */}
      {recentVideos.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="font-bold text-orange-500">Vídeos recentes</h2>
            <Link href={`/obras/${obraId}/videos`} className="text-xs text-blue-600 hover:underline">
              Ver tudo
            </Link>
          </div>
          <div className="p-3 flex gap-3 overflow-x-auto">
            {recentVideos.map(v => (
              <div key={v.id} className="shrink-0 w-40 rounded overflow-hidden bg-gray-900 relative aspect-video">
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video size={24} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-2">
                    <Video size={16} className="text-white" />
                  </div>
                </div>
                {v.duracao && (
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {Math.floor(v.duracao / 60).toString().padStart(2, '0')}:{(v.duracao % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project info */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="font-bold text-gray-700">Informações da obra</h2>
          <Link href={`/obras/${obraId}/editar`} className="text-xs text-blue-600 hover:underline">
            Editar
          </Link>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Endereço', value: obra.endereco },
            { label: 'Contratante', value: obra.contratante },
            { label: 'Responsável', value: obra.responsavel },
            { label: 'N° do contrato', value: obra.numero_contrato },
            { label: 'Prazo contratual', value: `${obra.prazo_contratual} dias` },
            { label: 'Data de início', value: formatDate(obra.data_inicio) },
          ].map(info => (
            <div key={info.label}>
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">{info.label}</div>
              <div className="text-gray-800 mt-0.5">{info.value || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
