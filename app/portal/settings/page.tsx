import type { Metadata } from 'next'
import { PageHeader } from '@/components/portal/page-header'
import { SettingsClient } from '@/components/portal/settings-client'
import { DEMO_USER, getOrganizations } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Account Settings | Client Portal',
  description:
    'Manage your profile, notification preferences, organizations, security and payment method.',
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Account Settings"
        subtitle="Your contact details, what we notify you about, and how invoices get paid."
      />
      <SettingsClient user={DEMO_USER} organizations={getOrganizations()} />
    </div>
  )
}
