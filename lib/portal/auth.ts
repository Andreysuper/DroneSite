/**
 * Server-only authentication for the AgroSkyTech client portal.
 *
 * This is a DEVELOPMENT/DEMO auth layer. It is deliberately isolated behind a
 * small interface (`verifyCredentials`, `createSession`, `getSession`,
 * `destroySession`) so it can be replaced by Supabase Auth, Clerk or Auth.js
 * without touching any UI component.
 *
 * Security notes:
 *  - This module is never imported by a client component; credentials stay on
 *    the server.
 *  - The session is an HMAC-signed, httpOnly, sameSite cookie. It carries only
 *    a user id, never a password.
 *  - Demo credentials are read from environment variables when present.
 *  - Replace `verifyCredentials` with a provider call and the rest still works.
 */

import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { DEMO_USER } from './demo-data'
import type { PortalUser } from './types'

const COOKIE_NAME = 'ast_portal_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours
const REMEMBER_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

/**
 * Demo account. Configure via env in any shared environment; the fallbacks
 * exist only so the preview works out of the box and are never sent to the
 * browser.
 */
const DEMO_EMAIL = process.env.DEMO_CLIENT_EMAIL ?? 'andreyoper@gmail.com'
const DEMO_PASSWORD = process.env.DEMO_CLIENT_PASSWORD ?? 'adminQ123'

function secret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.SMTP_PASSWORD ??
    'agroskytech-development-only-secret'
  )
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/**
 * Validates submitted credentials.
 * Swap the body of this function for a provider call (e.g.
 * `supabase.auth.signInWithPassword`) to move to production auth.
 */
export function verifyCredentials(
  email: string,
  password: string,
): PortalUser | null {
  const emailOk = safeEqual(
    email.trim().toLowerCase(),
    DEMO_EMAIL.toLowerCase(),
  )
  const passwordOk = safeEqual(password, DEMO_PASSWORD)
  if (!emailOk || !passwordOk) return null
  return DEMO_USER
}

type SessionPayload = {
  userId: string
  organizationId: string
  expiresAt: number
}

export async function createSession(user: PortalUser, remember = false) {
  const payload: SessionPayload = {
    userId: user.id,
    organizationId: user.defaultOrganizationId,
    expiresAt: Date.now() + (remember ? REMEMBER_TTL_MS : SESSION_TTL_MS),
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const token = `${encoded}.${sign(encoded)}`

  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor((payload.expiresAt - Date.now()) / 1000),
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return null

  const [encoded, signature] = raw.split('.')
  if (!encoded || !signature) return null
  if (!safeEqual(signature, sign(encoded))) return null

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as SessionPayload
    if (payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Returns the signed-in user, or null. In production this would also confirm
 * the user still belongs to the requested organization before returning data.
 */
export async function getCurrentUser(): Promise<PortalUser | null> {
  const session = await getSession()
  if (!session) return null
  if (session.userId !== DEMO_USER.id) return null
  return DEMO_USER
}

export async function destroySession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
