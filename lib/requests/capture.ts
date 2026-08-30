import 'server-only'

import { createServiceClient } from '@/lib/supabase/admin'

export type ProvidesProduct = 'yes' | 'no' | 'unsure'
export type RequestSource = 'website' | 'customer_portal' | 'admin'

export type CaptureRequestInput = {
  source: RequestSource
  // contact snapshot — always captured even without an account
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  farmName?: string
  // request detail
  serviceType?: string
  crop?: string
  acres?: number | null
  location?: string
  preferredDate?: string | null
  providesProduct?: ProvidesProduct
  productDetails?: string
  message?: string
  // linkage (portal submissions)
  submittedBy?: string | null
  customerId?: string | null
  fieldId?: string | null
}

export type CaptureResult = {
  id: string
  requestNumber: string
}

/**
 * Persist a service request and log its creation event.
 *
 * Website submissions are anonymous, so this uses the service-role client to
 * bypass RLS. Callers are responsible for validating/sanitizing input and for
 * their own rate limiting BEFORE calling this.
 */
export async function captureServiceRequest(
  input: CaptureRequestInput,
): Promise<CaptureResult> {
  const supabase = createServiceClient()

  const row = {
    source: input.source,
    submitted_by: input.submittedBy ?? null,
    customer_id: input.customerId ?? null,
    field_id: input.fieldId ?? null,
    contact_name: (input.contactName ?? '').trim(),
    contact_email: (input.contactEmail ?? '').trim().toLowerCase(),
    contact_phone: (input.contactPhone ?? '').trim(),
    farm_name: (input.farmName ?? '').trim(),
    service_type: (input.serviceType ?? '').trim(),
    crop: (input.crop ?? '').trim(),
    acres: input.acres ?? null,
    location: (input.location ?? '').trim(),
    preferred_date: input.preferredDate || null,
    provides_product: input.providesProduct ?? 'unsure',
    product_details: (input.productDetails ?? '').trim(),
    message: (input.message ?? '').trim(),
  }

  const { data, error } = await supabase
    .from('service_requests')
    .insert(row)
    .select('id, request_number')
    .single()

  if (error || !data) {
    throw new Error(`Failed to store service request: ${error?.message ?? 'unknown error'}`)
  }

  // Log the intake event onto the request timeline.
  await supabase.from('request_events').insert({
    request_id: data.id,
    actor_id: input.submittedBy ?? null,
    event_type: 'created',
    to_status: 'new',
    note: `Request received via ${labelForSource(input.source)}.`,
    is_customer_visible: true,
  })

  return { id: data.id, requestNumber: data.request_number }
}

function labelForSource(source: RequestSource): string {
  switch (source) {
    case 'website':
      return 'the public website'
    case 'customer_portal':
      return 'the customer portal'
    case 'admin':
      return 'the admin console'
  }
}
