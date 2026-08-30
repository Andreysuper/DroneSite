import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client. BYPASSES Row Level Security, so it must only
 * ever be used in trusted server code (route handlers, server actions) and its
 * inputs must be validated first. Never import this into client components.
 *
 * Used for:
 *  - capturing anonymous website service requests (no auth.uid())
 *  - admin operations that need to read across all tenants
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Supabase service role credentials are not configured.')
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
