import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser, getSession } from '@/lib/portal/auth'
import { getAuthProfile } from '@/lib/auth/session'
import { hasAdminAccess } from '@/lib/auth/roles'
import {
  getNotifications,
  getOrganization,
  getOrganizations,
} from '@/lib/portal/demo-data'
import { PortalSidebar } from '@/components/portal/portal-sidebar'
import { PortalTopbar } from '@/components/portal/portal-topbar'
import { PortalBottomNav } from '@/components/portal/portal-bottom-nav'

export const metadata: Metadata = {
  title: 'Client Portal',
  description:
    'Manage your AgroSkyTech drone services, fields, maps, invoices and reports.',
  robots: { index: false, follow: false },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const session = await getSession()

  // Server-side guard: unauthenticated visitors never receive portal markup.
  if (!user || !session) redirect('/')

  const profile = await getAuthProfile()
  const canAccessAdmin = hasAdminAccess(profile?.role)

  const organizations = getOrganizations(user)
  const activeOrganization = getOrganization(session.organizationId)
  const notifications = getNotifications(activeOrganization.id)

  return (
    <div className="min-h-svh bg-secondary/50">
      <PortalSidebar />
      <div className="flex min-h-svh flex-col lg:pl-64">
        <PortalTopbar
          user={user}
          organizations={organizations}
          activeOrganization={activeOrganization}
          notifications={notifications}
          canAccessAdmin={canAccessAdmin}
        />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pb-10 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
      <PortalBottomNav />
    </div>
  )
}
