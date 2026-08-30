'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileBarChart,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Wallet,
  CloudRain,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/portal/demo-data'
import type {
  Notification,
  Organization,
  PortalUser,
} from '@/lib/portal/types'
import { PortalSidebarNav } from './portal-sidebar'
import { useLogout } from './use-logout'

const NOTIFICATION_ICON = {
  service: Wrench,
  invoice: CreditCard,
  report: FileBarChart,
  weather: CloudRain,
  payment: Wallet,
} as const

export function PortalTopbar({
  user,
  organizations,
  activeOrganization,
  notifications,
  canAccessAdmin = false,
}: {
  user: PortalUser
  organizations: Organization[]
  activeOrganization: Organization
  notifications: Notification[]
  canAccessAdmin?: boolean
}) {
  const { logout } = useLogout()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [read, setRead] = useState<string[]>([])

  const unread = notifications.filter(
    (n) => !n.read && !read.includes(n.id),
  ).length

  const initials = user.name.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/85 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="-ml-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open portal menu"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Portal navigation</SheetTitle>
          <PortalSidebarNav onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Farm / organization selector */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex min-w-0 items-center gap-2.5 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-forest text-cream">
                <Building2 className="size-3.5" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold leading-tight text-charcoal">
                  {activeOrganization.name}
                </span>
                <span className="hidden truncate text-[0.7rem] leading-tight text-muted-foreground sm:block">
                  {activeOrganization.location}
                </span>
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
            </button>
          }
        />
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>Switch property</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations.map((org) => (
            <DropdownMenuItem key={org.id} className="gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Building2 className="size-3.5" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{org.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {org.location}
                </span>
              </span>
              {org.id === activeOrganization.id && (
                <Check className="size-4 text-forest" aria-hidden />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      {/* Administration entry point — only for staff with admin access */}
      {canAccessAdmin && (
        <Button
          nativeButton={false}
          size="sm"
          render={
            <Link href="/admin">
              <ShieldCheck className="size-4" aria-hidden />
              <span className="hidden sm:inline">Administration</span>
            </Link>
          }
          className="gap-1.5 border border-gold/40 bg-gold/10 text-charcoal hover:bg-gold/20"
        />
      )}

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="size-[18px]" aria-hidden />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-accent-foreground">
                  {unread}
                </span>
              )}
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => setRead(notifications.map((n) => n.id))}
                className="text-xs font-medium text-forest hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <DropdownMenuSeparator className="m-0" />
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = NOTIFICATION_ICON[n.kind]
              const isUnread = !n.read && !read.includes(n.id)
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex gap-3 border-b px-3 py-3 last:border-0',
                    isUnread && 'bg-gold/5',
                  )}
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-forest">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-semibold leading-snug text-charcoal">
                      {n.title}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {n.body}
                    </span>
                    <span className="mt-0.5 text-[0.7rem] font-medium text-muted-foreground/70">
                      {formatShortDate(n.date)}
                    </span>
                  </div>
                  {isUnread && (
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full bg-gold"
                      aria-label="Unread"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help */}
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={
          <Link href="/portal/support" aria-label="Support and help">
            <CircleHelp className="size-[18px]" aria-hidden />
          </Link>
        }
        className="size-9 text-muted-foreground hover:text-foreground"
      />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted"
              aria-label="Account menu"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-forest text-xs font-bold text-cream">
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
            <span className="text-sm font-semibold">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <Link href="/portal/settings">
                <Settings className="size-4" aria-hidden />
                Account Settings
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link href="/portal/support">
                <LifeBuoy className="size-4" aria-hidden />
                Support
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
