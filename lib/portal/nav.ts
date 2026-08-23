import {
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Map,
  MessageSquare,
  PlusCircle,
  Settings,
  Sprout,
  Wrench,
} from 'lucide-react'

export const PORTAL_NAV = [
  { label: 'Overview', href: '/portal', icon: LayoutDashboard },
  { label: 'My Services', href: '/portal/services', icon: Wrench },
  { label: 'Book a Service', href: '/portal/book', icon: PlusCircle },
  { label: 'Fields', href: '/portal/fields', icon: Sprout },
  { label: 'Maps & Reports', href: '/portal/maps', icon: Map },
  { label: 'Schedule', href: '/portal/schedule', icon: CalendarDays },
  { label: 'Invoices & Payments', href: '/portal/invoices', icon: CreditCard },
  { label: 'Documents', href: '/portal/documents', icon: FileText },
  { label: 'Messages', href: '/portal/messages', icon: MessageSquare },
  { label: 'Support', href: '/portal/support', icon: LifeBuoy },
  { label: 'Account Settings', href: '/portal/settings', icon: Settings },
] as const

/** Condensed set shown in the mobile bottom bar. */
export const MOBILE_NAV = [
  { label: 'Overview', href: '/portal', icon: LayoutDashboard },
  { label: 'Services', href: '/portal/services', icon: Wrench },
  { label: 'Book', href: '/portal/book', icon: PlusCircle },
  { label: 'Invoices', href: '/portal/invoices', icon: CreditCard },
] as const
