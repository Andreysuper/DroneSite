import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/portal/page-header'
import { InvoiceStatusBadge } from '@/components/portal/status-badge'
import {
  CURRENCY,
  CURRENCY_PRECISE,
  formatDate,
  getField,
  getInvoice,
  getOrganization,
  getServiceOrder,
} from '@/lib/portal/demo-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const invoice = getInvoice(id)
  return {
    title: invoice
      ? `${invoice.reference} | Client Portal`
      : 'Invoice | Client Portal',
    description: invoice
      ? `Invoice ${invoice.reference} for ${invoice.acres} acres of drone application.`
      : undefined,
  }
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = getInvoice(id)
  if (!invoice) notFound()

  const svc = getServiceOrder(invoice.serviceOrderId)
  const field = svc ? getField(svc.fieldId) : undefined
  const org = getOrganization(invoice.organizationId)
  const due = invoice.total - invoice.amountPaid
  const isSettled = due <= 0

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/portal/invoices"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to invoices
      </Link>

      <PageHeader
        title={invoice.reference}
        subtitle={`Issued ${formatDate(invoice.issuedDate)} · Due ${formatDate(invoice.dueDate)}`}
        action={
          <>
            <InvoiceStatusBadge status={invoice.status} />
            <Button variant="outline">
              <Download className="size-4" aria-hidden />
              Download PDF
            </Button>
            {!isSettled && (
              <Button className="bg-forest text-primary-foreground hover:bg-forest-deep">
                <CreditCard className="size-4" aria-hidden />
                Pay {CURRENCY.format(due)}
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Invoice body */}
        <Card className="flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Billed to
              </p>
              <p className="font-semibold">{org?.name}</p>
              <p className="text-sm text-muted-foreground">{org?.location}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                From
              </p>
              <p className="font-semibold">AgroSkyTech</p>
              <p className="text-sm text-muted-foreground">
                Manitoba, Canada
              </p>
            </div>
          </div>

          <Separator />

          {/* Line items */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Line items
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="pb-2 font-semibold">
                      Description
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold">
                      Acres
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold">
                      Rate
                    </th>
                    <th scope="col" className="pb-2 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3">
                      <p className="font-medium">
                        {svc?.kind ?? 'Drone application'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {field?.name ?? 'Field'}
                        {svc?.product ? ` · ${svc.product}` : ''}
                      </p>
                      {svc && (
                        <Link
                          href={`/portal/services/${svc.id}`}
                          className="text-xs text-forest underline-offset-4 hover:underline"
                        >
                          {svc.reference}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {invoice.acres}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {CURRENCY_PRECISE.format(invoice.ratePerAcre)}
                    </td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {CURRENCY.format(invoice.subtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">
                {CURRENCY.format(invoice.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">GST (5%)</dt>
              <dd className="tabular-nums">{CURRENCY.format(invoice.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-semibold">Total</dt>
              <dd className="font-serif text-lg font-bold tabular-nums">
                {CURRENCY.format(invoice.total)}
              </dd>
            </div>
            {invoice.amountPaid > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Paid</dt>
                <dd className="tabular-nums text-forest">
                  −{CURRENCY.format(invoice.amountPaid)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2">
              <dt className="font-semibold">Balance due</dt>
              <dd className="font-serif text-lg font-bold tabular-nums">
                {CURRENCY.format(Math.max(0, due))}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Side rail */}
        <div className="flex flex-col gap-4">
          {isSettled ? (
            <Card className="flex flex-col items-start gap-2 border-forest/30 bg-forest/5 p-4">
              <span className="flex items-center gap-2 font-semibold text-forest">
                <CheckCircle2 className="size-4" aria-hidden />
                Paid in full
              </span>
              <p className="text-sm text-muted-foreground">
                Thank you — nothing further is owed on this invoice.
              </p>
            </Card>
          ) : (
            <Card className="flex flex-col gap-3 border-gold/40 bg-gold/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Balance due
              </p>
              <p className="font-serif text-3xl font-bold">
                {CURRENCY.format(due)}
              </p>
              <p className="text-sm text-muted-foreground">
                Due {formatDate(invoice.dueDate)}
              </p>
              <Button className="bg-forest text-primary-foreground hover:bg-forest-deep">
                <CreditCard className="size-4" aria-hidden />
                Pay now
              </Button>
            </Card>
          )}

          <Card className="flex flex-col gap-3 p-4">
            <h2 className="font-semibold">Payment history</h2>
            {invoice.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments recorded yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {invoice.payments.map((p) => (
                  <li key={p.id} className="flex flex-col gap-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold tabular-nums">
                        {CURRENCY.format(p.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(p.date)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {p.method}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <h2 className="font-semibold">Question about this invoice?</h2>
            <p className="text-sm text-muted-foreground">
              Our billing team can walk through acres flown and rates applied.
            </p>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href="/portal/messages">
                  <MessageSquare className="size-4" aria-hidden />
                  Message billing
                </Link>
              }
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
