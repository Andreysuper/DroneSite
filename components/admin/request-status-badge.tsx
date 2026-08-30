import { cn } from '@/lib/utils'
import {
  REQUEST_STATUS_BADGE,
  REQUEST_STATUS_LABEL,
  type RequestStatus,
} from '@/lib/admin/request-status'

export function RequestStatusBadge({
  status,
  className,
}: {
  status: RequestStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        REQUEST_STATUS_BADGE[status],
        className,
      )}
    >
      {REQUEST_STATUS_LABEL[status]}
    </span>
  )
}
