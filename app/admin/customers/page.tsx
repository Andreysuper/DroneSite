import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Customers | AgroSkyTech Admin' }

export default async function AdminCustomersPage() {
  await requireCapability('customers.view')
  return (
    <SectionPlaceholder
      title="Customers"
      description="Farm and grower accounts, their fields, contacts, and portal access. Link new signups to existing customer records."
      phase="Phase 2"
    />
  )
}
