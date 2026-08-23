import { cn } from '@/lib/utils'
import { STATUS_LABEL, type ServiceStatus } from '@/lib/portal/types'

const STATUS_STYLES: Record<ServiceStatus, string> = {
  requested: 'bg-muted text-muted-foreground ring-border',
  'pending-confirmation': 'bg-gold/15 text-accent-foreground ring-gold/40',
  confirmed: 'bg-forest/10 text-forest ring-forest/25',
  'operator-dispatched': 'bg-forest/10 text-forest ring-forest/25',
  'in-progress': 'bg-forest text-cream ring-forest',
  completed: 'bg-forest/10 text-forest ring-forest/25',
  'weather-delay': 'bg-gold/20 text-accent-foreground ring-gold/50',
  rescheduled: 'bg-gold/15 text-accent-foreground ring-gold/40',
  cancelled: 'bg-destructive/10 text-destructive ring-destructive/25',
}

export function StatusBadge({
  status,
  className,
}: {
  status: ServiceStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status === 'in-progress' && (
        <span
          className="size-1.5 animate-pulse rounded-full bg-gold"
          aria-hidden
        />
      )}
      {STATUS_LABEL[status]}
    </span>
  )
}

const INVOICE_STYLES = {
  paid: 'bg-forest/10 text-forest ring-forest/25',
  outstanding: 'bg-gold/20 text-accent-foreground ring-gold/50',
  upcoming: 'bg-muted text-muted-foreground ring-border',
  overdue: 'bg-destructive/10 text-destructive ring-destructive/25',
} as const

export function InvoiceStatusBadge({
  status,
}: {
  status: keyof typeof INVOICE_STYLES
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset',
        INVOICE_STYLES[status],
      )}
    >
      {status}
    </span>
  )
}

/** Colour-coded chip used for service categories on the calendar and lists. */
const KIND_STYLES: Record<string, string> = {
  'Crop Spraying': 'bg-forest text-cream',
  'Fertilizer Application': 'bg-gold text-accent-foreground',
  'Irrigation / Water Application': 'bg-chart-2 text-cream',
  'Pest Control': 'bg-destructive/85 text-cream',
  'Golf Course Service': 'bg-chart-4 text-cream',
  'Field Mapping': 'bg-charcoal text-cream',
  Other: 'bg-muted-foreground text-cream',
}

export function ServiceKindChip({
  kind,
  className,
}: {
  kind: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[0.7rem] font-semibold',
        KIND_STYLES[kind] ?? KIND_STYLES.Other,
        className,
      )}
    >
      {kind}
    </span>
  )
}

export function kindAccent(kind: string) {
  return KIND_STYLES[kind] ?? KIND_STYLES.Other
}
