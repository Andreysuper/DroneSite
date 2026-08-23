import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CalendarPlus, MapPin } from 'lucide-react'
import { getCurrentUser } from '@/lib/portal/auth'
import {
  CURRENCY,
  formatShortDate,
  getField,
  getFieldMaps,
  getServiceOrders,
} from '@/lib/portal/demo-data'
import { FieldMapView } from '@/components/portal/field-map'
import { PageHeader } from '@/components/portal/page-header'
import { StatusBadge } from '@/components/portal/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata: Metadata = {
  title: 'Field Details | AgroSkyTech Portal',
}

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/')

  const { id } = await params
  const field = getField(id)
  if (!field || field.organizationId !== user.defaultOrganizationId) notFound()

  const orders = getServiceOrders(field.organizationId)
    .filter((o) => o.fieldId === field.id)
    .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
  const maps = getFieldMaps(field.organizationId).filter(
    (m) => m.fieldId === field.id,
  )
  const totalSpend = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/portal/fields"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All fields
      </Link>

      <PageHeader
        title={field.name}
        subtitle={`${field.acres} acres · ${field.cropType} · ${field.farm}`}
        action={
          <Button nativeButton={false} render={<Link href="/portal/book" />}>
            <CalendarPlus className="size-4" aria-hidden />
            Book service
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map + info */}
        <Card className="overflow-hidden border-border/60 p-0 lg:col-span-2">
          <div className="relative aspect-[16/9] bg-muted">
            <FieldMapView
              variant={field.mapImage}
              seed={field.id}
              showDecorations
            />
          </div>
          <dl className="grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </dt>
              <dd className="flex items-start gap-1.5 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden />
                {field.address}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Coordinates
              </dt>
              <dd className="font-mono text-sm">
                {field.coordinates.lat.toFixed(4)},{' '}
                {field.coordinates.lng.toFixed(4)}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Crop
              </dt>
              <dd className="text-sm">{field.cropType}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last serviced
              </dt>
              <dd className="text-sm">
                {field.lastServiceDate
                  ? formatShortDate(field.lastServiceDate)
                  : 'No service history'}
              </dd>
            </div>
            {field.notes && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Field notes
                </dt>
                <dd className="text-pretty text-sm leading-relaxed text-muted-foreground">
                  {field.notes}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Stats */}
        <div className="flex flex-col gap-4">
          <Card className="border-border/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total services
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {orders.length}
            </p>
          </Card>
          <Card className="border-border/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Completed spend
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {CURRENCY.format(totalSpend)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all completed applications
            </p>
          </Card>
          <Card className="border-border/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Maps &amp; reports
            </p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {maps.length}
            </p>
            {maps.length > 0 && (
              <Link
                href="/portal/maps"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest transition-colors hover:text-gold"
              >
                View all
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            )}
          </Card>
        </div>
      </div>

      {/* Service history */}
      <Card className="border-border/60 p-0">
        <h2 className="border-b border-border/60 px-6 py-4 text-lg font-semibold tracking-tight">
          Service history
        </h2>
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No services recorded for this field yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="sr-only">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">
                      {o.reference}
                    </TableCell>
                    <TableCell className="font-medium">{o.kind}</TableCell>
                    <TableCell>{formatShortDate(o.scheduledDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {CURRENCY.format(o.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/portal/services/${o.id}`}
                        className="text-sm font-semibold text-forest transition-colors hover:text-gold"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Maps for this field */}
      {maps.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Maps for this field
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {maps.map((m) => (
              <li key={m.id}>
                <Card className="overflow-hidden border-border/60 p-0">
                  <div className="relative aspect-[16/10] bg-muted">
                    <FieldMapView variant={m.image} seed={m.id} />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <p className="font-semibold">{m.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Captured {formatShortDate(m.capturedDate)} · {m.resolution}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
