import { NextResponse } from 'next/server'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { type AppRole, landingPathForRole } from '@/lib/auth/roles'

/**
 * Authenticates against Supabase Auth on the server so we can:
 *  - apply our own per-IP rate limit on top of Supabase's IP limits,
 *  - keep the raw auth error on the server (log it, return a generic message),
 *  - resolve the user's role and return a role-aware redirect target.
 */
export async function POST(request: Request) {
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

  try {
    const body = (await request.json()) as Record<string, unknown>
    email = String(body.email ?? '').trim()
    password = String(body.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Please enter your email and password.' },
      { status: 400 },
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    // Pass through the actionable "email not confirmed" signal; otherwise stay
    // generic so we do not confirm which accounts exist.
    if (error?.code === 'email_not_confirmed') {
      return NextResponse.json(
        {
          error:
            'Please confirm your email address before signing in. Check your inbox for the confirmation link.',
        },
        { status: 403 },
      )
    }
    console.log('[v0] login failed:', error?.code ?? 'no_user', error?.message)
    return NextResponse.json(
      { error: 'Incorrect email or password.' },
      { status: 401 },
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', data.user.id)
    .single()

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: 'This account is not active. Please contact AgroSkyTech.' },
      { status: 403 },
    )
  }

  return NextResponse.json({
    success: true,
    redirectTo: landingPathForRole(profile.role as AppRole),
  })
}
