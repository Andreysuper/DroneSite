import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireCapability, getAuthProfile } from '@/lib/auth/session'
import { getRequestDetail } from '@/lib/admin/queries'
import { listAssignableStaff } from '@/lib/admin/staff-queries'
import { can } from '@/lib/auth/roles'
import { RequestStatusBadge } from '@/components/admin/request-status-badge'
import { RequestReviewPanel } from '@/components/admin/request-review-panel'
import { RequestTimeline } from '@/components/admin/request-timeline'
import { REQUEST_SOURCE_LABEL } from '@/lib/admin/request-status'
import { formatDate, formatAcres } from '@/lib/admin/format'

export const metadata: Metadata = { title: 'Request Detail' }

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireCapability('requests.view')
  const { id } = await params

  const request = await getRequestDetail(id)
  if (!request) notFound()

  const profile = await getAuthProfile()
  const canManage = can(profile?.role, 'requests.manage')
  const staff = canManage ? await listAssignableStaff() : []

  const detailRows: { label: string; value: string }[] = [
    { label: 'Service', value: request.serviceType || '—' },
    { label: 'Crop / surface', value: request.crop || '—' },
    { label: 'Acres', value: request.acres ? formatAcres(request.acres) : '—' },
    { label: 'Location', value: request.location || '—' },
    {
      label: 'Preferred date',
      value: request.preferredDate ? formatDate(request.preferredDate) : '—',
    },
    {
      label: 'Provides product',
      value:
        request.providesProduct === 'yes'
          ? 'Customer provides product'
          : request.providesProduct === 'no'
            ? 'AgroSkyTech supplies'
            : 'Undecided',
    },
    { label: 'Product details', value: request.productDetails || '—' },
  ]

  const contactRows: { label: string; value: string }[] = [
    { label: 'Contact', value: request.contactName || '—' },
    { label: 'Farm / company', value: request.farmName || '—' },
    { label: 'Email', value: request.contactEmail || '—' },
    { label: 'Phone', value: request.contactPhone || '—' },
    { label: 'Source', value: REQUEST_SOURCE_LABEL[request.source] },
    { label: 'Received', value: formatDate(request.createdAt) },
  ]

  return (
    <div className="space-y-6">
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to requests
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl text-foreground">
              {request.requestNumber}
            </h1>
            <RequestStatusBadge status={request.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {request.serviceType || 'Service request'}
            {request.farmName ? ` · ${request.farmName}` : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DetailCard title="Request details" rows={detailRows} />
          <DetailCard title="Contact" rows={contactRows} />

          {request.message && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold text-foreground">
                Message
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {request.message}
              </p>
            </div>
          )}

          <RequestTimeline events={request.events} />
        </div>

        <div className="space-y-6">
          {canManage ? (
            <RequestReviewPanel
              requestId={request.id}
              status={request.status}
              assignedToId={request.assignedToId}
              internalNotes={request.internalNotes}
              quoteAmount={request.quoteAmount}
              staff={staff}
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
              You have read-only access to this request.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({
  title,
  rows,
}: {
  title: string
  rows: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="text-sm text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
