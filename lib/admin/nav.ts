import {
  Building2,
  CreditCard,
  LayoutDashboard,
  ClipboardList,
  Plane,
  Settings,
  Users,
  Wrench,
} from 'lucide-react'
import type { Capability } from '@/lib/auth/roles'

export type AdminNavItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
  /** Item is shown only when the role has this capability. */
  capability: Capability
  /** Match exactly (dashboard) vs. by prefix (sections). */
  exact?: boolean
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    label: 'Command Center',
    href: '/admin',
    icon: LayoutDashboard,
    capability: 'admin.dashboard',
    exact: true,
  },
  {
    label: 'Service Requests',
    href: '/admin/requests',
    icon: ClipboardList,
    capability: 'requests.view',
  },
  {
    label: 'Jobs',
    href: '/admin/jobs',
    icon: Wrench,
    capability: 'jobs.view',
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: Building2,
    capability: 'customers.view',
  },
  {
    label: 'Invoices',
    href: '/admin/invoices',
    icon: CreditCard,
    capability: 'invoices.view',
  },
  {
    label: 'Fleet',
    href: '/admin/fleet',
    icon: Plane,
    capability: 'fleet.view',
  },
  {
    label: 'Staff & Roles',
    href: '/admin/staff',
    icon: Users,
    capability: 'staff.manage',
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    capability: 'settings.manage',
  },
]
