/**
 * Client-safe RBAC definitions for the AgroSkyTech platform.
 *
 * This module contains NO server-only imports so it can be shared by both
 * server components/route handlers and client components (badges, nav guards).
 * The authoritative enforcement lives in Postgres RLS + the server helpers in
 * `lib/auth/session.ts`; this file is the single source of truth for labels,
 * ordering and coarse capability checks used to shape the UI.
 */

export type AppRole =
  | 'super_admin'
  | 'administrator'
  | 'operations_manager'
  | 'accounting'
  | 'operator'
  | 'customer'

export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: 'Super Admin',
  administrator: 'Administrator',
  operations_manager: 'Operations Manager',
  accounting: 'Accounting',
  operator: 'Operator',
  customer: 'Customer',
}

export const ROLE_DESCRIPTION: Record<AppRole, string> = {
  super_admin: 'Full control over the platform, users and settings.',
  administrator: 'Manage operations, customers, billing and staff.',
  operations_manager: 'Manage service requests, scheduling and jobs.',
  accounting: 'Manage invoices, payments and financial reporting.',
  operator: 'View and update assigned field jobs.',
  customer: 'Access the client portal for their own account.',
}

/** Staff roles — anyone who is not an external customer. */
export const STAFF_ROLES: AppRole[] = [
  'super_admin',
  'administrator',
  'operations_manager',
  'accounting',
  'operator',
]

/** Roles that see the Administration button and the admin command center. */
export const ADMIN_ACCESS_ROLES: AppRole[] = [
  'super_admin',
  'administrator',
  'operations_manager',
  'accounting',
]

/** Roles with top-level administrative authority (user/role management). */
export const ADMIN_ROLES: AppRole[] = ['super_admin', 'administrator']

export function isStaff(role: AppRole | null | undefined): boolean {
  return !!role && STAFF_ROLES.includes(role)
}

export function hasAdminAccess(role: AppRole | null | undefined): boolean {
  return !!role && ADMIN_ACCESS_ROLES.includes(role)
}

export function isAdmin(role: AppRole | null | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role)
}

/** Where a user lands after signing in, based on their role. */
export function landingPathForRole(role: AppRole | null | undefined): string {
  if (!role) return '/'
  if (role === 'customer') return '/portal'
  if (role === 'operator') return '/admin/jobs'
  return '/admin'
}

/**
 * Coarse, UI-shaping capability map. Server-side RLS is the real gate; this
 * only decides which nav items and actions to render for a given role.
 */
export type Capability =
  | 'admin.dashboard'
  | 'requests.view'
  | 'requests.manage'
  | 'customers.view'
  | 'customers.manage'
  | 'jobs.view'
  | 'jobs.manage'
  | 'jobs.assigned'
  | 'invoices.view'
  | 'invoices.manage'
  | 'fleet.view'
  | 'staff.manage'
  | 'settings.manage'

const CAPABILITIES: Record<AppRole, Capability[]> = {
  super_admin: [
    'admin.dashboard',
    'requests.view',
    'requests.manage',
    'customers.view',
    'customers.manage',
    'jobs.view',
    'jobs.manage',
    'invoices.view',
    'invoices.manage',
    'fleet.view',
    'staff.manage',
    'settings.manage',
  ],
  administrator: [
    'admin.dashboard',
    'requests.view',
    'requests.manage',
    'customers.view',
    'customers.manage',
    'jobs.view',
    'jobs.manage',
    'invoices.view',
    'invoices.manage',
    'fleet.view',
    'staff.manage',
    'settings.manage',
  ],
  operations_manager: [
    'admin.dashboard',
    'requests.view',
    'requests.manage',
    'customers.view',
    'customers.manage',
    'jobs.view',
    'jobs.manage',
    'fleet.view',
  ],
  accounting: [
    'admin.dashboard',
    'requests.view',
    'customers.view',
    'invoices.view',
    'invoices.manage',
  ],
  operator: ['jobs.view', 'jobs.assigned'],
  customer: [],
}

export function can(
  role: AppRole | null | undefined,
  capability: Capability,
): boolean {
  if (!role) return false
  return CAPABILITIES[role].includes(capability)
}
