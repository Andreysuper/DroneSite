import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/portal/auth'
import { getFields } from '@/lib/portal/demo-data'
import { PageHeader } from '@/components/portal/page-header'
import { BookingWizard } from '@/components/portal/booking-wizard'

export const metadata: Metadata = {
  title: 'Book a Service | AgroSkyTech Portal',
}

export default async function BookServicePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/')

  const fields = getFields(user.defaultOrganizationId)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Book a Service"
        subtitle="Request a drone application for one of your registered fields. Our operations team confirms scheduling based on weather and operator availability."
      />
      <BookingWizard fields={fields} />
    </div>
  )
}
