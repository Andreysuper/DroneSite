import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Ruler,
  Sprout,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getSession } from '@/lib/portal/auth'
import {
  CURRENCY,
  formatDate,
  formatShortDate,
  getDashboardSummary,
  getField,
  getOrganization,
} from '@/lib/portal/demo-data'
import { StatusBadge } from '@/components/portal/status-badge'
import { GreetingHeader } from '@/components/portal/greeting-header'

export default async function PortalOverviewPage() {
  const user = await getCurrentUser()
  const session = await getSession()
  if (!user || !session) return null

  const org = getOrganization(session.organizationId)
  const summary = getDashboardSummary(org.id)
  const next = summary.nextService
  const nextField = next ? getField(next.fieldId) : undefined

  return (
    <>
      <GreetingHeader name={user.name} />

      {/* Primary summary row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Next service — the headline card */}
        <div className="flex flex-col justify-between gap-5 rounded-xl bg-forest p-5 text-cream shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream/55">
                Next Service
              </span>
              {next ? (
                <h2 className="text-2xl font-bold tracking-tight">
                  {next.kind}
                </h2>
              ) : (
                <h2 className="text-2xl font-bold tracking-tight">
                  No service scheduled
                </h2>
              )}
            </div>
            {next && <StatusBadge status={next.status} />}
          </div>

          {next ? (
            <>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-cream/55">
                    <CalendarDays className="size-3.5" aria-hidden />
                    Date
                  </dt>
                  <dd className="text-sm font-semibold">
                    {formatDate(next.scheduledDate)}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-cream/55">
                    <Ruler className="size-3.5" aria-hidden />
                    Area
                  </dt>
                  <dd className="text-sm font-semibold">
                    {next.acres.toLocaleString('en-CA')} acres
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-cream/55">
                    <MapPin className="size-3.5" aria-hidden />
                    Field
                  </dt>
                  <dd className="text-sm font-semibold">
                    {nextField?.name ?? '—'}
                  </dd>
                </div>
              </dl>

              <Button
                render={
                  <Link href={`/portal/services/${next.id}`}>
                    View Details
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                }
                className="w-fit bg-gold font-semibold text-accent-foreground hover:bg-gold/90"
              />
            </>
          ) : (
            <Button
              render={<Link href="/portal/book">Book a service</Link>}
              className="w-fit bg-gold font-semibold text-accent-foreground hover:bg-gold/90"
            />
          )}
        </div>

        {/* Outstanding balance */}
        <div className="flex flex-col justify-between gap-5 rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Outstanding Balance
            </span>
            <span className="text-3xl font-bold tracking-tight text-charcoal">
              {CURRENCY.format(summary.outstandingBalance)}
              <span className="ml-1 text-sm font-semibold text-muted-foreground">
                CAD
              </span>
            </span>
            {summary.nextDueDate && (
              <span className="text-sm text-muted-foreground">
                Due {formatDate(summary.nextDueDate)}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            render={
              <Link href="/portal/invoices">
                View Invoice
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
            className="w-fit"
          />
        </div>
      </div>

      {/* Metric row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
            <TrendingUp className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Total Acres Serviced
            </span>
            <span className="text-2xl font-bold tracking-tight text-charcoal">
              {summary.totalAcresServiced.toLocaleString('en-CA')}
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                acres
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-accent-foreground">
            <Sprout className="size-5" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Active Fields
            </span>
            <span className="text-2xl font-bold tracking-tight text-charcoal">
              {summary.activeFields}
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                fields
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Next operations timeline */}
      <section className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
          <h2 className="text-base font-semibold text-charcoal">
            Next Operations
          </h2>
          <Link
            href="/portal/schedule"
            className="flex items-center gap-1 text-sm font-medium text-forest transition-colors hover:text-gold"
          >
            Full schedule
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <ol className="flex flex-col">
          {summary.upcomingServices.map((svc) => {
            const field = getField(svc.fieldId)
            return (
              <li
                key={svc.id}
                className="flex items-center gap-4 border-b px-5 py-4 last:border-0"
              >
                {/* Date rail */}
                <div className="flex shrink-0 flex-col items-center">
                  <span className="flex w-14 flex-col items-center rounded-lg bg-secondary px-2 py-1.5">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                      {formatShortDate(svc.scheduledDate).split(' ')[0]}
                    </span>
                    <span className="text-lg font-bold leading-none text-charcoal">
                      {new Date(
                        `${svc.scheduledDate}T12:00:00`,
                      ).getDate()}
                    </span>
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-semibold text-charcoal">
                    {svc.kind}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {field?.name} · {svc.acres.toLocaleString('en-CA')} acres
                  </span>
                </div>

                <div className="hidden shrink-0 sm:block">
                  <StatusBadge status={svc.status} />
                </div>

                <Link
                  href={`/portal/services/${svc.id}`}
                  className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-forest"
                  aria-label={`View ${svc.kind} on ${formatDate(svc.scheduledDate)}`}
                >
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            )
          })}
          {summary.upcomingServices.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No upcoming operations scheduled.
            </li>
          )}
        </ol>
      </section>
    </>
  )
}
