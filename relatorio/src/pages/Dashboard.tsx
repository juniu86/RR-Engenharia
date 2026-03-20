import { useEffect, useState } from 'react'
import { Search, LayoutGrid, List } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { ProjectCard } from '@/components/ProjectCard'
import { AddObraModal } from '@/components/AddObraModal'
import { PageLoader } from '@/components/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Obra, ObraStatus } from '@/types'
import { obraStatusLabel } from '@/lib/utils'

type ObraWithCounts = Obra & {
  relatorios_count: number
  fotos_count: number
  videos_count: number
}

export function DashboardPage() {
  const { user } = useAuth()
  const [obras, setObras] = useState<ObraWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ObraStatus | 'todas'>('todas')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (user) loadObras()
  }, [user])

  async function loadObras() {
    setLoading(true)
    try {
      // Get obras where user has access
      const { data: obraUsers } = await supabase
        .from('obra_users')
        .select('obra_id')
        .eq('user_id', user!.id)

      const obraIds = obraUsers?.map(o => o.obra_id) ?? []
      if (obraIds.length === 0) {
        setObras([])
        setLoading(false)
        return
      }

      const { data: obrasData } = await supabase
        .from('obras')
        .select('*')
        .in('id', obraIds)
        .order('created_at', { ascending: false })

      if (!obrasData) { setObras([]); setLoading(false); return }

      // Get counts for each obra
      const obraWithCounts = await Promise.all(
        obrasData.map(async (obra) => {
          const [{ count: rel }, { count: fot }, { count: vid }] = await Promise.all([
            supabase.from('relatorios').select('id', { count: 'exact', head: true }).eq('obra_id', obra.id),
            supabase.from('fotos').select('id', { count: 'exact', head: true }).eq('obra_id', obra.id),
            supabase.from('videos').select('id', { count: 'exact', head: true }).eq('obra_id', obra.id),
          ])
          return {
            ...obra,
            relatorios_count: rel ?? 0,
            fotos_count: fot ?? 0,
            videos_count: vid ?? 0,
          }
        })
      )
      setObras(obraWithCounts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = obras.filter(o => {
    const matchSearch = o.nome.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todas' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onAddClick={() => setAddOpen(true)} />

      <main className="flex-1 p-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-800 mr-auto">
            Obras ({filtered.length})
          </h1>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisa"
              className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ObraStatus | 'todas')}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas as obras</option>
            <option value="em_andamento">{obraStatusLabel.em_andamento}</option>
            <option value="concluida">{obraStatusLabel.concluida}</option>
            <option value="paralisada">{obraStatusLabel.paralisada}</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button className="p-2 bg-white hover:bg-gray-50">
              <LayoutGrid size={16} className="text-gray-500" />
            </button>
            <button className="p-2 bg-white hover:bg-gray-50 border-l">
              <List size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 mb-4">
              <LayoutGrid size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 font-medium">Nenhuma obra encontrada</p>
            <p className="text-gray-400 text-sm mt-1">
              {obras.length === 0
                ? 'Clique em "+ ADICIONAR" para criar a primeira obra.'
                : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(obra => (
              <ProjectCard key={obra.id} obra={obra} />
            ))}
          </div>
        )}
      </main>

      <AddObraModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={loadObras}
      />
    </div>
  )
}
