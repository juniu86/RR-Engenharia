import { Link, useLocation } from 'wouter'
import { Plus, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

interface NavbarProps {
  onAddClick?: () => void
}

export function Navbar({ onAddClick }: NavbarProps) {
  const { profile, signOut } = useAuth()
  const [location] = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems = [
    { label: 'Obras', href: '/obras' },
    { label: 'Relatórios', href: '/relatorios' },
  ]

  return (
    <header className="bg-[#2D2D8F] text-white h-14 flex items-center px-4 gap-6 sticky top-0 z-50 shadow-md">
      {/* Logo */}
      <Link href="/obras" className="font-bold text-sm tracking-wide whitespace-nowrap hover:text-blue-200 transition-colors">
        RR ENGENHARIA E SOLUÇÕES
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-white/10 ${
              location.startsWith(item.href) ? 'bg-white/20' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button className="px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-1">
          Análise de dados <ChevronDown size={14} />
        </button>
        <button className="px-3 py-1.5 rounded text-sm font-medium transition-colors hover:bg-white/10 flex items-center gap-1">
          Cadastros <ChevronDown size={14} />
        </button>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 text-sm hover:text-blue-200 transition-colors">
          <Globe size={16} />
          PT
          <ChevronDown size={14} />
        </button>

        <button
          onClick={onAddClick}
          className="bg-[#F97316] hover:bg-orange-600 text-white text-sm font-bold px-4 py-1.5 rounded flex items-center gap-1.5 transition-colors"
        >
          <Plus size={16} />
          ADICIONAR
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-xs font-bold uppercase">
              {profile?.nome?.charAt(0) ?? 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold leading-tight">{profile?.nome ?? 'Usuário'}</div>
              <div className="text-xs text-blue-200 leading-tight">{profile?.email ?? ''}</div>
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white text-gray-800 rounded shadow-lg py-1 min-w-[150px] z-50">
              <button
                onClick={() => { signOut(); setUserMenuOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
