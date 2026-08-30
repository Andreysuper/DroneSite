import type { Metadata } from 'next'
import { requireStaff } from '@/lib/auth/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'

export const metadata: Metadata = {
  title: {
    default: 'Administration',
    template: '%s · AgroSkyTech Admin',
  },
  description: 'AgroSkyTech operations console.',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Gate the whole console to staff. Each page adds its own capability check,
  // and the sidebar only renders nav items the role is allowed to open.
  const profile = await requireStaff()

  return (
    <div className="min-h-svh bg-secondary/40">
      <AdminSidebar role={profile.role} />
      <div className="flex min-h-svh flex-col lg:pl-64">
        <AdminTopbar
          name={profile.fullName}
          email={profile.email}
          role={profile.role}
        />
        <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
