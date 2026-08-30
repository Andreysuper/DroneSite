import { NextResponse } from 'next/server'
import { sendMail, type MailAttachment } from '@/lib/mailer'
import { buildEmailHtml } from '@/lib/email-template'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { captureServiceRequest, type ProvidesProduct } from '@/lib/requests/capture'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB per file
const MAX_TOTAL_BYTES = 20 * 1024 * 1024 // 20 MB total

export async function POST(req: Request) {
  // --- Rate limiting (spam protection) ---
  const ip = getClientIp(req)
  const { allowed, retryAfterSeconds } = rateLimit(`booking:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const get = (key: string) => {
    const v = form.get(key)
    return typeof v === 'string' ? v : ''
  }
  const getAll = (key: string) =>
    form.getAll(key).filter((v): v is string => typeof v === 'string')

  const name = get('name')
  const phone = get('phone')
  const fieldSize = get('fieldSize')
  const city = get('city')

  // --- Server-side validation of required fields ---
  const missing: string[] = []
  if (!name.trim()) missing.push('name')
  if (!phone.trim()) missing.push('phone')
  if (!fieldSize.trim()) missing.push('field size')
  if (!city.trim()) missing.push('location/city')
  if (missing.length) {
    return NextResponse.json(
      { error: `Please provide: ${missing.join(', ')}.` },
      { status: 400 },
    )
  }

  const email = get('email')

  // --- Collect file attachments (within size limits) ---
  const attachments: MailAttachment[] = []
  let totalBytes = 0
  for (const file of form.getAll('files')) {
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) continue
      totalBytes += file.size
      if (totalBytes > MAX_TOTAL_BYTES) break
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || undefined,
      })
    }
  }

  const provideProductLabel =
    {
      yes: 'Customer will provide the product',
      advise: 'Needs AgroSkyTech to advise',
      unsure: 'Not sure yet',
    }[get('provideProduct')] || get('provideProduct')

  // --- Persist the request FIRST (spec: every request must be stored) ---
  // Storage is the source of truth; email is a best-effort notification.
  const providesProduct: ProvidesProduct =
    get('provideProduct') === 'yes' ? 'yes' : 'unsure'
  const acresParsed = Number.parseFloat(fieldSize.replace(/[^0-9.]/g, ''))

  let requestNumber = ''
  try {
    const messageParts = [
      get('serviceType') && `Service needed: ${get('serviceType')}`,
      getAll('treatmentTargets').length &&
        `Treatment targets: ${getAll('treatmentTargets').join(', ')}`,
      get('urgency') && `Urgency: ${get('urgency')}`,
      getAll('conditions').length &&
        `Field conditions: ${getAll('conditions').join(', ')}`,
      get('accessNotes') && `Access notes: ${get('accessNotes')}`,
      getAll('productTypes').length &&
        `Product types needed: ${getAll('productTypes').join(', ')}`,
      get('additionalInfo') && `Notes: ${get('additionalInfo')}`,
      attachments.length &&
        `Attachments emailed: ${attachments.map((a) => a.filename).join(', ')}`,
    ].filter(Boolean)

    const captured = await captureServiceRequest({
      source: 'website',
      contactName: name,
      contactEmail: email,
      contactPhone: phone,
      farmName: get('company'),
      serviceType: get('serviceType'),
      crop: get('surfaceType'),
      acres: Number.isFinite(acresParsed) ? acresParsed : null,
      location: [city, get('address')].filter(Boolean).join(' — '),
      preferredDate: get('date') || null,
      providesProduct,
      productDetails: getAll('productTypes').join(', '),
      message: messageParts.join('\n'),
    })
    requestNumber = captured.requestNumber
  } catch (err) {
    console.error('[v0] Booking capture failed:', err)
    return NextResponse.json(
      { error: 'Unable to submit request. Please try again later.' },
      { status: 500 },
    )
  }

  const html = buildEmailHtml({
    heading: 'New Drone Service Booking Request',
    intro: `A detailed booking request was submitted by ${name}.`,
    sections: [
      {
        title: 'Customer Information',
        rows: [
          { label: 'Name', value: name },
          { label: 'Company / Farm', value: get('company') },
          { label: 'Phone', value: phone },
          { label: 'Email', value: email },
        ],
      },
      {
        title: 'Service Details',
        rows: [
          { label: 'Service Needed', value: get('serviceType') },
          { label: 'Treatment Targets', value: getAll('treatmentTargets') },
          { label: 'Urgency', value: get('urgency') },
          { label: 'Preferred Service Date', value: get('date') },
        ],
      },
      {
        title: 'Field Information',
        rows: [
          { label: 'Crop / Surface Type', value: get('surfaceType') },
          { label: 'Field Size (acres)', value: fieldSize },
          { label: 'Location / City', value: city },
          { label: 'Exact Address / GPS', value: get('address') },
          { label: 'Access Notes', value: get('accessNotes') },
        ],
      },
      {
        title: 'Product Information',
        rows: [
          { label: 'Provides Product?', value: provideProductLabel },
          { label: 'Product Types Needed', value: getAll('productTypes') },
        ],
      },
      {
        title: 'Conditions',
        rows: [{ label: 'Field Conditions', value: getAll('conditions') }],
      },
      {
        title: 'Additional Notes',
        rows: [
          { label: 'Additional Information', value: get('additionalInfo') },
          {
            label: 'Attachments',
            value: attachments.length
              ? attachments.map((a) => a.filename).join(', ')
              : 'None',
          },
        ],
      },
    ],
  })

  // Email is best-effort: the request is already safely stored, so a mail
  // failure should not lose the lead or fail the customer's submission.
  try {
    await sendMail({
      subject: `New Drone Service Booking Request (${requestNumber}) - AgroSkyTech`,
      html,
      replyTo: email || undefined,
      attachments,
    })
  } catch (err) {
    console.error('[v0] Booking email failed (request still stored):', err)
  }

  return NextResponse.json({ success: true, requestNumber })
}
