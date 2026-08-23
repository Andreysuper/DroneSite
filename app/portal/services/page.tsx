import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/portal/auth'
import { getFields, getServiceOrders } from '@/lib/portal/demo-data'
import { PageHeader } from '@/components/portal/page-header'
import { ServicesList } from '@/components/portal/services-list'

export const metadata = { title: 'My Services' }

export default async function ServicesPage() {
  const session = await getSession()
  if (!session) return null

  const orders = getServiceOrders(session.organizationId)
  const fields = getFields(session.organizationId)

  return (
    <>
      <PageHeader
        title="My Services"
        subtitle="Every service order for this property — current, upcoming and historical."
        action={
          <Button
            nativeButton={false}
            render={
              <Link href="/portal/book">
                <PlusCircle className="size-4" aria-hidden />
                Book a Service
              </Link>
            }
            className="bg-forest text-primary-foreground hover:bg-forest-deep"
          />
        }
      />
      <ServicesList orders={orders} fields={fields} />
    </>
  )
}
