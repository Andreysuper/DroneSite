import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CreditCard,
  Download,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/portal/page-header'
import { InvoiceStatusBadge } from '@/components/portal/status-badge'
import {
  CURRENCY,
  formatDate,
  getInvoices,
  getServiceOrder,
  getUpcomingCharges,
} from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Invoices & Payments | Client Portal',
  description:
    'Review outstanding balances, payment history and upcoming charges for your drone application services.',
}

export default function InvoicesPage() {
  const invoices = getInvoices().sort((a, b) =>
    b.issuedDate.localeCompare(a.issuedDate),
  )
  const upcoming = getUpcomingCharges()

  const outstanding = invoices
    .filter((i) => i.status === 'outstanding' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0)
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length
  const paidThisSeason = invoices.reduce((sum, i) => sum + i.amountPaid, 0)
  const forecast = upcoming.reduce((sum, c) => sum + c.estimatedAmount, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Invoices & Payments"
        subtitle="Balances, payment history and what is coming up. Every invoice ties back to a completed flight."
        action={
          <Button variant="outline">
            <Download className="size-4" aria-hidden />
            Export statement
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          className={
            outstanding > 0
              ? 'flex flex-col gap-1 border-gold/40 bg-gold/5 p-4'
              : 'flex flex-col gap-1 p-4'
          }
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Outstanding balance
          </p>
          <p className="font-serif text-3xl font-bold">
            {CURRENCY.format(outstanding)}
          </p>
          {overdueCount > 0 ? (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertTriangle className="size-3.5" aria-hidden />
              {overdueCount} invoice{overdueCount === 1 ? '' : 's'} overdue
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing overdue</p>
          )}
        </Card>
        <Card className="flex flex-col gap-1 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Paid this season
          </p>
          <p className="font-serif text-3xl font-bold">
            {CURRENCY.format(paidThisSeason)}
          </p>
          <p className="text-sm text-muted-foreground">
            Across {invoices.length} invoices
          </p>
        </Card>
        <Card className="flex flex-col gap-1 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Upcoming charges
          </p>
          <p className="font-serif text-3xl font-bold">
            {CURRENCY.format(forecast)}
          </p>
          <p className="text-sm text-muted-foreground">
            {upcoming.length} scheduled service
            {upcoming.length === 1 ? '' : 's'}
          </p>
        </Card>
        <Card className="flex flex-col gap-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Payment method
          </p>
          <p className="flex items-center gap-2 font-semibold">
            <CreditCard className="size-4 text-forest" aria-hidden />
            EFT — RBC ••4821
          </p>
          <Button size="sm" variant="outline" className="mt-auto w-fit">
            Update method
          </Button>
        </Card>
      </div>

      {/* Invoice list */}
      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-bold">All invoices</h2>
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {invoices.map((inv) => {
              const svc = getServiceOrder(inv.serviceOrderId)
              const due = inv.total - inv.amountPaid
              return (
                <li key={inv.id}>
                  <Link
                    href={`/portal/invoices/${inv.id}`}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
                        <Receipt className="size-4" aria-hidden />
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold leading-tight">
                          {inv.reference}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {svc?.kind ?? 'Service'} · {inv.acres} ac ·{' '}
                          {CURRENCY.format(inv.ratePerAcre)}/ac
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Issued {formatDate(inv.issuedDate)} · Due{' '}
                          {formatDate(inv.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="font-serif text-lg font-bold">
                          {CURRENCY.format(inv.total)}
                        </p>
                        {due > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {CURRENCY.format(due)} due
                          </p>
                        )}
                      </div>
                      <InvoiceStatusBadge status={inv.status} />
                      <ArrowRight
                        className="hidden size-4 text-muted-foreground sm:block"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>
      </section>

      {/* Upcoming charges */}
      <section className="flex flex-col gap-3">
        <h2 className="font-serif text-xl font-bold">Upcoming charges</h2>
        <Card className="flex flex-col gap-3 p-4">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No scheduled services to bill.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <CalendarClock
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div>
                      <p className="text-sm font-semibold">{c.kind}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(c.date)} · {c.acres} ac
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ~{CURRENCY.format(c.estimatedAmount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">
            Estimates only — final invoices reflect acres actually flown.
          </p>
        </Card>
      </section>
    </div>
  )
}
