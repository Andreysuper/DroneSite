import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/portal/auth'
import { getAuthProfile } from '@/lib/auth/session'
import { getOrganization } from '@/lib/portal/demo-data'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mailer'
import { buildEmailHtml } from '@/lib/email-template'
import { captureServiceRequest } from '@/lib/requests/capture'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  const profile = await getAuthProfile()
  if (!user || !profile) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const limit = rateLimit(`service-request:${getClientIp(request)}`)
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${limit.retryAfterSeconds}s.`,
      },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const str = (key: string) =>
    typeof body[key] === 'string' ? (body[key] as string).trim() : ''

  const kind = str('kind')
  const fieldName = str('fieldName')
  const preferredDate = str('preferredDate')
  const product = str('product')

  if (!kind || !fieldName || !preferredDate || !product) {
    return NextResponse.json(
      { error: 'Missing required request details.' },
      { status: 400 },
    )
  }

  const org = getOrganization(user.defaultOrganizationId)

  // Link to the customer record this signed-in user owns, if any. RLS ensures
  // they can only ever see their own customer row here.
  const supabase = await createClient()
  const { data: ownedCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('profile_id', profile.id)
    .maybeSingle()

  const acresNum =
    typeof body.acres === 'number'
      ? body.acres
      : Number.parseFloat(str('acres')) || null

  // --- Persist FIRST (spec: every request must be stored) ---
  let reference = ''
  try {
    const captured = await captureServiceRequest({
      source: 'customer_portal',
      submittedBy: profile.id,
      customerId: ownedCustomer?.id ?? null,
      contactName: user.name,
      contactEmail: user.email,
      contactPhone: user.phone ?? '',
      farmName: org?.name ?? '',
      serviceType: kind,
      location: str('fieldAddress'),
      acres: acresNum,
      preferredDate: preferredDate || null,
      providesProduct: str('suppliedBy').toLowerCase().includes('client')
        ? 'yes'
        : 'unsure',
      productDetails: product,
      message: [
        `Field: ${fieldName}`,
        str('alternateDate') && `Alternate date: ${str('alternateDate')}`,
        str('timeWindow') && `Time window: ${str('timeWindow')}`,
        str('urgency') && `Urgency: ${str('urgency')}`,
        str('rate') && `Application rate: ${str('rate')}`,
        str('suppliedBy') && `Supplied by: ${str('suppliedBy')}`,
        str('notes') && `Notes: ${str('notes')}`,
        typeof body.estimate === 'number' &&
          `System estimate: $${(body.estimate as number).toFixed(2)} CAD`,
      ]
        .filter(Boolean)
        .join('\n'),
    })
    reference = captured.requestNumber
  } catch (error) {
    console.log('[v0] Portal service request capture failed:', error)
    return NextResponse.json(
      { error: 'Unable to submit request. Please try again later.' },
      { status: 500 },
    )
  }

  try {
    const html = buildEmailHtml({
      heading: 'New Portal Service Request',
      intro: `${user.name} submitted a service request through the client portal.`,
      sections: [
        {
          title: 'Client',
          rows: [
            { label: 'Name', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Organization', value: org?.name ?? '—' },
          ],
        },
        {
          title: 'Request details',
          rows: [
            { label: 'Reference', value: reference },
            { label: 'Service', value: kind },
            { label: 'Field', value: fieldName },
            { label: 'Field address', value: str('fieldAddress') || '—' },
            { label: 'Acres', value: body.acres ?? '—' },
            { label: 'Preferred date', value: preferredDate },
            {
              label: 'Alternate date',
              value: str('alternateDate') || 'Not provided',
            },
            { label: 'Time window', value: str('timeWindow') || '—' },
            { label: 'Urgency', value: str('urgency') || '—' },
          ],
        },
        {
          title: 'Product & notes',
          rows: [
            { label: 'Product', value: product },
            {
              label: 'Application rate',
              value: str('rate') || 'Operator recommendation',
            },
            { label: 'Supplied by', value: str('suppliedBy') || '—' },
            { label: 'Notes', value: str('notes') || 'None' },
            {
              label: 'System estimate',
              value:
                typeof body.estimate === 'number'
                  ? `$${(body.estimate as number).toFixed(2)} CAD`
                  : '—',
            },
          ],
        },
      ],
    })

    await sendMail({
      subject: `Portal Service Request ${reference} - ${kind}`,
      html,
      replyTo: user.email,
    })
  } catch (error) {
    console.log('[v0] Portal service request email failed:', error)
    // The client still receives their reference; ops is notified via the portal.
  }

  return NextResponse.json({ success: true, reference })
}
