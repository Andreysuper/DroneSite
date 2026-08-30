'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LogOut, Menu, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { type AppRole, ROLE_LABEL } from '@/lib/auth/roles'
import { useLogout } from '@/components/portal/use-logout'
import { AdminSidebarNav } from './admin-sidebar'

export function AdminTopbar({
  name,
  email,
  role,
}: {
  name: string
  email: string
  role: AppRole
}) {
  const { logout } = useLogout()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const initials = (name || email).slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="-ml-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open administration menu"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Administration navigation</SheetTitle>
          <AdminSidebarNav role={role} onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-charcoal">
          Operations Console
        </span>
        <span className="hidden text-xs text-muted-foreground sm:block">
          {ROLE_LABEL[role]} workspace
        </span>
      </div>

      <div className="flex-1" />

      <span className="hidden items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-charcoal sm:inline-flex">
        {ROLE_LABEL[role]}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted"
              aria-label="Account menu"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-charcoal text-xs font-bold text-cream">
                {initials}
              </span>
              <ChevronDown
                className="hidden size-4 text-muted-foreground sm:block"
                aria-hidden
              />
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="text-sm font-semibold">{name || 'Account'}</span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <Link href="/portal/settings">
                <User className="size-4" aria-hidden />
                My Profile
              </Link>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="size-4" aria-hidden />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
