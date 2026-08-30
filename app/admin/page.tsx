import Link from 'next/link'
import {
  Building2,
  ClipboardList,
  CreditCard,
  Inbox,
  Wrench,
} from 'lucide-react'
import { requireAdminAccess } from '@/lib/auth/session'
import { can } from '@/lib/auth/roles'
import { getDashboardMetrics, getRecentRequests } from '@/lib/admin/queries'
import { formatCurrencyFromCents } from '@/lib/admin/format'
import {
  REQUEST_STATUS_LABEL,
  OPEN_REQUEST_STATUSES,
  type RequestStatus,
} from '@/lib/admin/request-status'
import { MetricCard } from '@/components/admin/metric-card'
import { RequestsTable } from '@/components/admin/requests-table'

export default async function AdminDashboardPage() {
  const profile = await requireAdminAccess()
  const [metrics, recent] = await Promise.all([
    getDashboardMetrics(),
    getRecentRequests(6),
  ])

  const firstName = profile.fullName.split(' ')[0] || 'there'
  const showFinance = can(profile.role, 'invoices.view')
  const showJobs = can(profile.role, 'jobs.view')
  const showCustomers = can(profile.role, 'customers.view')

  const openBreakdown = OPEN_REQUEST_STATUSES.map((status) => ({
    status,
    count: metrics.statusCounts[status] ?? 0,
  })).filter((s) => s.count > 0)

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what needs your attention across operations today.
        </p>
      </header>

      {/* Metrics */}
      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard
          label="Open requests"
          value={String(metrics.openRequests)}
          hint={`${metrics.newRequests} new`}
          icon={ClipboardList}
          href="/admin/requests"
          accent={metrics.newRequests > 0}
        />
        {showJobs && (
          <MetricCard
            label="Scheduled jobs"
            value={String(metrics.scheduledJobs)}
            hint={`${metrics.activeJobs} active now`}
            icon={Wrench}
            href="/admin/jobs"
          />
        )}
        {showFinance && (
          <MetricCard
            label="Outstanding"
            value={formatCurrencyFromCents(metrics.outstandingCents)}
            hint="Unpaid invoices"
            icon={CreditCard}
            href="/admin/invoices"
          />
        )}
        {showCustomers && (
          <MetricCard
            label="Active customers"
            value={String(metrics.activeCustomers)}
            icon={Building2}
            href="/admin/customers"
          />
        )}
      </section>

      {/* Recent requests + pipeline */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">
              Latest requests
            </h2>
            <Link
              href="/admin/requests"
              className="text-sm font-medium text-forest hover:text-gold hover:underline"
            >
              View all
            </Link>
          </div>
          <RequestsTable rows={recent} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-charcoal">
            Pipeline
          </h2>
          <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
            {openBreakdown.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Inbox className="size-6 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  No open requests in the pipeline.
                </p>
              </div>
            ) : (
              openBreakdown.map((s) => (
                <Link
                  key={s.status}
                  href={`/admin/requests?status=${s.status}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium text-charcoal">
                    {REQUEST_STATUS_LABEL[s.status as RequestStatus]}
                  </span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                    {s.count}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
