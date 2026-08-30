import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { buildEmailHtml } from '@/lib/email-template'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { captureServiceRequest } from '@/lib/requests/capture'

export const runtime = 'nodejs'

type EstimatePayload = {
  name?: string
  phone?: string
  email?: string
  service?: string
  fieldSize?: string
  location?: string
  date?: string
  message?: string
}

export async function POST(req: Request) {
  // --- Rate limiting (spam protection) ---
  const ip = getClientIp(req)
  const { allowed, retryAfterSeconds } = rateLimit(`estimate:${ip}`)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  let data: EstimatePayload
  try {
    data = (await req.json()) as EstimatePayload
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // --- Server-side validation of required fields ---
  const missing: string[] = []
  if (!data.name?.trim()) missing.push('name')
  if (!data.phone?.trim()) missing.push('phone')
  if (!data.email?.trim()) missing.push('email')
  if (!data.location?.trim()) missing.push('location')

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')
  if (data.email && !emailOk) missing.push('valid email')

  if (missing.length) {
    return NextResponse.json(
      { error: `Please provide: ${missing.join(', ')}.` },
      { status: 400 },
    )
  }

  // --- Persist FIRST (spec: every request must be stored) ---
  const acresParsed = Number.parseFloat((data.fieldSize ?? '').replace(/[^0-9.]/g, ''))
  let requestNumber = ''
  try {
    const captured = await captureServiceRequest({
      source: 'website',
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      serviceType: data.service,
      acres: Number.isFinite(acresParsed) ? acresParsed : null,
      location: data.location,
      preferredDate: data.date || null,
      message: [
        data.fieldSize && `Field size: ${data.fieldSize}`,
        data.message,
      ]
        .filter(Boolean)
        .join('\n'),
    })
    requestNumber = captured.requestNumber
  } catch (err) {
    console.error('[v0] Estimate capture failed:', err)
    return NextResponse.json(
      { error: 'Unable to submit request. Please try again later.' },
      { status: 500 },
    )
  }

  const html = buildEmailHtml({
    heading: 'New Free Estimate Request',
    intro: `A new estimate request was submitted by ${data.name}.`,
    sections: [
      {
        title: 'Customer Information',
        rows: [
          { label: 'Name', value: data.name },
          { label: 'Phone', value: data.phone },
          { label: 'Email', value: data.email },
        ],
      },
      {
        title: 'Service Details',
        rows: [
          { label: 'Service Needed', value: data.service },
          { label: 'Field Size', value: data.fieldSize },
          { label: 'Location', value: data.location },
          { label: 'Preferred Date', value: data.date },
        ],
      },
      {
        title: 'Message',
        rows: [{ label: 'Message', value: data.message }],
      },
    ],
  })

  // Email is best-effort — the request is already stored.
  try {
    await sendMail({
      subject: `New Free Estimate Request (${requestNumber}) - AgroSkyTech`,
      html,
      replyTo: data.email,
    })
  } catch (err) {
    console.error('[v0] Estimate email failed (request still stored):', err)
  }

  return NextResponse.json({ success: true, requestNumber })
}
