import Link from 'next/link'
import { ChevronRight, Inbox } from 'lucide-react'
import type { AdminRequestRow } from '@/lib/admin/queries'
import { REQUEST_SOURCE_LABEL } from '@/lib/admin/request-status'
import { formatRelative } from '@/lib/admin/format'
import { RequestStatusBadge } from './request-status-badge'

export function RequestsTable({ rows }: { rows: AdminRequestRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-10 text-center">
        <Inbox className="size-6 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-charcoal">No requests yet</p>
        <p className="text-sm text-muted-foreground">
          New requests from the website and client portal will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">Request</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Service</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Received</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((r) => (
            <tr key={r.id} className="transition-colors hover:bg-muted/30">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/requests/${r.id}`}
                  className="font-semibold text-charcoal hover:text-forest"
                >
                  {r.requestNumber}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {REQUEST_SOURCE_LABEL[r.source]}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-charcoal">
                  {r.farmName || r.contactName || '—'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.location || '—'}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-charcoal">{r.serviceType || '—'}</div>
                {r.acres ? (
                  <div className="text-xs text-muted-foreground">
                    {r.acres} ac
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <RequestStatusBadge status={r.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatRelative(r.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/requests/${r.id}`}
                  className="inline-flex items-center text-forest hover:text-gold"
                  aria-label={`Open ${r.requestNumber}`}
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile list */}
      <ul className="divide-y md:hidden">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/requests/${r.id}`}
              className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-charcoal">
                  {r.requestNumber}
                </span>
                <RequestStatusBadge status={r.status} />
              </div>
              <div className="text-sm text-charcoal">
                {r.farmName || r.contactName || '—'}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.serviceType || '—'}</span>
                <span>{formatRelative(r.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
