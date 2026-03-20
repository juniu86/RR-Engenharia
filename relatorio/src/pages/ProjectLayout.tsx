import { useEffect, useState } from 'react'
import { useRoute, Switch, Route, useLocation } from 'wouter'
import { Navbar } from '@/components/Navbar'
import { ProjectSidebar } from '@/components/ProjectSidebar'
import { AddObraModal } from '@/components/AddObraModal'
import { PageLoader } from '@/components/LoadingSpinner'
import { ProjectOverview } from './ProjectOverview'
import { ProjectReports } from './ProjectReports'
import { ReportView } from './ReportView'
import { ReportEdit } from './ReportEdit'
import { PhotosGallery } from './PhotosGallery'
import { VideosGallery } from './VideosGallery'
import { EditObra } from './EditObra'
import { supabase } from '@/lib/supabase'
import { ObraStatusBadge } from '@/components/StatusBadge'
import type { Obra } from '@/types'

export function ProjectLayout() {
  const [, params] = useRoute('/obras/:id/*?')
  const obraId = params?.id ?? ''
  const [obra, setObra] = useState<Obra | null>(null)
  const [relatoriosCount, setRelatoriosCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (obraId) loadObra()
  }, [obraId])

  async function loadObra() {
    setLoading(true)
    try {
      const { data } = await supabase.from('obras').select('*').eq('id', obraId).single()
      setObra(data)
      const { count } = await supabase
        .from('relatorios')
        .select('id', { count: 'exact', head: true })
        .eq('obra_id', obraId)
      setRelatoriosCount(count ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <PageLoader />
      </div>
    )
  }

  if (!obra) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Obra não encontrada.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onAddClick={() => setAddOpen(true)} />

      {/* Project header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800">{obra.nome}</h1>
        <ObraStatusBadge status={obra.status} />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar obra={obra} relatoriosCount={relatoriosCount} />

        <div className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/obras/:id/relatorios/:relId/editar">
              {(p) => <ReportEdit obraId={obraId} relatorioId={p.relId} obra={obra} onSaved={loadObra} />}
            </Route>
            <Route path="/obras/:id/relatorios/novo">
              <ReportEdit obraId={obraId} obra={obra} onSaved={loadObra} />
            </Route>
            <Route path="/obras/:id/relatorios/:relId">
              {(p) => <ReportView obraId={obraId} relatorioId={p.relId} obra={obra} />}
            </Route>
            <Route path="/obras/:id/relatorios">
              <ProjectReports obraId={obraId} obra={obra} onRelatorioCreated={loadObra} />
            </Route>
            <Route path="/obras/:id/fotos">
              <PhotosGallery obraId={obraId} />
            </Route>
            <Route path="/obras/:id/videos">
              <VideosGallery obraId={obraId} />
            </Route>
            <Route path="/obras/:id/editar">
              <EditObra obra={obra} onSaved={(updated) => { setObra(updated); }} />
            </Route>
            <Route path="/obras/:id">
              <ProjectOverview obra={obra} obraId={obraId} />
            </Route>
          </Switch>
        </div>
      </div>

      <AddObraModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => {}} />
    </div>
  )
}
