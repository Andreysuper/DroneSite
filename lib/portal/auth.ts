/**
 * Portal auth bridge.
 *
 * Authentication is now handled by Supabase Auth (see `lib/auth/session.ts`).
 * The customer portal UI still renders from the in-memory demo data layer in
 * this phase, so this module overlays the real signed-in identity onto the demo
 * portal user. Later phases replace the demo data with per-customer DB reads.
 *
 * Keeping the original function signatures (`getCurrentUser`, `getSession`,
 * `destroySession`) means no portal page had to change when auth moved to
 * Supabase.
 */

import 'server-only'
import { getAuthProfile } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/server'
import { DEMO_USER } from './demo-data'
import type { PortalUser } from './types'

export type PortalSession = {
  userId: string
  organizationId: string
  expiresAt: number
}

/**
 * Returns a portal user for the signed-in account, or null. The identity
 * (name/email/phone) comes from the real Supabase profile; the demo data
 * overlay supplies the organizations and preferences the portal UI expects.
 */
export async function getCurrentUser(): Promise<PortalUser | null> {
  const profile = await getAuthProfile()
  if (!profile) return null

  return {
    ...DEMO_USER,
    name: profile.fullName || DEMO_USER.name,
    email: profile.email,
    phone: profile.phone || DEMO_USER.phone,
  }
}

export async function getSession(): Promise<PortalSession | null> {
  const profile = await getAuthProfile()
  if (!profile) return null
  return {
    userId: profile.id,
    organizationId: DEMO_USER.defaultOrganizationId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  }
}

export async function destroySession() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
