import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  accent,
}: {
  label: string
  value: string
  hint?: string
  icon: typeof ArrowUpRight
  href?: string
  accent?: boolean
}) {
  const body = (
    <div
      className={cn(
        'group flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-colors',
        href && 'hover:border-forest/40',
        accent && 'border-gold/40 bg-gold/5',
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-lg',
            accent ? 'bg-gold/20 text-charcoal' : 'bg-forest/10 text-forest',
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        {href && (
          <ArrowUpRight
            className="size-4 text-muted-foreground transition-colors group-hover:text-forest"
            aria-hidden
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold tracking-tight text-charcoal">
          {value}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {hint && (
          <span className="text-xs text-muted-foreground/80">{hint}</span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    )
  }
  return body
}
