import type { Metadata } from 'next'
import { PageHeader } from '@/components/portal/page-header'
import { DocumentsBrowser } from '@/components/portal/documents-browser'
import { getDocuments, getFields } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Documents | Client Portal',
  description:
    'Your archive of invoices, service reports, application records, product labels and field data exports.',
}

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Documents"
        subtitle="Every record we hold for your operation — invoices, completion reports, application records and raw field data."
      />
      <DocumentsBrowser documents={getDocuments()} fields={getFields()} />
    </div>
  )
}
