import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Printer, Edit2, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react'
import { PageLoader } from '@/components/LoadingSpinner'
import { RelatorioStatusBadge } from '@/components/StatusBadge'
import { supabase, updateRelatorioStatus } from '@/lib/supabase'
import { formatDate, getDayOfWeek, calcPrazoDecorrido, calcPrazoAVencer, weatherTempoLabel, weatherTempoIcon, weatherCondicaoLabel, formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'
import type { Obra, Relatorio, MaoDeObra, Equipamento, Atividade, Ocorrencia, ChecklistItem, Comentario, Foto, Video, Anexo } from '@/types'

interface ReportViewProps {
  obraId: string
  relatorioId: string
  obra: Obra
}

export function ReportView({ obraId, relatorioId, obra }: ReportViewProps) {
  const [, setLocation] = useLocation()
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null)
  const [maoDeObra, setMaoDeObra] = useState<MaoDeObra[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [fotos, setFotos] = useState<Foto[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [anexos, setAnexos] = useState<Anexo[]>([])
  const [prevRel, setPrevRel] = useState<Relatorio | null>(null)
  const [nextRel, setNextRel] = useState<Relatorio | null>(null)
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    loadData()
  }, [relatorioId])

  async function loadData() {
    setLoading(true)
    try {
      const { data: rel } = await supabase.from('relatorios').select('*').eq('id', relatorioId).single()
      if (!rel) return
      setRelatorio(rel)

      const [
        { data: mob }, { data: eq }, { data: atv }, { data: ocr },
        { data: chk }, { data: com }, { data: fot }, { data: vid }, { data: anx }
      ] = await Promise.all([
        supabase.from('mao_de_obra').select('*').eq('relatorio_id', relatorioId),
        supabase.from('equipamentos').select('*').eq('relatorio_id', relatorioId),
        supabase.from('atividades').select('*').eq('relatorio_id', relatorioId),
        supabase.from('ocorrencias').select('*').eq('relatorio_id', relatorioId),
        supabase.from('checklist').select('*').eq('relatorio_id', relatorioId),
        supabase.from('comentarios').select('*').eq('relatorio_id', relatorioId),
        supabase.from('fotos').select('*').eq('relatorio_id', relatorioId),
        supabase.from('videos').select('*').eq('relatorio_id', relatorioId),
        supabase.from('anexos').select('*').eq('relatorio_id', relatorioId),
      ])
      setMaoDeObra(mob ?? [])
      setEquipamentos(eq ?? [])
      setAtividades(atv ?? [])
      setOcorrencias(ocr ?? [])
      setChecklist(chk ?? [])
      setComentarios(com ?? [])
      setFotos(fot ?? [])
      setVideos(vid ?? [])
      setAnexos(anx ?? [])

      // Adjacent reports
      const [{ data: prev }, { data: next }] = await Promise.all([
        supabase.from('relatorios').select('*').eq('obra_id', obraId).lt('numero', rel.numero).order('numero', { ascending: false }).limit(1),
        supabase.from('relatorios').select('*').eq('obra_id', obraId).gt('numero', rel.numero).order('numero', { ascending: true }).limit(1),
      ])
      setPrevRel(prev?.[0] ?? null)
      setNextRel(next?.[0] ?? null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (!relatorio) return
    setApproving(true)
    try {
      await updateRelatorioStatus(relatorioId, 'aprovado')
      setRelatorio(r => r ? { ...r, status: 'aprovado' } : r)
      toast.success('Relatório aprovado!')
    } catch {
      toast.error('Erro ao aprovar relatório')
    } finally {
      setApproving(false)
    }
  }

  async function handleSendForApproval() {
    if (!relatorio) return
    setApproving(true)
    try {
      await updateRelatorioStatus(relatorioId, 'enviado')
      setRelatorio(r => r ? { ...r, status: 'enviado' } : r)
      toast.success('Relatório enviado para aprovação!')
    } catch {
      toast.error('Erro ao enviar relatório')
    } finally {
      setApproving(false)
    }
  }

  if (loading) return <PageLoader />
  if (!relatorio) return <div className="p-6 text-gray-500">Relatório não encontrado.</div>

  const prazoDecorrido = calcPrazoDecorrido(obra.data_inicio)
  const prazoAVencer = calcPrazoAVencer(obra.data_inicio, obra.prazo_contratual)

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Visualizar relatório: {formatDate(relatorio.data)} n° {relatorio.numero}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Printer size={15} />
            Imprimir
          </button>
          {relatorio.status === 'preenchendo' && (
            <button
              onClick={handleSendForApproval}
              disabled={approving}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Enviar para aprovação
            </button>
          )}
          {relatorio.status === 'enviado' && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Aprovar
            </button>
          )}
          <button
            onClick={() => setLocation(`/obras/${obraId}/relatorios/${relatorioId}/editar`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            <Edit2 size={15} />
            Editar
          </button>
        </div>
      </div>

      {/* Report card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden print:shadow-none">
        {/* Status */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <RelatorioStatusBadge status={relatorio.status} />
        </div>

        {/* Header table */}
        <div className="p-5">
          <table className="w-full border border-gray-300 text-sm mb-0">
            <tbody>
              <tr>
                <td rowSpan={4} className="border border-gray-300 p-4 w-32 text-center align-middle">
                  <div className="text-xs text-gray-500 font-bold">RR Engenharia</div>
                </td>
                <td colSpan={2} className="border border-gray-300 px-3 py-2 text-center font-bold text-base">
                  {relatorio.modelo}
                </td>
                <td className="border border-gray-300 px-3 py-1 bg-gray-50 font-medium text-xs w-32">Relatório n°</td>
                <td className="border border-gray-300 px-3 py-1">{relatorio.numero}</td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-gray-300 px-3 py-1">
                  <span className="font-medium text-xs text-gray-500">Obra:</span>{' '}
                  <span className="font-semibold">{obra.nome}</span>
                </td>
                <td className="border border-gray-300 px-3 py-1 bg-gray-50 font-medium text-xs">Data</td>
                <td className="border border-gray-300 px-3 py-1">{formatDate(relatorio.data)}</td>
              </tr>
              <tr>
                <td colSpan={2} className="border border-gray-300 px-3 py-1">
                  <span className="font-medium text-xs text-gray-500">Endereço:</span>{' '}
                  {obra.endereco}
                </td>
                <td className="border border-gray-300 px-3 py-1 bg-gray-50 font-medium text-xs">Dia da semana</td>
                <td className="border border-gray-300 px-3 py-1">{getDayOfWeek(relatorio.data)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-1">
                  <span className="font-medium text-xs text-gray-500">Contratante:</span>{' '}
                  {obra.contratante}
                </td>
                <td className="border border-gray-300 px-3 py-1">
                  <span className="font-medium text-xs text-gray-500">Responsável:</span>{' '}
                  {obra.responsavel}
                </td>
                <td className="border border-gray-300 px-3 py-1 bg-gray-50 font-medium text-xs">N° do contrato</td>
                <td className="border border-gray-300 px-3 py-1">{obra.numero_contrato}</td>
              </tr>
              <tr>
                <td colSpan={5} className="border border-gray-300 px-3 py-1">
                  <div className="flex gap-8">
                    <span><span className="font-medium text-xs text-gray-500">Prazo contratual:</span> {obra.prazo_contratual} dias</span>
                    <span><span className="font-medium text-xs text-gray-500">Prazo decorrido:</span> {prazoDecorrido} dias</span>
                    <span><span className="font-medium text-xs text-gray-500">Prazo a vencer:</span> {prazoAVencer} dias</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Weather */}
          <table className="w-full border border-gray-300 border-t-0 text-sm mb-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Clima</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Tempo</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-medium">Condição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">Manhã</td>
                <td className="border border-gray-300 px-3 py-2">
                  {weatherTempoIcon[relatorio.clima_manha_tempo]} {weatherTempoLabel[relatorio.clima_manha_tempo]}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {weatherCondicaoLabel[relatorio.clima_manha_condicao]}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">Tarde</td>
                <td className="border border-gray-300 px-3 py-2">
                  {weatherTempoIcon[relatorio.clima_tarde_tempo]} {weatherTempoLabel[relatorio.clima_tarde_tempo]}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {weatherCondicaoLabel[relatorio.clima_tarde_condicao]}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sections */}
          {[
            {
              title: `Mão de obra (${maoDeObra.length})`,
              content: maoDeObra.length > 0 ? (
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-xs text-gray-500">
                    <th className="text-left px-3 py-2 font-medium">Função</th>
                    <th className="text-left px-3 py-2 font-medium">Quantidade</th>
                    <th className="text-left px-3 py-2 font-medium">Observação</th>
                  </tr></thead>
                  <tbody>{maoDeObra.map(m => (
                    <tr key={m.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{m.funcao}</td>
                      <td className="px-3 py-2">{m.quantidade}</td>
                      <td className="px-3 py-2 text-gray-500">{m.observacao}</td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : null,
            },
            {
              title: `Equipamentos (${equipamentos.length})`,
              content: equipamentos.length > 0 ? (
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-xs text-gray-500">
                    <th className="text-left px-3 py-2 font-medium">Equipamento</th>
                    <th className="text-left px-3 py-2 font-medium">Quantidade</th>
                    <th className="text-left px-3 py-2 font-medium">Observação</th>
                  </tr></thead>
                  <tbody>{equipamentos.map(e => (
                    <tr key={e.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">{e.nome}</td>
                      <td className="px-3 py-2">{e.quantidade}</td>
                      <td className="px-3 py-2 text-gray-500">{e.observacao}</td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : null,
            },
            {
              title: `Atividades (${atividades.length})`,
              content: atividades.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {atividades.map(a => (
                    <div key={a.id} className="px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{a.descricao}</span>
                        <span className="text-xs text-gray-500">{a.progresso}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.progresso}%` }} />
                      </div>
                      {a.observacao && <p className="text-xs text-gray-400 mt-1">{a.observacao}</p>}
                    </div>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Ocorrências (${ocorrencias.length})`,
              content: ocorrencias.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {ocorrencias.map(o => (
                    <div key={o.id} className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">{o.tipo}</span>
                        <span className="text-sm">{o.descricao}</span>
                      </div>
                      {o.impacto && <p className="text-xs text-gray-500 mt-1">Impacto: {o.impacto}</p>}
                    </div>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Checklist (${checklist.length})`,
              content: checklist.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {checklist.map(c => (
                    <div key={c.id} className="px-4 py-2 flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${c.concluido ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {c.concluido && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={`text-sm ${c.concluido ? 'line-through text-gray-400' : ''}`}>{c.item}</span>
                    </div>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Comentários (${comentarios.length})`,
              content: comentarios.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {comentarios.map(c => (
                    <div key={c.id} className="px-4 py-2.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-700">{c.usuario_nome}</span>
                        <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{c.texto}</p>
                    </div>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Fotos (${fotos.length})`,
              content: fotos.length > 0 ? (
                <div className="p-3 grid grid-cols-4 gap-2">
                  {fotos.map(f => (
                    <a key={f.id} href={f.url} target="_blank" rel="noreferrer">
                      <img src={f.url} alt={f.legenda ?? ''} className="w-full aspect-square object-cover rounded" />
                    </a>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Vídeos (${videos.length})`,
              content: videos.length > 0 ? (
                <div className="p-3 flex gap-3 flex-wrap">
                  {videos.map(v => (
                    <a key={v.id} href={v.url} target="_blank" rel="noreferrer"
                      className="block w-32 rounded overflow-hidden bg-gray-900 relative aspect-video">
                      {v.thumbnail_url
                        ? <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover opacity-80" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Vídeo</div>
                      }
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-1.5">▶</div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : null,
            },
            {
              title: `Anexos (${anexos.length})`,
              content: anexos.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {anexos.map(a => (
                    <div key={a.id} className="px-4 py-2.5 flex items-center justify-between">
                      <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1.5">
                        <Download size={13} />
                        {a.nome}
                      </a>
                      <span className="text-xs text-gray-400">{formatFileSize(a.tamanho)}</span>
                    </div>
                  ))}
                </div>
              ) : null,
            },
          ].map(section => (
            <div key={section.title} className="border border-gray-300 rounded mb-2">
              <div className="px-4 py-2.5 bg-gray-50 font-medium text-sm border-b border-gray-200 last:border-0">
                {section.title}
              </div>
              {section.content}
            </div>
          ))}

          {/* Observações */}
          {relatorio.observacoes && (
            <div className="border border-gray-300 rounded mb-2">
              <div className="px-4 py-2.5 bg-gray-50 font-medium text-sm border-b border-gray-200">Observações gerais</div>
              <div className="px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap">{relatorio.observacoes}</div>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-8 flex justify-around">
            {['Assinatura', 'Assinatura'].map((label, i) => (
              <div key={i} className="text-center">
                <div className="w-48 border-b border-gray-400 mb-1" />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-4">
        {prevRel ? (
          <Link
            href={`/obras/${obraId}/relatorios/${prevRel.id}`}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
          >
            <ChevronLeft size={16} />
            <span>Anterior<br /><span className="text-xs text-gray-500">{formatDate(prevRel.data)}</span></span>
          </Link>
        ) : <div />}
        {nextRel ? (
          <Link
            href={`/obras/${obraId}/relatorios/${nextRel.id}`}
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm text-right"
          >
            <span>Próximo<br /><span className="text-xs text-gray-500">{formatDate(nextRel.data)}</span></span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
