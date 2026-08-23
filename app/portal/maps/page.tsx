import type { Metadata } from 'next'
import { PageHeader } from '@/components/portal/page-header'
import { MapsGallery } from '@/components/portal/maps-gallery'
import { getFieldMaps, getFields } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Maps & Reports | Client Portal',
  description:
    'Browse NDVI, crop health, spray coverage and prescription maps captured across your fields.',
}

export default async function MapsPage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string }>
}) {
  const { field } = await searchParams
  const maps = getFieldMaps()
  const fields = getFields()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Maps & Reports"
        subtitle="Every survey layer we have captured for your operation — switch between true colour, NDVI, crop health and as-applied coverage."
      />
      <MapsGallery maps={maps} fields={fields} initialFieldId={field} />
    </div>
  )
}
