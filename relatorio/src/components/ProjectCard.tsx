import { Link } from 'wouter'
import { FileText, Camera, Video } from 'lucide-react'
import { ObraStatusBadge } from './StatusBadge'
import type { Obra } from '@/types'

interface ProjectCardProps {
  obra: Obra & {
    relatorios_count?: number
    fotos_count?: number
    videos_count?: number
  }
}

export function ProjectCard({ obra }: ProjectCardProps) {
  return (
    <Link href={`/obras/${obra.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
          {obra.logo_url ? (
            <img
              src={obra.logo_url}
              alt={obra.nome}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <FileText size={48} />
              <span className="text-xs mt-1">Sem imagem</span>
            </div>
          )}
          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <ObraStatusBadge status={obra.status} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5">
          {/* Stats */}
          <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
            <span className="flex items-center gap-1">
              <FileText size={12} />
              {obra.relatorios_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Camera size={12} />
              {obra.fotos_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Video size={12} />
              {obra.videos_count ?? 0}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
            {obra.nome}
          </h3>
        </div>
      </div>
    </Link>
  )
}
