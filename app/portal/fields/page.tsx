import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowUpRight, MapPin, Plus, Ruler, Sprout } from 'lucide-react'
import { getCurrentUser } from '@/lib/portal/auth'
import {
  formatShortDate,
  getFields,
  getServiceOrders,
} from '@/lib/portal/demo-data'
import { PageHeader } from '@/components/portal/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'My Fields | AgroSkyTech Portal',
}

export default async function FieldsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/')

  const org = user.defaultOrganizationId
  const fields = getFields(org)
  const orders = getServiceOrders(org)
  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Fields"
        subtitle={`${fields.length} registered fields · ${totalAcres.toLocaleString('en-CA')} total acres`}
        action={
          <Button render={<Link href="/portal/support" />}>
            <Plus className="size-4" aria-hidden />
            Add a field
          </Button>
        }
      />

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => {
          const fieldOrders = orders.filter((o) => o.fieldId === field.id)
          const completed = fieldOrders.filter(
            (o) => o.status === 'completed',
          ).length
          return (
            <li key={field.id}>
              <Card className="group flex h-full flex-col overflow-hidden border-border/60 p-0 transition-shadow duration-200 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={field.mapImage}
                    alt={`Aerial map of ${field.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-2.5 py-1 text-xs font-semibold text-cream backdrop-blur-sm">
                    {field.cropType}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                      {field.name}
                    </h2>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      <span className="truncate">{field.address}</span>
                    </p>
                  </div>

                  <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Ruler
                        className="size-3.5 text-muted-foreground"
                        aria-hidden
                      />
                      <dt className="sr-only">Acres</dt>
                      <dd className="font-medium">{field.acres} ac</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sprout
                        className="size-3.5 text-muted-foreground"
                        aria-hidden
                      />
                      <dt className="sr-only">Services completed</dt>
                      <dd className="font-medium">{completed} completed</dd>
                    </div>
                  </dl>

                  {field.lastServiceDate && (
                    <p className="text-sm text-muted-foreground">
                      Last serviced {formatShortDate(field.lastServiceDate)}
                    </p>
                  )}

                  <Link
                    href={`/portal/fields/${field.id}`}
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-forest transition-colors hover:text-gold"
                  >
                    View field details
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
