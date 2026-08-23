'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PORTAL_NAV } from '@/lib/portal/nav'
import { useLogout } from './use-logout'

export function PortalSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { logout, pending } = useLogout()

  return (
    <div className="flex h-full flex-col gap-6 bg-forest-deep">
      <div className="px-5 pt-6">
        <Link
          href="/portal"
          onClick={onNavigate}
          className="text-xl font-bold tracking-tight text-cream"
          aria-label="AgroSkyTech portal home"
        >
          <span className="font-normal">AGRO</span>
          <span>SKY</span>
          <span className="text-gold">TECH</span>
        </Link>
        <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream/45">
          Client Portal
        </p>
      </div>

      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3"
        aria-label="Portal"
      >
        {PORTAL_NAV.map((item) => {
          const active =
            item.href === '/portal'
              ? pathname === '/portal'
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
                  : 'text-cream/65 hover:bg-cream/8 hover:text-cream',
              )}
            >
              <item.icon
                className={cn(
                  'size-4 shrink-0',
                  active ? 'text-gold' : 'text-cream/50',
                )}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-cream/10 p-3">
        <button
          type="button"
          onClick={logout}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/65 transition-colors hover:bg-cream/8 hover:text-cream disabled:opacity-60"
        >
          <LogOut className="size-4 shrink-0 text-cream/50" aria-hidden />
          {pending ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export function PortalSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
      <PortalSidebarNav />
    </aside>
  )
}
