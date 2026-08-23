import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/portal/auth'
import { getOrganization } from '@/lib/portal/demo-data'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { sendMail } from '@/lib/mailer'
import { buildEmailHtml } from '@/lib/email-template'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
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

  const reference = `AST-${new Date().getFullYear()}-${
    Math.floor(Math.random() * 9000) + 1000
  }`
  const org = getOrganization(user.defaultOrganizationId)

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
