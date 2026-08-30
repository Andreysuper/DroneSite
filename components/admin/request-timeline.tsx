import { Eye, EyeOff } from 'lucide-react'
import type { RequestEvent } from '@/lib/admin/queries'
import { REQUEST_STATUS_LABEL } from '@/lib/admin/request-status'
import { formatDateTime } from '@/lib/admin/format'

export function RequestTimeline({ events }: { events: RequestEvent[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Activity</h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <ol className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="relative pl-6">
              <span
                className="absolute left-0 top-1.5 size-2.5 rounded-full bg-forest"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-medium text-foreground">
                  {describe(event)}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                  title={
                    event.isCustomerVisible
                      ? 'Visible to customer'
                      : 'Internal only'
                  }
                >
                  {event.isCustomerVisible ? (
                    <Eye className="size-3" aria-hidden />
                  ) : (
                    <EyeOff className="size-3" aria-hidden />
                  )}
                </span>
              </div>
              {event.note && (
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-muted-foreground">
                  {event.note}
                </p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">
                {event.actorName ? `${event.actorName} · ` : ''}
                {formatDateTime(event.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function describe(event: RequestEvent): string {
  if (event.eventType === 'status_change' && event.toStatus) {
    const to = REQUEST_STATUS_LABEL[event.toStatus]
    if (event.fromStatus) {
      return `Status: ${REQUEST_STATUS_LABEL[event.fromStatus]} → ${to}`
    }
    return `Status set to ${to}`
  }
  if (event.eventType === 'created') return 'Request received'
  if (event.eventType === 'assignment') return 'Assignment updated'
  if (event.eventType === 'note') return 'Note added'
  return event.eventType
}
