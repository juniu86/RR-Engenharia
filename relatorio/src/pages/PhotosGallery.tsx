import { useEffect, useState } from 'react'
import { Camera, Upload, X, ZoomIn } from 'lucide-react'
import { PageLoader } from '@/components/LoadingSpinner'
import { supabase, uploadFile, deleteFoto } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Foto } from '@/types'

interface PhotosGalleryProps {
  obraId: string
}

export function PhotosGallery({ obraId }: PhotosGalleryProps) {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState<Foto | null>(null)

  useEffect(() => {
    loadFotos()
  }, [obraId])

  async function loadFotos() {
    setLoading(true)
    const { data } = await supabase
      .from('fotos')
      .select('*')
      .eq('obra_id', obraId)
      .order('created_at', { ascending: false })
    setFotos(data ?? [])
    setLoading(false)
  }

  async function handleUpload(files: FileList) {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const path = `${obraId}/${Date.now()}-${file.name}`
        const url = await uploadFile('fotos', path, file)
        await supabase.from('fotos').insert({ obra_id: obraId, url })
      }
      toast.success(`${files.length} foto(s) adicionada(s)!`)
      await loadFotos()
    } catch (err) {
      toast.error('Erro ao fazer upload: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(foto: Foto) {
    if (!confirm('Excluir esta foto?')) return
    try {
      await deleteFoto(foto.id, foto.url)
      setFotos(f => f.filter(x => x.id !== foto.id))
      toast.success('Foto excluída')
      if (lightbox?.id === foto.id) setLightbox(null)
    } catch {
      toast.error('Erro ao excluir foto')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Fotos ({fotos.length})</h2>
        <label className={`flex items-center gap-2 bg-[#F97316] text-white text-sm font-bold px-4 py-2 rounded cursor-pointer hover:bg-orange-600 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={15} />
          {uploading ? 'Enviando...' : 'Adicionar Fotos'}
          <input type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
        </label>
      </div>

      {fotos.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Camera size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma foto ainda</p>
          <p className="text-gray-400 text-sm mt-1">Adicione fotos da obra.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {fotos.map(foto => (
            <div key={foto.id} className="relative group aspect-square rounded overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={foto.url}
                alt={foto.legenda ?? ''}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setLightbox(foto)}
                  className="bg-white/90 rounded-full p-1.5 hover:bg-white"
                >
                  <ZoomIn size={14} className="text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(foto)}
                  className="bg-white/90 rounded-full p-1.5 hover:bg-white"
                >
                  <X size={14} className="text-red-500" />
                </button>
              </div>
              {/* Date */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs">{formatDate(foto.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.legenda ?? ''}
            className="max-w-full max-h-full object-contain rounded"
            onClick={e => e.stopPropagation()}
          />
          {lightbox.legenda && (
            <div className="absolute bottom-4 text-white text-sm bg-black/60 px-4 py-2 rounded">
              {lightbox.legenda}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
