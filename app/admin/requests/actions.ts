'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireStaff } from '@/lib/auth/session'
import {
  REQUEST_NEXT_STATUSES,
  REQUEST_STATUS_LABEL,
  type RequestStatus,
} from '@/lib/admin/request-status'

export type ActionResult = { ok: boolean; error?: string }

/**
 * Move a request to a new status. The transition must be one the current
 * status allows, and RLS guarantees only staff can update the row. Every
 * change is written to the request_events timeline.
 */
export async function updateRequestStatus(
  requestId: string,
  toStatus: RequestStatus,
  note: string,
  customerVisible: boolean,
): Promise<ActionResult> {
  const profile = await requireStaff()
  const supabase = await createClient()

  const { data: current, error: readErr } = await supabase
    .from('service_requests')
    .select('status')
    .eq('id', requestId)
    .maybeSingle()

  if (readErr || !current) {
    return { ok: false, error: 'Request not found.' }
  }

  const from = current.status as RequestStatus
  const allowed = REQUEST_NEXT_STATUSES[from] ?? []
  if (!allowed.includes(toStatus)) {
    return {
      ok: false,
      error: `Cannot move a ${REQUEST_STATUS_LABEL[from]} request to ${REQUEST_STATUS_LABEL[toStatus]}.`,
    }
  }

  const { error: updErr } = await supabase
    .from('service_requests')
    .update({ status: toStatus })
    .eq('id', requestId)

  if (updErr) return { ok: false, error: updErr.message }

  await supabase.from('request_events').insert({
    request_id: requestId,
    actor_id: profile.id,
    event_type: 'status_change',
    from_status: from,
    to_status: toStatus,
    note: note.trim(),
    is_customer_visible: customerVisible,
  })

  revalidatePath('/admin/requests')
  revalidatePath(`/admin/requests/${requestId}`)
  revalidatePath('/admin')
  return { ok: true }
}

/** Assign (or unassign) the request to a staff member. */
export async function assignRequest(
  requestId: string,
  assigneeId: string | null,
): Promise<ActionResult> {
  const profile = await requireStaff()
  const supabase = await createClient()

  const { error } = await supabase
    .from('service_requests')
    .update({ assigned_to: assigneeId })
    .eq('id', requestId)

  if (error) return { ok: false, error: error.message }

  await supabase.from('request_events').insert({
    request_id: requestId,
    actor_id: profile.id,
    event_type: 'assignment',
    note: assigneeId ? 'Request assigned.' : 'Request unassigned.',
    is_customer_visible: false,
  })

  revalidatePath(`/admin/requests/${requestId}`)
  revalidatePath('/admin/requests')
  return { ok: true }
}

/** Save an internal (staff-only) note, and optionally a quote amount. */
export async function saveRequestNotes(
  requestId: string,
  internalNotes: string,
  quoteAmount: number | null,
): Promise<ActionResult> {
  await requireStaff()
  const supabase = await createClient()

  const patch: Record<string, unknown> = { internal_notes: internalNotes }
  if (quoteAmount !== null && Number.isFinite(quoteAmount)) {
    patch.quote_amount = quoteAmount
  }

  const { error } = await supabase
    .from('service_requests')
    .update(patch)
    .eq('id', requestId)

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/admin/requests/${requestId}`)
  return { ok: true }
}

/** Add a timeline note without changing status (e.g. a customer message). */
export async function addRequestNote(
  requestId: string,
  note: string,
  customerVisible: boolean,
): Promise<ActionResult> {
  const profile = await requireStaff()
  if (!note.trim()) return { ok: false, error: 'Note cannot be empty.' }
  const supabase = await createClient()

  const { error } = await supabase.from('request_events').insert({
    request_id: requestId,
    actor_id: profile.id,
    event_type: 'note',
    note: note.trim(),
    is_customer_visible: customerVisible,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath(`/admin/requests/${requestId}`)
  return { ok: true }
}
