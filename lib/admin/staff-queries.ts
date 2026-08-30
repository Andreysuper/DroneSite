import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { ROLE_LABEL, type AppRole } from '@/lib/auth/roles'

export type StaffOption = {
  id: string
  name: string
  role: AppRole
  roleLabel: string
}

const STAFF_ROLES: AppRole[] = [
  'super_admin',
  'administrator',
  'operations_manager',
  'accounting',
  'operator',
]

/** Staff members a request can be assigned to. RLS lets staff read profiles. */
export async function listAssignableStaff(): Promise<StaffOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .in('role', STAFF_ROLES)
    .eq('is_active', true)
    .order('full_name')

  return (data ?? []).map((row) => {
    const r = row as Record<string, unknown>
    const role = r.role as AppRole
    return {
      id: String(r.id),
      name: String(r.full_name || r.email),
      role,
      roleLabel: ROLE_LABEL[role],
    }
  })
}
