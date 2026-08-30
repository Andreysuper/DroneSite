import type { Metadata } from 'next'
import { requireCapability } from '@/lib/auth/session'
import { getRequests } from '@/lib/admin/queries'
import {
  REQUEST_STATUS_LABEL,
  type RequestStatus,
} from '@/lib/admin/request-status'
import { RequestsTable } from '@/components/admin/requests-table'
import { RequestsFilter } from '@/components/admin/requests-filter'

export const metadata: Metadata = { title: 'Service Requests' }

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireCapability('requests.view')
  const { status } = await searchParams

  const validStatuses = Object.keys(REQUEST_STATUS_LABEL) as RequestStatus[]
  const activeStatus =
    status && validStatuses.includes(status as RequestStatus)
      ? (status as RequestStatus)
      : status === 'all'
        ? 'all'
        : 'open'

  const requests =
    activeStatus === 'open'
      ? await getRequests({ openOnly: true })
      : await getRequests({ status: activeStatus })

  const openCount = (await getRequests({ openOnly: true })).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl text-foreground">Service Requests</h1>
        <p className="text-sm text-muted-foreground">
          Every request from the website and the client portal lands here. Review,
          qualify, quote, and schedule.
        </p>
      </div>

      <RequestsFilter active={activeStatus} openCount={openCount} />

      <RequestsTable rows={requests} />
    </div>
  )
}
