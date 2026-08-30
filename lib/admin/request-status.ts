/**
 * Client-safe metadata for the service-request pipeline: labels, badge styles
 * and the ordered set of statuses. Shared by admin and portal UIs.
 */

export type RequestStatus =
  | 'new'
  | 'reviewing'
  | 'need_more_information'
  | 'quote_prepared'
  | 'quote_sent'
  | 'customer_approved'
  | 'scheduling'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'

export type RequestSource = 'website' | 'customer_portal' | 'admin'

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  need_more_information: 'Needs Info',
  quote_prepared: 'Quote Prepared',
  quote_sent: 'Quote Sent',
  customer_approved: 'Approved',
  scheduling: 'Scheduling',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
}

/** Tailwind classes for a status badge (uses theme tokens, no raw colors). */
export const REQUEST_STATUS_BADGE: Record<RequestStatus, string> = {
  new: 'bg-gold/20 text-charcoal border-gold/40',
  reviewing: 'bg-forest/10 text-forest border-forest/25',
  need_more_information: 'bg-amber-500/10 text-amber-700 border-amber-500/25',
  quote_prepared: 'bg-forest/10 text-forest border-forest/25',
  quote_sent: 'bg-forest/10 text-forest border-forest/25',
  customer_approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
  scheduling: 'bg-forest/10 text-forest border-forest/25',
  scheduled: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/25',
  in_progress: 'bg-sky-500/10 text-sky-700 border-sky-500/25',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-muted text-muted-foreground border-border',
  rejected: 'bg-destructive/10 text-destructive border-destructive/25',
}

export const REQUEST_SOURCE_LABEL: Record<RequestSource, string> = {
  website: 'Website',
  customer_portal: 'Client Portal',
  admin: 'Admin',
}

/** Statuses that count as an open request needing attention. */
export const OPEN_REQUEST_STATUSES: RequestStatus[] = [
  'new',
  'reviewing',
  'need_more_information',
  'quote_prepared',
  'quote_sent',
  'customer_approved',
  'scheduling',
]

/** Allowed forward transitions the admin review UI offers from each status. */
export const REQUEST_NEXT_STATUSES: Record<RequestStatus, RequestStatus[]> = {
  new: ['reviewing', 'need_more_information', 'rejected'],
  reviewing: ['need_more_information', 'quote_prepared', 'rejected'],
  need_more_information: ['reviewing', 'quote_prepared', 'rejected'],
  quote_prepared: ['quote_sent', 'reviewing'],
  quote_sent: ['customer_approved', 'need_more_information', 'rejected'],
  customer_approved: ['scheduling'],
  scheduling: ['scheduled'],
  scheduled: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  rejected: [],
}
