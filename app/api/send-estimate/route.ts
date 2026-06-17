import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { buildEmailHtml } from '@/lib/email-template'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

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

  try {
    await sendMail({
      subject: 'New Free Estimate Request - AgroSkyTech',
      html,
      replyTo: data.email,
    })
  } catch (err) {
    console.error('[v0] Estimate email failed:', err)
    return NextResponse.json(
      { error: 'Unable to send request. Please try again later.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ success: true })
}
