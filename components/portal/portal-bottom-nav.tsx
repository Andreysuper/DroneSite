'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MOBILE_NAV } from '@/lib/portal/nav'

export function PortalBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
      aria-label="Portal quick navigation"
    >
      {MOBILE_NAV.map((item) => {
        const active =
          item.href === '/portal'
            ? pathname === '/portal'
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium transition-colors',
              active ? 'text-forest' : 'text-muted-foreground',
            )}
          >
            <item.icon
              className={cn('size-5', active && 'text-gold')}
              aria-hidden
            />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
