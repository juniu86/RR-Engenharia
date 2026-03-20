import { cn, obraStatusColor, obraStatusLabel, relatorioStatusColor, relatorioStatusLabel } from '@/lib/utils'
import type { ObraStatus, RelatorioStatus } from '@/types'

export function ObraStatusBadge({ status }: { status: ObraStatus }) {
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', obraStatusColor[status])}>
      {obraStatusLabel[status]}
    </span>
  )
}

export function RelatorioStatusBadge({ status }: { status: RelatorioStatus }) {
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', relatorioStatusColor[status])}>
      {relatorioStatusLabel[status]}
    </span>
  )
}
