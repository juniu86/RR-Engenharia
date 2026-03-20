import { useEffect, useState } from 'react'
import { Video, Upload, X, Play } from 'lucide-react'
import { PageLoader } from '@/components/LoadingSpinner'
import { supabase, uploadFile } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Video as VideoType } from '@/types'

interface VideosGalleryProps {
  obraId: string
}

export function VideosGallery({ obraId }: VideosGalleryProps) {
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [playing, setPlaying] = useState<VideoType | null>(null)

  useEffect(() => {
    loadVideos()
  }, [obraId])

  async function loadVideos() {
    setLoading(true)
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('obra_id', obraId)
      .order('created_at', { ascending: false })
    setVideos(data ?? [])
    setLoading(false)
  }

  async function handleUpload(files: FileList) {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const path = `${obraId}/${Date.now()}-${file.name}`
        const url = await uploadFile('videos', path, file)
        await supabase.from('videos').insert({ obra_id: obraId, url })
      }
      toast.success(`${files.length} vídeo(s) adicionado(s)!`)
      await loadVideos()
    } catch (err) {
      toast.error('Erro ao fazer upload: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(video: VideoType) {
    if (!confirm('Excluir este vídeo?')) return
    try {
      const path = video.url.split('/storage/v1/object/public/videos/')[1]
      if (path) await supabase.storage.from('videos').remove([path])
      await supabase.from('videos').delete().eq('id', video.id)
      setVideos(v => v.filter(x => x.id !== video.id))
      toast.success('Vídeo excluído')
      if (playing?.id === video.id) setPlaying(null)
    } catch {
      toast.error('Erro ao excluir vídeo')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Vídeos ({videos.length})</h2>
        <label className={`flex items-center gap-2 bg-[#F97316] text-white text-sm font-bold px-4 py-2 rounded cursor-pointer hover:bg-orange-600 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={15} />
          {uploading ? 'Enviando...' : 'Adicionar Vídeos'}
          <input type="file" multiple accept="video/*" className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
        </label>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
          <Video size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum vídeo ainda</p>
          <p className="text-gray-400 text-sm mt-1">Adicione vídeos da obra.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map(video => (
            <div key={video.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <Video size={32} className="text-gray-600" />
                )}
                <button
                  onClick={() => setPlaying(video)}
                  className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors"
                >
                  <div className="bg-white/90 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={18} className="text-gray-800 fill-gray-800" />
                  </div>
                </button>
                {video.duracao && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {Math.floor(video.duracao / 60).toString().padStart(2, '0')}:{(video.duracao % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">{formatDate(video.created_at)}</span>
                <button
                  onClick={() => handleDelete(video)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {video.legenda && (
                <div className="px-2.5 pb-2.5 text-xs text-gray-600 truncate">{video.legenda}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Video player modal */}
      {playing && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setPlaying(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setPlaying(null)}>
            <X size={28} />
          </button>
          <video
            src={playing.url}
            controls
            autoPlay
            className="max-w-full max-h-full rounded"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
