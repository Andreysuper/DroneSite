import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CloudRain,
  Download,
  MessageSquare,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/portal/auth'
import {
  CURRENCY,
  formatDate,
  getField,
  getServiceOrder,
} from '@/lib/portal/demo-data'
import { PageHeader } from '@/components/portal/page-header'
import { StatusBadge } from '@/components/portal/status-badge'
import { ServiceTracker } from '@/components/portal/service-tracker'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session) return null

  const svc = getServiceOrder(id)
  // Tenant scoping: never serve a record belonging to another organization.
  if (!svc || svc.organizationId !== session.organizationId) notFound()

  const field = getField(svc.fieldId)
  const done = svc.completion

  return (
    <>
      <Link
        href="/portal/services"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-forest"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to My Services
      </Link>

      <PageHeader
        title={svc.kind}
        subtitle={`${svc.reference} · ${field?.name ?? ''} · ${svc.acres.toLocaleString('en-CA')} acres`}
        action={<StatusBadge status={svc.status} className="text-sm" />}
      />

      <ServiceTracker status={svc.status} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Scheduling details */}
        <section className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-charcoal">
            Scheduling Details
          </h2>
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <Row label="Service" value={svc.kind} />
            <Row label="Date" value={formatDate(svc.scheduledDate)} />
            <Row
              label="Estimated arrival"
              value={svc.estimatedArrival ?? 'To be confirmed'}
            />
            <Row
              label="Expected duration"
              value={svc.expectedDuration ?? 'To be confirmed'}
            />
            <Row label="Field" value={field?.name ?? '—'} />
            <Row
              label="Area"
              value={`${svc.acres.toLocaleString('en-CA')} acres`}
            />
            <Row label="Operator" value={svc.operator ?? 'To be assigned'} />
            <Row label="Equipment" value={svc.equipment ?? 'To be assigned'} />
            <Row label="Treatment" value={svc.product} />
            {svc.applicationRate && (
              <Row label="Application rate" value={svc.applicationRate} />
            )}
            <Row
              label={done ? 'Total' : 'Estimated total'}
              value={`${CURRENCY.format(svc.price)} CAD`}
            />
          </dl>

          <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-gold/10 p-3.5 text-sm text-accent-foreground">
            <CloudRain className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p className="leading-relaxed">
              <strong className="font-semibold">Weather dependency:</strong>{' '}
              Aerial application requires wind below 20 km/h and no active
              precipitation. If conditions fall outside our safe operating
              window we will contact you and reschedule at no charge.
            </p>
          </div>

          <Button
            variant="outline"
            render={
              <Link href="/portal/messages">
                <MessageSquare className="size-4" aria-hidden />
                Contact Operations
              </Link>
            }
            className="mt-4"
          />
        </section>

        {/* Field snapshot */}
        <aside className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-charcoal">Field</h2>
          {field && (
            <>
              <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={field.mapImage}
                  alt={`Aerial map of ${field.name}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
              <dl className="flex flex-col gap-3">
                <Row label="Name" value={field.name} />
                <Row label="Crop" value={field.cropType} />
                <Row label="Location" value={field.address} />
                <Row
                  label="GPS"
                  value={`${field.coordinates.lat.toFixed(4)}, ${field.coordinates.lng.toFixed(4)}`}
                />
              </dl>
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link href={`/portal/fields/${field.id}`}>Open Field</Link>
                }
              />
            </>
          )}
        </aside>
      </div>

      {/* Completed service report */}
      {done ? (
        <section
          id="report"
          className="rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-charcoal">
              Completed Service Report
            </h2>
            <Button
              size="sm"
              className="bg-forest text-primary-foreground hover:bg-forest-deep"
            >
              <Download className="size-3.5" aria-hidden />
              Download Service Report
            </Button>
          </div>

          <dl className="grid gap-x-6 gap-y-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <Row label="Start time" value={done.startTime} />
            <Row label="Completion time" value={done.completionTime} />
            <Row
              label="Area treated"
              value={`${done.acresTreated.toLocaleString('en-CA')} acres`}
            />
            <Row label="Weather" value={done.weather} />
            <Row label="Product applied" value={svc.product} />
            <Row
              label="Application rate"
              value={svc.applicationRate ?? 'N/A'}
            />
            <Row label="Operator" value={svc.operator ?? '—'} />
            <Row label="Equipment" value={svc.equipment ?? '—'} />
          </dl>

          <div className="mt-5 flex flex-col gap-2 border-t pt-4">
            <span className="text-xs font-medium text-muted-foreground">
              Operator notes
            </span>
            <p className="text-sm leading-relaxed text-charcoal">
              {done.notes}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t pt-4">
            <span className="text-xs font-medium text-muted-foreground">
              Coverage map &amp; photos
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              <figure className="flex flex-col gap-1.5">
                <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={done.coverageMap}
                    alt={`Spray coverage map for ${svc.reference}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-xs text-muted-foreground">
                  Coverage map
                </figcaption>
              </figure>
              {done.photos.map((photo, i) => (
                <figure key={photo + i} className="flex flex-col gap-1.5">
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={photo}
                      alt={`Field photo ${i + 1} from ${svc.reference}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-xs text-muted-foreground">
                    Field photo {i + 1}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <p className="flex items-start gap-2.5 rounded-xl border border-dashed bg-card p-5 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          The service report and coverage map become available once this job is
          completed.
        </p>
      )}
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  )
}
