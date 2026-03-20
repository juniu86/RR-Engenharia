import { Link, useLocation } from 'wouter'
import { LayoutDashboard, FileText, Search, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Obra } from '@/types'

interface ProjectSidebarProps {
  obra: Obra
  relatoriosCount?: number
}

export function ProjectSidebar({ obra, relatoriosCount = 0 }: ProjectSidebarProps) {
  const [location] = useLocation()
  const base = `/obras/${obra.id}`

  const items = [
    { href: base, icon: LayoutDashboard, label: 'Visão geral' },
    { href: `${base}/relatorios`, icon: FileText, label: 'Relatórios', badge: relatoriosCount },
    { href: `${base}/filtro`, icon: Search, label: 'Filtro de busca' },
    { href: `${base}/editar`, icon: Settings, label: 'Editar obra' },
  ]

  return (
    <aside className="w-48 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Back */}
      <Link
        href="/obras"
        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100 font-medium"
      >
        <ArrowLeft size={16} />
        Obras
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {items.map(item => {
          const isActive = location === item.href ||
            (item.href === base && location === base) ||
            (item.href !== base && location.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-1.5 py-0.5 leading-none font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
