'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Download,
  FlaskConical,
  Map as MapIcon,
  MapPin,
  RefreshCw,
  Ruler,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CURRENCY, formatDate } from '@/lib/portal/demo-data'
import type { Field, ServiceOrder, ServiceStatus } from '@/lib/portal/types'
import { StatusBadge } from './status-badge'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Requested', value: 'requested' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
] as const

type FilterValue = (typeof FILTERS)[number]['value']

/** Groups the granular operational statuses into the customer-facing filters. */
function matchesFilter(status: ServiceStatus, filter: FilterValue) {
  if (filter === 'all') return true
  if (filter === 'scheduled') {
    return [
      'confirmed',
      'pending-confirmation',
      'operator-dispatched',
      'rescheduled',
      'weather-delay',
    ].includes(status)
  }
  return status === filter
}

export function ServicesList({
  orders,
  fields,
}: {
  orders: ServiceOrder[]
  fields: Field[]
}) {
  const [filter, setFilter] = useState<FilterValue>('all')

  const fieldById = useMemo(
    () => new Map(fields.map((f) => [f.id, f])),
    [fields],
  )

  const visible = useMemo(
    () =>
      orders
        .filter((o) => matchesFilter(o.status, filter))
        .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate)),
    [orders, filter],
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Filter pills */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter services by status"
      >
        {FILTERS.map((f) => {
          const count = orders.filter((o) =>
            matchesFilter(o.status, f.value),
          ).length
          const active = filter === f.value
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'border-forest bg-forest text-cream'
                  : 'border-border bg-card text-muted-foreground hover:border-forest/40 hover:text-forest',
              )}
            >
              {f.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs font-bold',
                  active ? 'bg-cream/20' : 'bg-muted',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Service cards */}
      <div className="flex flex-col gap-4">
        {visible.map((svc) => {
          const field = fieldById.get(svc.fieldId)
          const isComplete = svc.status === 'completed'
          return (
            <article
              key={svc.id}
              className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-lg font-semibold text-charcoal">
                      {svc.kind}
                    </h2>
                    <StatusBadge status={svc.status} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {svc.reference}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold tracking-tight text-charcoal">
                    {CURRENCY.format(svc.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isComplete ? 'Total' : 'Estimated'} CAD
                  </span>
                </div>
              </div>

              <dl className="grid gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
                <Detail icon={MapPin} label="Field" value={field?.name ?? '—'} />
                <Detail
                  icon={Ruler}
                  label="Size"
                  value={`${svc.acres.toLocaleString('en-CA')} acres`}
                />
                <Detail
                  icon={MapPin}
                  label="Location"
                  value={field?.address ?? '—'}
                />
                <Detail
                  icon={CalendarDays}
                  label="Scheduled date"
                  value={formatDate(svc.scheduledDate)}
                />
                <Detail
                  icon={FlaskConical}
                  label="Product / treatment"
                  value={svc.product}
                />
                <Detail
                  icon={UserRound}
                  label="Operator"
                  value={svc.operator ?? 'To be assigned'}
                />
              </dl>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                <Button
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link href={`/portal/services/${svc.id}`}>
                      View Details
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  }
                  className="bg-forest text-primary-foreground hover:bg-forest-deep"
                />
                {isComplete ? (
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link href={`/portal/services/${svc.id}#report`}>
                        <Download className="size-3.5" aria-hidden />
                        Download Report
                      </Link>
                    }
                  />
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <Download className="size-3.5" aria-hidden />
                    Download Report
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={
                    <Link href={`/portal/maps?field=${svc.fieldId}`}>
                      <MapIcon className="size-3.5" aria-hidden />
                      View Map
                    </Link>
                  }
                />
                <Button
                  size="sm"
                  variant="ghost"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/portal/book?service=${encodeURIComponent(svc.kind)}&field=${svc.fieldId}`}
                    >
                      <RefreshCw className="size-3.5" aria-hidden />
                      Repeat Service
                    </Link>
                  }
                />
              </div>
            </article>
          )
        })}

        {visible.length === 0 && (
          <p className="rounded-xl border border-dashed bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            No services match this filter.
          </p>
        )}
      </div>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  )
}
