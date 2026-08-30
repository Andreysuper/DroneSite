import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Staff & Roles | AgroSkyTech Admin' }

export default async function AdminStaffPage() {
  await requireCapability('staff.manage')
  return (
    <SectionPlaceholder
      title="Staff & Roles"
      description="Invite team members, assign roles, and manage permissions across the platform. The primary Super Admin is protected from downgrade."
      phase="Phase 4"
    />
  )
}
