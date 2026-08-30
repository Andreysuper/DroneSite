import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Fleet | AgroSkyTech Admin' }

export default async function AdminFleetPage() {
  await requireCapability('fleet.view')
  return (
    <SectionPlaceholder
      title="Fleet"
      description="Drone aircraft, equipment, maintenance schedules, and operator certifications. Monitor availability against the job calendar."
      phase="Phase 3"
    />
  )
}
