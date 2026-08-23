import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SERVICE_STAGES,
  STATUS_STAGE_INDEX,
  type ServiceStatus,
} from '@/lib/portal/types'

/**
 * Horizontal progress bar on desktop, vertical timeline on mobile.
 */
export function ServiceTracker({ status }: { status: ServiceStatus }) {
  const current = STATUS_STAGE_INDEX[status]
  const total = SERVICE_STAGES.length

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-charcoal">
        Service Progress
      </h2>

      {/* Desktop: horizontal */}
      <ol className="hidden md:flex">
        {SERVICE_STAGES.map((stage, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={stage}
              className="flex flex-1 flex-col items-center gap-2 text-center"
            >
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    'h-0.5 flex-1',
                    i === 0
                      ? 'bg-transparent'
                      : done || active
                        ? 'bg-forest'
                        : 'bg-border',
                  )}
                />
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 transition-colors',
                    done
                      ? 'bg-forest text-cream ring-forest'
                      : active
                        ? 'bg-gold text-accent-foreground ring-gold'
                        : 'bg-card text-muted-foreground ring-border',
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    'h-0.5 flex-1',
                    i === total - 1
                      ? 'bg-transparent'
                      : done
                        ? 'bg-forest'
                        : 'bg-border',
                  )}
                />
              </div>
              <span
                className={cn(
                  'max-w-[7rem] text-pretty text-xs font-medium leading-snug',
                  done || active ? 'text-charcoal' : 'text-muted-foreground',
                )}
              >
                {stage}
              </span>
            </li>
          )
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="flex flex-col md:hidden">
        {SERVICE_STAGES.map((stage, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2',
                    done
                      ? 'bg-forest text-cream ring-forest'
                      : active
                        ? 'bg-gold text-accent-foreground ring-gold'
                        : 'bg-card text-muted-foreground ring-border',
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                {i < total - 1 && (
                  <span
                    className={cn(
                      'w-0.5 flex-1',
                      done ? 'bg-forest' : 'bg-border',
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'pb-6 text-sm font-medium',
                  done || active ? 'text-charcoal' : 'text-muted-foreground',
                )}
              >
                {stage}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
