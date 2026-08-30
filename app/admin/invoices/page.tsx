import { requireCapability } from '@/lib/auth/session'
import { SectionPlaceholder } from '@/components/admin/section-placeholder'

export const metadata = { title: 'Invoices | AgroSkyTech Admin' }

export default async function AdminInvoicesPage() {
  await requireCapability('invoices.view')
  return (
    <SectionPlaceholder
      title="Invoices"
      description="Billing generated from completed jobs. Track outstanding balances, record payments, and export financial reports."
      phase="Phase 3"
    />
  )
}
