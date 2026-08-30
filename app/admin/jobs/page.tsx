import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Jobs | AgroSkyTech Admin' }

export default async function AdminJobsPage() {
  await requireCapability('jobs.view')
  return (
    <SectionPlaceholder
      title="Jobs"
      description="Scheduled field operations converted from approved requests. Assign operators, track live status, and close out completed work."
      phase="Phase 2"
    />
  )
}
