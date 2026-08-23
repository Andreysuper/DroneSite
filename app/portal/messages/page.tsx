import type { Metadata } from 'next'
import { PageHeader } from '@/components/portal/page-header'
import { MessagesClient } from '@/components/portal/messages-client'
import { getMessageThreads } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Messages | Client Portal',
  description:
    'Talk directly with the AgroSkyTech operations team about scheduling, products and field access.',
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        subtitle="Direct line to the operations team — scheduling changes, product questions and field access notes."
      />
      <MessagesClient threads={getMessageThreads()} />
    </div>
  )
}
