import { NextResponse } from 'next/server'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { createSession, verifyCredentials } from '@/lib/portal/auth'

export async function POST(request: Request) {
  // Throttle credential stuffing attempts.
  const limit = rateLimit(`login:${getClientIp(request)}`)
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many attempts. Please try again in ${limit.retryAfterSeconds}s.`,
      },
      { status: 429 },
    )
  }

  let email = ''
  let password = ''
  let remember = false

  try {
    const body = (await request.json()) as Record<string, unknown>
    email = String(body.email ?? '')
    password = String(body.password ?? '')
    remember = Boolean(body.remember)
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Please enter your email and password.' },
      { status: 400 },
    )
  }

  const user = verifyCredentials(email, password)
  if (!user) {
    // Deliberately generic so we do not reveal which field was wrong.
    return NextResponse.json(
      { error: 'Incorrect email or password.' },
      { status: 401 },
    )
  }

  await createSession(user, remember)
  return NextResponse.json({ success: true, redirectTo: '/portal' })
}
