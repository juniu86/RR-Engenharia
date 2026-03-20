import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Plus, FileText } from 'lucide-react'
import { RelatorioStatusBadge } from '@/components/StatusBadge'
import { PageLoader } from '@/components/LoadingSpinner'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { Obra, Relatorio } from '@/types'

interface ProjectReportsProps {
  obraId: string
  obra: Obra
  onRelatorioCreated?: () => void
}

export function ProjectReports({ obraId, obra: _obra, onRelatorioCreated: _onRelatorioCreated }: ProjectReportsProps) {
  const [, setLocation] = useLocation()
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelatorios()
  }, [obraId])

  async function loadRelatorios() {
    setLoading(true)
    const { data } = await supabase
      .from('relatorios')
      .select('*')
      .eq('obra_id', obraId)
      .order('numero', { ascending: false })
    setRelatorios(data ?? [])
    setLoading(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Relatórios ({relatorios.length})
        </h2>
        <button
          onClick={() => setLocation(`/obras/${obraId}/relatorios/novo`)}
          className="bg-[#F97316] hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Novo Relatório
        </button>
      </div>

      {relatorios.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum relatório ainda</p>
          <p className="text-gray-400 text-sm mt-1">Crie o primeiro relatório desta obra.</p>
          <button
            onClick={() => setLocation(`/obras/${obraId}/relatorios/novo`)}
            className="mt-4 bg-[#F97316] text-white text-sm px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Criar primeiro relatório
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Data</th>
                <th className="text-left px-3 py-3 font-medium">N°</th>
                <th className="text-left px-3 py-3 font-medium">Status</th>
                <th className="text-left px-3 py-3 font-medium">Modelo de relatório</th>
                <th className="text-left px-3 py-3 font-medium">Clima manhã</th>
                <th className="text-left px-3 py-3 font-medium">Clima tarde</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <Link href={`/obras/${obraId}/relatorios/${r.id}`} className="text-blue-600 hover:underline font-medium">
                      {formatDate(r.data)}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/obras/${obraId}/relatorios/${r.id}`} className="text-blue-600 hover:underline">
                      {r.numero}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <RelatorioStatusBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3 text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <FileText size={13} className="text-gray-400" />
                      {r.modelo}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 capitalize">
                    {r.clima_manha_tempo}
                  </td>
                  <td className="px-3 py-3 text-gray-500 capitalize">
                    {r.clima_tarde_tempo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
