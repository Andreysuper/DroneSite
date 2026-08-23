'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarPlus, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/portal/status-badge'
import { formatDate } from '@/lib/portal/demo-data'
import type { Field, ServiceOrder } from '@/lib/portal/types'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Status colours for the small dot markers inside calendar cells. */
const DOT_TONE: Record<ServiceStatus, string> = {
  requested: 'bg-muted-foreground',
  'pending-confirmation': 'bg-muted-foreground',
  confirmed: 'bg-forest',
  'operator-dispatched': 'bg-forest',
  'in-progress': 'bg-gold',
  completed: 'bg-forest/50',
  'weather-delay': 'bg-gold/60',
  rescheduled: 'bg-gold/60',
  cancelled: 'bg-destructive/60',
}

/** Parse an ISO date as a local calendar day (avoids UTC off-by-one). */
function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

type ScheduleCalendarProps = {
  services: ServiceOrder[]
  fields: Field[]
}

export function ScheduleCalendar({ services, fields }: ScheduleCalendarProps) {
  const today = new Date()
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selected, setSelected] = useState<string | null>(null)

  const fieldName = (id: string) =>
    fields.find((f) => f.id === id)?.name ?? 'Unknown field'

  /** Group services by their scheduled ISO date. */
  const byDate = useMemo(() => {
    const map = new Map<string, ServiceOrder[]>()
    for (const svc of services) {
      const list = map.get(svc.scheduledDate) ?? []
      list.push(svc)
      map.set(svc.scheduledDate, list)
    }
    return map
  }, [services])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const monthLabel = cursor.toLocaleDateString('en-CA', {
    month: 'long',
    year: 'numeric',
  })

  /** Build a 6-week grid of days covering the visible month. */
  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const start = new Date(year, month, 1 - first.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      return {
        iso,
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        services: byDate.get(iso) ?? [],
      }
    })
  }, [year, month, byDate, today])

  const upcoming = useMemo(
    () =>
      services
        .filter((s) => s.status !== 'complete' && s.status !== 'cancelled')
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
        .slice(0, 5),
    [services],
  )

  const selectedServices = selected ? (byDate.get(selected) ?? []) : []

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {/* Calendar */}
      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold">{monthLabel}</h2>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              aria-label="Previous month"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
              }
            >
              Today
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next month"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </header>

        <div
          className="grid grid-cols-7 gap-1"
          role="grid"
          aria-label={`Service schedule for ${monthLabel}`}
        >
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              role="columnheader"
              className="pb-1 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {d}
            </div>
          ))}
          {cells.map((cell) => {
            const hasServices = cell.services.length > 0
            return (
              <button
                key={cell.iso}
                type="button"
                role="gridcell"
                disabled={!hasServices}
                onClick={() => setSelected(cell.iso)}
                aria-label={`${formatDate(cell.iso)}${hasServices ? `, ${cell.services.length} service${cell.services.length === 1 ? '' : 's'}` : ', no services'}`}
                aria-current={cell.isToday ? 'date' : undefined}
                className={cn(
                  'flex min-h-16 flex-col items-center gap-1 rounded-lg border p-1.5 text-sm transition-colors sm:min-h-20',
                  cell.inMonth
                    ? 'border-border bg-card'
                    : 'border-transparent text-muted-foreground/50',
                  hasServices &&
                    'cursor-pointer border-forest/30 bg-forest/5 hover:border-forest/60 hover:bg-forest/10',
                  cell.isToday && 'ring-2 ring-gold ring-offset-1',
                  selected === cell.iso && 'border-forest bg-forest/15',
                )}
              >
                <span
                  className={cn(
                    'font-semibold',
                    cell.isToday && 'text-gold-deep',
                  )}
                >
                  {cell.day}
                </span>
                <span className="flex flex-wrap justify-center gap-0.5">
                  {cell.services.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className={cn(
                        'size-1.5 rounded-full',
                        DOT_TONE[s.status] ?? 'bg-muted-foreground',
                      )}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          {[
            ['Scheduled', 'bg-forest'],
            ['In progress', 'bg-gold'],
            ['Complete', 'bg-forest/50'],
            ['Cancelled', 'bg-destructive/60'],
          ].map(([label, tone]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', tone)} />
              {label}
            </span>
          ))}
        </div>
      </Card>

      {/* Side panel */}
      <div className="flex flex-col gap-4">
        {selected && (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">
                {formatDate(selected)}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(null)}
              >
                Clear
              </Button>
            </div>
            {selectedServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing booked on this day.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {selectedServices.map((svc) => (
                  <li key={svc.id}>
                    <Link
                      href={`/portal/services/${svc.id}`}
                      className="flex flex-col gap-1.5 rounded-lg border border-border p-3 transition-colors hover:border-forest/50 hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold">
                          {svc.kind}
                        </span>
                        <StatusBadge status={svc.status} />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {fieldName(svc.fieldId)} · {svc.acres} ac
                      </span>
                      {svc.estimatedArrival && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" aria-hidden />
                          Arrives {svc.estimatedArrival}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        <Card className="flex flex-col gap-3 p-4">
          <h3 className="font-semibold">Next up</h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No services scheduled.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {upcoming.map((svc) => (
                <li key={svc.id}>
                  <Link
                    href={`/portal/services/${svc.id}`}
                    className="flex flex-col gap-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/60"
                  >
                    <span className="text-sm font-semibold leading-tight">
                      {svc.kind}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(svc.scheduledDate)} ·{' '}
                      {fieldName(svc.fieldId)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Button
            className="mt-1 bg-forest text-primary-foreground hover:bg-forest-deep"
            nativeButton={false}
            render={
              <Link href="/portal/book">
                <CalendarPlus className="size-4" aria-hidden />
                Book a service
              </Link>
            }
          />
        </Card>
      </div>
    </div>
  )
}
