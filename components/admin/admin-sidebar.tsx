'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_NAV } from '@/lib/admin/nav'
import { type AppRole, ROLE_LABEL, can } from '@/lib/auth/roles'
import { useLogout } from '@/components/portal/use-logout'

export function AdminSidebarNav({
  role,
  onNavigate,
}: {
  role: AppRole
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const { logout, pending } = useLogout()
  const items = ADMIN_NAV.filter((item) => can(role, item.capability))

  return (
    <div className="flex h-full flex-col gap-6 bg-charcoal">
      <div className="px-5 pt-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="text-xl font-bold tracking-tight text-cream"
          aria-label="AgroSkyTech administration"
        >
          <span className="font-normal">AGRO</span>
          <span>SKY</span>
          <span className="text-gold">TECH</span>
        </Link>
        <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gold/70">
          Administration
        </p>
      </div>

      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3"
        aria-label="Administration"
      >
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-cream/12 text-cream'
                  : 'text-cream/60 hover:bg-cream/8 hover:text-cream',
              )}
            >
              <item.icon
                className={cn(
                  'size-4 shrink-0',
                  active ? 'text-gold' : 'text-cream/45',
                )}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-cream/10 p-3">
        <Link
          href="/portal"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-cream/8 hover:text-cream"
        >
          <ExternalLink className="size-4 shrink-0 text-cream/45" aria-hidden />
          Client Portal
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-cream/8 hover:text-cream disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0 text-cream/45" aria-hidden />
          {pending ? 'Signing out…' : 'Logout'}
        </button>
        <p className="px-3 pt-2 text-[0.7rem] text-cream/40">
          Signed in as {ROLE_LABEL[role]}
        </p>
      </div>
    </div>
  )
}

export function AdminSidebar({ role }: { role: AppRole }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
      <AdminSidebarNav role={role} />
    </aside>
  )
}
