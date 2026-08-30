import { Settings } from 'lucide-react'
import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Settings | AgroSkyTech Admin' }

export default async function AdminSettingsPage() {
  await requireCapability('settings.manage')
  return (
    <SectionPlaceholder
      title="Settings"
      description="Company profile, service catalog, pricing, notification templates, and platform configuration."
      icon={Settings}
    />
  )
}
