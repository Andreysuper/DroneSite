/**
 * Server-only data access for the admin panel. All reads go through the
 * request-scoped Supabase server client, so Postgres RLS enforces that only
 * staff see this data — there is no service-role escalation here.
 */

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import {
  OPEN_REQUEST_STATUSES,
  type RequestSource,
  type RequestStatus,
} from './request-status'

export type AdminRequestRow = {
  id: string
  requestNumber: string
  status: RequestStatus
  source: RequestSource
  contactName: string
  farmName: string
  serviceType: string
  acres: number | null
  location: string
  createdAt: string
  quoteAmount: number | null
  assignedToName: string | null
}

export type DashboardMetrics = {
  openRequests: number
  newRequests: number
  scheduledJobs: number
  activeJobs: number
  outstandingCents: number
  activeCustomers: number
  statusCounts: Record<string, number>
}

function num(value: unknown): number {
  const n = typeof value === 'string' ? Number.parseFloat(value) : Number(value)
  return Number.isFinite(n) ? n : 0
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  const [requestsRes, jobsRes, invoicesRes, customersRes] = await Promise.all([
    supabase.from('service_requests').select('status'),
    supabase.from('jobs').select('status'),
    supabase.from('invoices').select('status, total, amount_paid'),
    supabase.from('customers').select('id').eq('is_active', true),
  ])

  const statusCounts: Record<string, number> = {}
  let openRequests = 0
  let newRequests = 0
  for (const row of requestsRes.data ?? []) {
    const status = row.status as RequestStatus
    statusCounts[status] = (statusCounts[status] ?? 0) + 1
    if (OPEN_REQUEST_STATUSES.includes(status)) openRequests += 1
    if (status === 'new') newRequests += 1
  }

  let scheduledJobs = 0
  let activeJobs = 0
  for (const row of jobsRes.data ?? []) {
    const status = String(row.status)
    if (['scheduled', 'confirmed', 'operator_assigned'].includes(status)) {
      scheduledJobs += 1
    }
    if (
      ['traveling', 'on_site', 'preparing', 'in_progress', 'paused'].includes(
        status,
      )
    ) {
      activeJobs += 1
    }
  }

  let outstandingCents = 0
  for (const row of invoicesRes.data ?? []) {
    if (['outstanding', 'overdue', 'upcoming'].includes(String(row.status))) {
      outstandingCents += Math.round(
        (num(row.total) - num(row.amount_paid)) * 100,
      )
    }
  }

  return {
    openRequests,
    newRequests,
    scheduledJobs,
    activeJobs,
    outstandingCents,
    activeCustomers: customersRes.data?.length ?? 0,
    statusCounts,
  }
}

type RawRequestRow = {
  id: string
  request_number: string
  status: RequestStatus
  source: RequestSource
  contact_name: string
  farm_name: string
  service_type: string
  acres: string | number | null
  location: string
  created_at: string
  quote_amount: string | number | null
  assigned_to: { full_name: string } | null
}

function mapRequestRow(row: RawRequestRow): AdminRequestRow {
  return {
    id: row.id,
    requestNumber: row.request_number,
    status: row.status,
    source: row.source,
    contactName: row.contact_name,
    farmName: row.farm_name,
    serviceType: row.service_type,
    acres: row.acres === null ? null : num(row.acres),
    location: row.location,
    createdAt: row.created_at,
    quoteAmount: row.quote_amount === null ? null : num(row.quote_amount),
    assignedToName: row.assigned_to?.full_name ?? null,
  }
}

const REQUEST_SELECT =
  'id, request_number, status, source, contact_name, farm_name, service_type, acres, location, created_at, quote_amount, assigned_to:profiles!service_requests_assigned_to_fkey(full_name)'

export async function getRecentRequests(limit = 6): Promise<AdminRequestRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_requests')
    .select(REQUEST_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []).map((r) => mapRequestRow(r as unknown as RawRequestRow))
}

export async function getRequests(options?: {
  status?: RequestStatus | 'all'
  openOnly?: boolean
}): Promise<AdminRequestRow[]> {
  const supabase = await createClient()
  let query = supabase.from('service_requests').select(REQUEST_SELECT)

  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  } else if (options?.openOnly) {
    query = query.in('status', OPEN_REQUEST_STATUSES)
  }

  const { data } = await query.order('created_at', { ascending: false })
  return (data ?? []).map((r) => mapRequestRow(r as unknown as RawRequestRow))
}

export type RequestEvent = {
  id: string
  eventType: string
  fromStatus: RequestStatus | null
  toStatus: RequestStatus | null
  note: string
  isCustomerVisible: boolean
  createdAt: string
  actorName: string | null
}

export type AdminRequestDetail = AdminRequestRow & {
  contactEmail: string
  contactPhone: string
  crop: string
  preferredDate: string | null
  providesProduct: string
  productDetails: string
  message: string
  internalNotes: string
  customerId: string | null
  assignedToId: string | null
  events: RequestEvent[]
}

const REQUEST_DETAIL_SELECT = `id, request_number, status, source, contact_name, contact_email,
  contact_phone, farm_name, service_type, crop, acres, location, created_at,
  preferred_date, provides_product, product_details, message, internal_notes,
  quote_amount, customer_id, assigned_to,
  assigned_profile:profiles!service_requests_assigned_to_fkey(full_name)`

export async function getRequestDetail(
  id: string,
): Promise<AdminRequestDetail | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_requests')
    .select(REQUEST_DETAIL_SELECT)
    .eq('id', id)
    .maybeSingle()

  if (!data) return null
  const row = data as Record<string, unknown>

  const { data: eventRows } = await supabase
    .from('request_events')
    .select(
      'id, event_type, from_status, to_status, note, is_customer_visible, created_at, actor:profiles!request_events_actor_id_fkey(full_name)',
    )
    .eq('request_id', id)
    .order('created_at', { ascending: false })

  const events: RequestEvent[] = (eventRows ?? []).map((e) => {
    const ev = e as Record<string, unknown>
    return {
      id: String(ev.id),
      eventType: String(ev.event_type),
      fromStatus: (ev.from_status as RequestStatus) ?? null,
      toStatus: (ev.to_status as RequestStatus) ?? null,
      note: String(ev.note ?? ''),
      isCustomerVisible: Boolean(ev.is_customer_visible),
      createdAt: String(ev.created_at),
      actorName:
        (ev.actor as { full_name?: string } | null)?.full_name ?? null,
    }
  })

  const assigned = row.assigned_profile as { full_name?: string } | null

  return {
    id: String(row.id),
    requestNumber: String(row.request_number),
    status: row.status as RequestStatus,
    source: row.source as RequestSource,
    contactName: String(row.contact_name ?? ''),
    contactEmail: String(row.contact_email ?? ''),
    contactPhone: String(row.contact_phone ?? ''),
    farmName: String(row.farm_name ?? ''),
    serviceType: String(row.service_type ?? ''),
    crop: String(row.crop ?? ''),
    acres: row.acres === null ? null : num(row.acres),
    location: String(row.location ?? ''),
    createdAt: String(row.created_at),
    preferredDate: (row.preferred_date as string) ?? null,
    providesProduct: String(row.provides_product ?? 'unsure'),
    productDetails: String(row.product_details ?? ''),
    message: String(row.message ?? ''),
    internalNotes: String(row.internal_notes ?? ''),
    quoteAmount: row.quote_amount === null ? null : num(row.quote_amount),
    customerId: (row.customer_id as string) ?? null,
    assignedToId: (row.assigned_to as string) ?? null,
    assignedToName: assigned?.full_name ?? null,
    events,
  }
}
