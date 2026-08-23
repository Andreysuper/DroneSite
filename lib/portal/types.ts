/**
 * AgroSkyTech Client Portal — domain models.
 *
 * These types mirror the future production database schema so the demo data
 * layer can be swapped for Supabase (or another provider) without touching UI
 * components. Every tenant-scoped record carries an `organizationId` so that
 * row-level security can be enforced server-side later.
 *
 * Planned tables: users, organizations, fields, service_requests, service_jobs,
 * invoices, payments, documents, field_maps, notifications, messages,
 * appointments.
 */

export type ServiceStatus =
  | 'requested'
  | 'pending-confirmation'
  | 'confirmed'
  | 'operator-dispatched'
  | 'in-progress'
  | 'completed'
  | 'weather-delay'
  | 'rescheduled'
  | 'cancelled'

export type ServiceKind =
  | 'Crop Spraying'
  | 'Fertilizer Application'
  | 'Irrigation / Water Application'
  | 'Pest Control'
  | 'Golf Course Service'
  | 'Field Mapping'
  | 'Other'

export type InvoiceStatus = 'paid' | 'outstanding' | 'upcoming' | 'overdue'

export type ReportType =
  | 'RGB Field Map'
  | 'Crop Health Map'
  | 'NDVI'
  | 'Treatment Map'
  | 'Spray Coverage'
  | 'Prescription Map'
  | 'Problem Zones'

export type DocumentCategory =
  | 'Invoices'
  | 'Service Reports'
  | 'Application Records'
  | 'Field Maps'
  | 'Product Labels'
  | 'Contracts'
  | 'Safety Documents'
  | 'Other'

/** A billing/tenancy boundary. One user may belong to several organizations. */
export type Organization = {
  id: string
  name: string
  type: 'farm' | 'golf-course' | 'agri-business' | 'land-management'
  location: string
  /** Future: role-based membership lives in an `organization_members` table. */
  memberIds: string[]
}

export type PortalUser = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  billingAddress: string
  /** Organizations this user can switch between in the top bar. */
  organizationIds: string[]
  defaultOrganizationId: string
  notificationPreferences: {
    email: boolean
    sms: boolean
    serviceReminders: boolean
    invoiceNotifications: boolean
    reportReady: boolean
  }
}

export type Field = {
  id: string
  organizationId: string
  name: string
  farm: string
  address: string
  coordinates: { lat: number; lng: number }
  acres: number
  cropType: string
  notes?: string
  lastServiceDate?: string
  mapImage: MapVariant
}

/** Which analytics layer a generated field map renders. */
export type MapVariant =
  | 'rgb'
  | 'ndvi'
  | 'health'
  | 'coverage'
  | 'treatment'
  | 'problem'

export type ServiceOrder = {
  id: string
  /** Human-facing reference, e.g. AST-2026-0084. */
  reference: string
  organizationId: string
  fieldId: string
  kind: ServiceKind
  status: ServiceStatus
  scheduledDate: string
  estimatedArrival?: string
  expectedDuration?: string
  acres: number
  product: string
  applicationRate?: string
  operator?: string
  equipment?: string
  price: number
  /** Present once the job is completed. */
  completion?: {
    startTime: string
    completionTime: string
    weather: string
    acresTreated: number
    notes: string
    coverageMap: MapVariant
    photos: MapVariant[]
  }
}

export type FieldMap = {
  id: string
  organizationId: string
  fieldId: string
  type: ReportType
  capturedDate: string
  mission: string
  resolution: string
  analysisStatus: 'complete' | 'processing' | 'queued'
  image: MapVariant
  fileSize: string
}

export type Invoice = {
  id: string
  reference: string
  organizationId: string
  serviceOrderId: string
  issuedDate: string
  dueDate: string
  status: InvoiceStatus
  acres: number
  ratePerAcre: number
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  payments: {
    id: string
    date: string
    method: string
    amount: number
  }[]
}

/** A cost that has not been invoiced yet — always labelled as estimated. */
export type UpcomingCharge = {
  id: string
  organizationId: string
  date: string
  kind: ServiceKind
  acres: number
  estimatedAmount: number
}

export type PortalDocument = {
  id: string
  organizationId: string
  name: string
  category: DocumentCategory
  fieldId?: string
  date: string
  fileType: 'PDF' | 'PNG' | 'CSV' | 'SHP' | 'ZIP'
  size: string
}

export type Notification = {
  id: string
  organizationId: string
  title: string
  body: string
  date: string
  read: boolean
  kind: 'service' | 'invoice' | 'report' | 'weather' | 'payment'
}

export type MessageThread = {
  id: string
  organizationId: string
  subject: string
  updatedAt: string
  unread: boolean
  messages: {
    id: string
    from: 'client' | 'operations'
    author: string
    body: string
    sentAt: string
  }[]
}

/** Ordered stages used by the service status tracker. */
export const SERVICE_STAGES = [
  'Request Submitted',
  'Reviewed',
  'Scheduled',
  'Operator Assigned',
  'Service In Progress',
  'Completed',
  'Report Available',
] as const

export type ServiceStage = (typeof SERVICE_STAGES)[number]

/** Maps a status to how far along the tracker it sits. */
export const STATUS_STAGE_INDEX: Record<ServiceStatus, number> = {
  requested: 0,
  'pending-confirmation': 1,
  confirmed: 2,
  'operator-dispatched': 3,
  'in-progress': 4,
  completed: 5,
  'weather-delay': 2,
  rescheduled: 2,
  cancelled: 0,
}

export const STATUS_LABEL: Record<ServiceStatus, string> = {
  requested: 'Requested',
  'pending-confirmation': 'Pending Confirmation',
  confirmed: 'Confirmed',
  'operator-dispatched': 'Operator Dispatched',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'weather-delay': 'Weather Delay',
  rescheduled: 'Rescheduled',
  cancelled: 'Cancelled',
}
