/**
 * Server-only authentication context for the AgroSkyTech platform.
 *
 * Backed by Supabase Auth. Every helper reads the verified session from the
 * request cookies via `@/lib/supabase/server` and joins the `profiles` row to
 * obtain the RBAC role. Never trust a role from the client — it always comes
 * from the database here.
 */

import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  type AppRole,
  type Capability,
  can,
  hasAdminAccess,
  isAdmin,
  isStaff,
  landingPathForRole,
} from './roles'

export type AuthProfile = {
  id: string
  email: string
  fullName: string
  phone: string
  role: AppRole
  isActive: boolean
}

/**
 * Returns the signed-in user's profile, or null when unauthenticated.
 * Uses getUser() (not getSession) so the token is verified with Supabase.
 */
export async function getAuthProfile(): Promise<AuthProfile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    phone: profile.phone,
    role: profile.role as AppRole,
    isActive: profile.is_active,
  }
}

/** Require any authenticated user; redirect to login otherwise. */
export async function requireAuth(): Promise<AuthProfile> {
  const profile = await getAuthProfile()
  if (!profile) redirect('/login')
  if (!profile.isActive) redirect('/login?error=account_disabled')
  return profile
}

/** Require staff (non-customer). Customers are bounced to their portal. */
export async function requireStaff(): Promise<AuthProfile> {
  const profile = await requireAuth()
  if (!isStaff(profile.role)) redirect('/portal')
  return profile
}

/** Require admin-panel access (excludes operators and customers). */
export async function requireAdminAccess(): Promise<AuthProfile> {
  const profile = await requireAuth()
  if (!hasAdminAccess(profile.role)) {
    redirect(landingPathForRole(profile.role))
  }
  return profile
}

/** Require top-level admin authority (super admin / administrator). */
export async function requireAdmin(): Promise<AuthProfile> {
  const profile = await requireAuth()
  if (!isAdmin(profile.role)) {
    redirect(landingPathForRole(profile.role))
  }
  return profile
}

/** Require a specific capability; redirect to the role's landing page if absent. */
export async function requireCapability(
  capability: Capability,
): Promise<AuthProfile> {
  const profile = await requireAuth()
  if (!can(profile.role, capability)) {
    redirect(landingPathForRole(profile.role))
  }
  return profile
}
