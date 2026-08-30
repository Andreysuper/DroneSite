'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  REQUEST_STATUS_LABEL,
  type RequestStatus,
} from '@/lib/admin/request-status'

const FILTERS: { key: string; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'new', label: REQUEST_STATUS_LABEL.new },
  { key: 'reviewing', label: REQUEST_STATUS_LABEL.reviewing },
  { key: 'quote_sent', label: REQUEST_STATUS_LABEL.quote_sent },
  { key: 'scheduled', label: REQUEST_STATUS_LABEL.scheduled },
  { key: 'completed', label: REQUEST_STATUS_LABEL.completed },
  { key: 'all', label: 'All' },
]

export function RequestsFilter({
  active,
  openCount,
}: {
  active: RequestStatus | 'all' | 'open'
  openCount: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((f) => {
        const isActive = active === f.key
        return (
          <Link
            key={f.key}
            href={f.key === 'open' ? '/admin/requests' : `/admin/requests?status=${f.key}`}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'border-forest bg-forest text-white'
                : 'border-border bg-card text-muted-foreground hover:border-forest/40 hover:text-foreground',
            )}
          >
            {f.label}
            {f.key === 'open' && openCount > 0 && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-gold/20 text-charcoal',
                )}
              >
                {openCount}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
