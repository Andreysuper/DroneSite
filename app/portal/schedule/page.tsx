import type { Metadata } from 'next'
import { PageHeader } from '@/components/portal/page-header'
import { ScheduleCalendar } from '@/components/portal/schedule-calendar'
import { getFields, getServiceOrders } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Schedule | Client Portal',
  description:
    'See every booked, in-progress and completed drone application across your fields on one calendar.',
}

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Schedule"
        subtitle="Every application across your operation on one calendar. Select a highlighted day to see the flights booked for it."
      />
      <ScheduleCalendar services={getServiceOrders()} fields={getFields()} />
    </div>
  )
}
