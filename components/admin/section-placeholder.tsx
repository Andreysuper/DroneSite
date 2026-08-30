import type { LucideIcon } from 'lucide-react'

export function SectionPlaceholder({
  title,
  description,
  icon: Icon,
  note,
}: {
  title: string
  description: string
  icon: LucideIcon
  note?: string
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-forest/10 text-forest">
          <Icon className="size-6" aria-hidden />
        </span>
        <p className="text-base font-semibold text-charcoal">
          This workspace is coming online
        </p>
        <p className="max-w-md text-pretty text-sm text-muted-foreground leading-relaxed">
          {note ??
            'This area is part of the operations console rollout and will be enabled in an upcoming phase.'}
        </p>
      </div>
    </div>
  )
}
