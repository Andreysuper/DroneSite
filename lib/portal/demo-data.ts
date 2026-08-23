/**
 * Demonstration content for the AgroSkyTech client portal.
 *
 * This module is the single seam between the UI and the data source. Every
 * accessor takes an `organizationId` so that swapping these functions for
 * Supabase queries (with row-level security) requires no UI changes.
 */

import type {
  Field,
  FieldMap,
  Invoice,
  MessageThread,
  Notification,
  Organization,
  PortalDocument,
  PortalUser,
  ServiceOrder,
  UpcomingCharge,
} from './types'

export const DEMO_USER: PortalUser = {
  id: 'usr_andrey',
  name: 'Andrey',
  email: 'andreyoper@gmail.com',
  phone: '204 698 1770',
  company: 'Prairie View Farms',
  billingAddress: '48 Range Road, Oakbank, Manitoba, R0E 1J0, Canada',
  organizationIds: ['org_prairie_view', 'org_river_bend'],
  defaultOrganizationId: 'org_prairie_view',
  notificationPreferences: {
    email: true,
    sms: false,
    serviceReminders: true,
    invoiceNotifications: true,
    reportReady: true,
  },
}

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org_prairie_view',
    name: 'Prairie View Farms',
    type: 'farm',
    location: 'Manitoba, Canada',
    memberIds: ['usr_andrey'],
  },
  {
    id: 'org_river_bend',
    name: 'River Bend Golf Club',
    type: 'golf-course',
    location: 'Winnipeg, Manitoba',
    memberIds: ['usr_andrey'],
  },
]

const ORG = 'org_prairie_view'

export const FIELDS: Field[] = [
  {
    id: 'fld_north_canola',
    organizationId: ORG,
    name: 'North Canola',
    farm: 'Prairie View Farms',
    address: 'Section 14, Oakbank, Manitoba',
    coordinates: { lat: 49.9412, lng: -96.8531 },
    acres: 320,
    cropType: 'Canola',
    notes: 'Slight slope on the west edge. Power line along the north boundary.',
    lastServiceDate: '2026-06-10',
    mapImage: '/images/portal/map-rgb.png',
  },
  {
    id: 'fld_south_wheat',
    organizationId: ORG,
    name: 'South Wheat',
    farm: 'Prairie View Farms',
    address: 'Section 22, Oakbank, Manitoba',
    coordinates: { lat: 49.9188, lng: -96.8402 },
    acres: 480,
    cropType: 'Spring Wheat',
    notes: 'Large contiguous block. Ideal for high-throughput missions.',
    lastServiceDate: '2026-05-28',
    mapImage: '/images/portal/map-ndvi.png',
  },
  {
    id: 'fld_east_soy',
    organizationId: ORG,
    name: 'East Soybean',
    farm: 'Prairie View Farms',
    address: 'Section 9, Dugald, Manitoba',
    coordinates: { lat: 49.8901, lng: -96.7712 },
    acres: 220,
    cropType: 'Soybeans',
    lastServiceDate: '2026-06-02',
    mapImage: '/images/portal/map-health.png',
  },
  {
    id: 'fld_west_corn',
    organizationId: ORG,
    name: 'West Corn',
    farm: 'Prairie View Farms',
    address: 'Section 31, Oakbank, Manitoba',
    coordinates: { lat: 49.9533, lng: -96.9021 },
    acres: 410,
    cropType: 'Grain Corn',
    notes: 'Irrigation pivot in the south-east corner.',
    lastServiceDate: '2026-05-19',
    mapImage: '/images/portal/map-coverage.png',
  },
  {
    id: 'fld_home_quarter',
    organizationId: ORG,
    name: 'Home Quarter',
    farm: 'Prairie View Farms',
    address: '48 Range Road, Oakbank, Manitoba',
    coordinates: { lat: 49.9302, lng: -96.8617 },
    acres: 160,
    cropType: 'Oats',
    lastServiceDate: '2026-04-30',
    mapImage: '/images/portal/map-rgb.png',
  },
  {
    id: 'fld_river_flats',
    organizationId: ORG,
    name: 'River Flats',
    farm: 'Prairie View Farms',
    address: 'Section 6, Springfield, Manitoba',
    coordinates: { lat: 49.9705, lng: -96.8155 },
    acres: 250,
    cropType: 'Barley',
    notes: 'Low-lying, holds moisture after heavy rain.',
    mapImage: '/images/portal/map-problem.png',
  },
]

export const SERVICE_ORDERS: ServiceOrder[] = [
  // Upcoming
  {
    id: 'svc_0084',
    reference: 'AST-2026-0084',
    organizationId: ORG,
    fieldId: 'fld_north_canola',
    kind: 'Crop Spraying',
    status: 'confirmed',
    scheduledDate: '2026-06-24',
    estimatedArrival: '08:00 AM',
    expectedDuration: '4 hours',
    acres: 320,
    product: 'Fungicide — Prosaro XTR',
    applicationRate: '0.32 L/ac',
    operator: 'M. Chartrand',
    equipment: 'DJI Agras T50 (x2)',
    price: 4480,
  },
  {
    id: 'svc_0085',
    reference: 'AST-2026-0085',
    organizationId: ORG,
    fieldId: 'fld_south_wheat',
    kind: 'Field Mapping',
    status: 'pending-confirmation',
    scheduledDate: '2026-07-02',
    estimatedArrival: '10:00 AM',
    expectedDuration: '2.5 hours',
    acres: 480,
    product: 'Multispectral survey — NDVI + RGB',
    operator: 'Unassigned',
    equipment: 'DJI Mavic 3M',
    price: 2300,
  },
  {
    id: 'svc_0086',
    reference: 'AST-2026-0086',
    organizationId: ORG,
    fieldId: 'fld_east_soy',
    kind: 'Fertilizer Application',
    status: 'confirmed',
    scheduledDate: '2026-07-10',
    estimatedArrival: '07:00 AM',
    expectedDuration: '2 hours',
    acres: 220,
    product: 'Liquid Fertilizer — 28-0-0 UAN',
    applicationRate: '18 gal/ac',
    operator: 'D. Fontaine',
    equipment: 'DJI Agras T50',
    price: 2860,
  },
  // Completed
  {
    id: 'svc_0071',
    reference: 'AST-2026-0071',
    organizationId: ORG,
    fieldId: 'fld_north_canola',
    kind: 'Crop Spraying',
    status: 'completed',
    scheduledDate: '2026-06-10',
    estimatedArrival: '07:30 AM',
    expectedDuration: '4 hours',
    acres: 320,
    product: 'Fungicide — Prosaro XTR',
    applicationRate: '0.32 L/ac',
    operator: 'M. Chartrand',
    equipment: 'DJI Agras T50 (x2)',
    price: 4480,
    completion: {
      startTime: '07:34 AM',
      completionTime: '11:12 AM',
      weather: '18°C, wind 9 km/h NW, humidity 62%',
      acresTreated: 320,
      notes:
        'Full coverage achieved. Buffer zone respected along the north power line. No drift observed.',
      coverageMap: '/images/portal/map-coverage.png',
      photos: ['/images/portal/map-rgb.png', '/images/portal/map-health.png'],
    },
  },
  {
    id: 'svc_0064',
    reference: 'AST-2026-0064',
    organizationId: ORG,
    fieldId: 'fld_east_soy',
    kind: 'Fertilizer Application',
    status: 'completed',
    scheduledDate: '2026-06-02',
    estimatedArrival: '09:00 AM',
    expectedDuration: '2 hours',
    acres: 220,
    product: 'Liquid Fertilizer — 28-0-0 UAN',
    applicationRate: '18 gal/ac',
    operator: 'D. Fontaine',
    equipment: 'DJI Agras T50',
    price: 2860,
    completion: {
      startTime: '09:06 AM',
      completionTime: '11:02 AM',
      weather: '21°C, wind 12 km/h SW, humidity 55%',
      acresTreated: 220,
      notes: 'Applied in two passes to limit runoff on the eastern slope.',
      coverageMap: '/images/portal/map-treatment.png',
      photos: ['/images/portal/map-treatment.png'],
    },
  },
  {
    id: 'svc_0052',
    reference: 'AST-2026-0052',
    organizationId: ORG,
    fieldId: 'fld_south_wheat',
    kind: 'Field Mapping',
    status: 'completed',
    scheduledDate: '2026-05-28',
    estimatedArrival: '11:00 AM',
    expectedDuration: '2 hours',
    acres: 480,
    product: 'Multispectral survey — NDVI',
    operator: 'S. Okafor',
    equipment: 'DJI Mavic 3M',
    price: 2400,
    completion: {
      startTime: '11:04 AM',
      completionTime: '12:58 PM',
      weather: '16°C, wind 7 km/h N, clear',
      acresTreated: 480,
      notes:
        'Two low-vigour zones flagged in the south-west corner for follow-up scouting.',
      coverageMap: '/images/portal/map-ndvi.png',
      photos: ['/images/portal/map-ndvi.png', '/images/portal/map-problem.png'],
    },
  },
  {
    id: 'svc_0088',
    reference: 'AST-2026-0088',
    organizationId: ORG,
    fieldId: 'fld_west_corn',
    kind: 'Pest Control',
    status: 'requested',
    scheduledDate: '2026-07-14',
    acres: 410,
    product: 'Insecticide — to be confirmed',
    price: 5330,
  },
]

export const FIELD_MAPS: FieldMap[] = [
  {
    id: 'map_001',
    organizationId: ORG,
    fieldId: 'fld_north_canola',
    type: 'Spray Coverage',
    capturedDate: '2026-06-10',
    mission: 'AST-2026-0071 · Agras T50',
    resolution: '2.4 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-coverage.png',
    fileSize: '18.4 MB',
  },
  {
    id: 'map_002',
    organizationId: ORG,
    fieldId: 'fld_south_wheat',
    type: 'NDVI',
    capturedDate: '2026-05-28',
    mission: 'AST-2026-0052 · Mavic 3M',
    resolution: '3.1 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-ndvi.png',
    fileSize: '24.7 MB',
  },
  {
    id: 'map_003',
    organizationId: ORG,
    fieldId: 'fld_east_soy',
    type: 'Crop Health Map',
    capturedDate: '2026-06-02',
    mission: 'AST-2026-0064 · Mavic 3M',
    resolution: '2.8 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-health.png',
    fileSize: '15.2 MB',
  },
  {
    id: 'map_004',
    organizationId: ORG,
    fieldId: 'fld_north_canola',
    type: 'RGB Field Map',
    capturedDate: '2026-06-10',
    mission: 'AST-2026-0071 · Mavic 3M',
    resolution: '1.9 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-rgb.png',
    fileSize: '31.6 MB',
  },
  {
    id: 'map_005',
    organizationId: ORG,
    fieldId: 'fld_east_soy',
    type: 'Treatment Map',
    capturedDate: '2026-06-02',
    mission: 'AST-2026-0064 · Agras T50',
    resolution: '2.8 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-treatment.png',
    fileSize: '12.9 MB',
  },
  {
    id: 'map_006',
    organizationId: ORG,
    fieldId: 'fld_river_flats',
    type: 'Problem Zones',
    capturedDate: '2026-05-14',
    mission: 'AST-2026-0039 · Mavic 3M',
    resolution: '3.4 cm/px',
    analysisStatus: 'complete',
    image: '/images/portal/map-problem.png',
    fileSize: '9.8 MB',
  },
  {
    id: 'map_007',
    organizationId: ORG,
    fieldId: 'fld_south_wheat',
    type: 'Prescription Map',
    capturedDate: '2026-05-28',
    mission: 'AST-2026-0052 · Analysis',
    resolution: '3.1 cm/px',
    analysisStatus: 'processing',
    image: '/images/portal/map-treatment.png',
    fileSize: '4.2 MB',
  },
]

export const INVOICES: Invoice[] = [
  {
    id: 'inv_1042',
    reference: 'INV-2026-1042',
    organizationId: ORG,
    serviceOrderId: 'svc_0071',
    issuedDate: '2026-06-10',
    dueDate: '2026-06-24',
    status: 'paid',
    acres: 320,
    ratePerAcre: 14,
    subtotal: 4480,
    tax: 224,
    total: 4704,
    amountPaid: 4704,
    payments: [
      {
        id: 'pay_501',
        date: '2026-06-14',
        method: 'EFT — RBC ••4821',
        amount: 4704,
      },
    ],
  },
  {
    id: 'inv_1051',
    reference: 'INV-2026-1051',
    organizationId: ORG,
    serviceOrderId: 'svc_0064',
    issuedDate: '2026-06-02',
    dueDate: '2026-06-28',
    status: 'outstanding',
    acres: 220,
    ratePerAcre: 13,
    subtotal: 2860,
    tax: 143,
    total: 3003,
    amountPaid: 0,
    payments: [],
  },
  {
    id: 'inv_1049',
    reference: 'INV-2026-1049',
    organizationId: ORG,
    serviceOrderId: 'svc_0052',
    issuedDate: '2026-05-28',
    dueDate: '2026-06-28',
    status: 'outstanding',
    acres: 480,
    ratePerAcre: 5,
    subtotal: 2400,
    tax: 120,
    total: 2520,
    amountPaid: 1243,
    payments: [
      {
        id: 'pay_498',
        date: '2026-06-08',
        method: 'Credit card ••3390',
        amount: 1243,
      },
    ],
  },
  {
    id: 'inv_1033',
    reference: 'INV-2026-1033',
    organizationId: ORG,
    serviceOrderId: 'svc_0071',
    issuedDate: '2026-04-30',
    dueDate: '2026-05-14',
    status: 'paid',
    acres: 160,
    ratePerAcre: 12,
    subtotal: 1920,
    tax: 96,
    total: 2016,
    amountPaid: 2016,
    payments: [
      {
        id: 'pay_474',
        date: '2026-05-06',
        method: 'EFT — RBC ••4821',
        amount: 2016,
      },
    ],
  },
]

export const UPCOMING_CHARGES: UpcomingCharge[] = [
  {
    id: 'chg_01',
    organizationId: ORG,
    date: '2026-07-02',
    kind: 'Field Mapping',
    acres: 480,
    estimatedAmount: 2300,
  },
  {
    id: 'chg_02',
    organizationId: ORG,
    date: '2026-07-10',
    kind: 'Fertilizer Application',
    acres: 220,
    estimatedAmount: 2860,
  },
]

export const DOCUMENTS: PortalDocument[] = [
  {
    id: 'doc_01',
    organizationId: ORG,
    name: 'INV-2026-1042 — Crop Spraying.pdf',
    category: 'Invoices',
    fieldId: 'fld_north_canola',
    date: '2026-06-10',
    fileType: 'PDF',
    size: '184 KB',
  },
  {
    id: 'doc_02',
    organizationId: ORG,
    name: 'Service Completion Report — AST-2026-0071.pdf',
    category: 'Service Reports',
    fieldId: 'fld_north_canola',
    date: '2026-06-10',
    fileType: 'PDF',
    size: '2.1 MB',
  },
  {
    id: 'doc_03',
    organizationId: ORG,
    name: 'Application Record — Prosaro XTR.pdf',
    category: 'Application Records',
    fieldId: 'fld_north_canola',
    date: '2026-06-10',
    fileType: 'PDF',
    size: '96 KB',
  },
  {
    id: 'doc_04',
    organizationId: ORG,
    name: 'North Canola — Spray Coverage Map.png',
    category: 'Field Maps',
    fieldId: 'fld_north_canola',
    date: '2026-06-10',
    fileType: 'PNG',
    size: '18.4 MB',
  },
  {
    id: 'doc_05',
    organizationId: ORG,
    name: 'South Wheat — NDVI Analysis.png',
    category: 'Field Maps',
    fieldId: 'fld_south_wheat',
    date: '2026-05-28',
    fileType: 'PNG',
    size: '24.7 MB',
  },
  {
    id: 'doc_06',
    organizationId: ORG,
    name: 'Prosaro XTR — Product Label.pdf',
    category: 'Product Labels',
    date: '2026-03-02',
    fileType: 'PDF',
    size: '640 KB',
  },
  {
    id: 'doc_07',
    organizationId: ORG,
    name: '2026 Seasonal Service Agreement.pdf',
    category: 'Contracts',
    date: '2026-02-18',
    fileType: 'PDF',
    size: '312 KB',
  },
  {
    id: 'doc_08',
    organizationId: ORG,
    name: 'Drone Operations Safety Plan.pdf',
    category: 'Safety Documents',
    date: '2026-01-22',
    fileType: 'PDF',
    size: '1.4 MB',
  },
  {
    id: 'doc_09',
    organizationId: ORG,
    name: 'South Wheat — Prescription File.shp',
    category: 'Field Maps',
    fieldId: 'fld_south_wheat',
    date: '2026-05-28',
    fileType: 'SHP',
    size: '4.2 MB',
  },
  {
    id: 'doc_10',
    organizationId: ORG,
    name: 'Application Data Export — June 2026.csv',
    category: 'Application Records',
    date: '2026-06-11',
    fileType: 'CSV',
    size: '58 KB',
  },
]

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf_01',
    organizationId: ORG,
    title: 'Service confirmed for June 24',
    body: 'Crop Spraying on North Canola (320 acres) is confirmed for 08:00 AM.',
    date: '2026-06-18',
    read: false,
    kind: 'service',
  },
  {
    id: 'ntf_02',
    organizationId: ORG,
    title: 'New invoice available',
    body: 'INV-2026-1051 for Fertilizer Application is ready to view.',
    date: '2026-06-17',
    read: false,
    kind: 'invoice',
  },
  {
    id: 'ntf_03',
    organizationId: ORG,
    title: 'Field report ready for download',
    body: 'NDVI analysis for South Wheat has finished processing.',
    date: '2026-06-16',
    read: false,
    kind: 'report',
  },
  {
    id: 'ntf_04',
    organizationId: ORG,
    title: 'Weather may affect tomorrow’s spraying schedule',
    body: 'Winds of 28 km/h are forecast for Oakbank. We will confirm by 6:00 AM.',
    date: '2026-06-15',
    read: true,
    kind: 'weather',
  },
  {
    id: 'ntf_05',
    organizationId: ORG,
    title: 'Payment received',
    body: 'Thank you — $4,704.00 CAD was applied to INV-2026-1042.',
    date: '2026-06-14',
    read: true,
    kind: 'payment',
  },
]

export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'thr_01',
    organizationId: ORG,
    subject: 'Spraying schedule confirmation',
    updatedAt: '2026-06-18',
    unread: true,
    messages: [
      {
        id: 'msg_01',
        from: 'operations',
        author: 'AgroSkyTech Operations',
        body: 'Hi Andrey — we have you confirmed for June 24 at 08:00 AM on North Canola. Two Agras T50 units are assigned.',
        sentAt: '2026-06-18 09:12',
      },
      {
        id: 'msg_02',
        from: 'client',
        author: 'Andrey',
        body: 'Perfect. Please use the south approach — the north gate is being replaced that week.',
        sentAt: '2026-06-18 10:40',
      },
      {
        id: 'msg_03',
        from: 'operations',
        author: 'AgroSkyTech Operations',
        body: 'Noted, we have added the south approach to the mission brief. Thanks for the heads up.',
        sentAt: '2026-06-18 11:05',
      },
    ],
  },
  {
    id: 'thr_02',
    organizationId: ORG,
    subject: 'Chemical product question',
    updatedAt: '2026-06-12',
    unread: false,
    messages: [
      {
        id: 'msg_04',
        from: 'client',
        author: 'Andrey',
        body: 'Can you confirm the fungicide rate you used on the canola last pass?',
        sentAt: '2026-06-12 08:20',
      },
      {
        id: 'msg_05',
        from: 'operations',
        author: 'AgroSkyTech Operations',
        body: 'We applied Prosaro XTR at 0.32 L/ac. The full application record is in your Documents.',
        sentAt: '2026-06-12 08:55',
      },
    ],
  },
  {
    id: 'thr_03',
    organizationId: ORG,
    subject: 'Weather delay — June 15',
    updatedAt: '2026-06-15',
    unread: false,
    messages: [
      {
        id: 'msg_06',
        from: 'operations',
        author: 'AgroSkyTech Operations',
        body: 'Winds are forecast at 28 km/h tomorrow, which is above our safe application threshold. We are holding the mission and will reconfirm at 6:00 AM.',
        sentAt: '2026-06-15 16:30',
      },
    ],
  },
  {
    id: 'thr_04',
    organizationId: ORG,
    subject: 'Invoice question — INV-2026-1049',
    updatedAt: '2026-06-09',
    unread: false,
    messages: [
      {
        id: 'msg_07',
        from: 'client',
        author: 'Andrey',
        body: 'I sent a partial payment on this one. Can you confirm the remaining balance?',
        sentAt: '2026-06-09 13:10',
      },
      {
        id: 'msg_08',
        from: 'operations',
        author: 'AgroSkyTech Operations',
        body: 'Received — $1,243.00 was applied. The remaining balance is $1,277.00, due June 28.',
        sentAt: '2026-06-09 14:02',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Accessors — the seam where Supabase queries will slot in later.     */
/* ------------------------------------------------------------------ */

export function getOrganizations(user: PortalUser = DEMO_USER) {
  return ORGANIZATIONS.filter((o) => user.organizationIds.includes(o.id))
}

export function getOrganization(orgId: string) {
  return ORGANIZATIONS.find((o) => o.id === orgId) ?? ORGANIZATIONS[0]
}

export function getFields(orgId: string = ORG) {
  return FIELDS.filter((f) => f.organizationId === orgId)
}

export function getField(fieldId: string) {
  return FIELDS.find((f) => f.id === fieldId)
}

export function getServiceOrders(orgId: string = ORG) {
  return SERVICE_ORDERS.filter((s) => s.organizationId === orgId)
}

export function getServiceOrder(id: string) {
  return SERVICE_ORDERS.find((s) => s.id === id)
}

export function getFieldMaps(orgId: string = ORG) {
  return FIELD_MAPS.filter((m) => m.organizationId === orgId)
}

export function getInvoices(orgId: string = ORG) {
  return INVOICES.filter((i) => i.organizationId === orgId)
}

export function getInvoice(id: string) {
  return INVOICES.find((i) => i.id === id)
}

export function getDocuments(orgId: string = ORG) {
  return DOCUMENTS.filter((d) => d.organizationId === orgId)
}

export function getNotifications(orgId: string = ORG) {
  return NOTIFICATIONS.filter((n) => n.organizationId === orgId)
}

export function getMessageThreads(orgId: string = ORG) {
  return MESSAGE_THREADS.filter((t) => t.organizationId === orgId)
}

export function getUpcomingCharges(orgId: string = ORG) {
  return UPCOMING_CHARGES.filter((c) => c.organizationId === orgId)
}

/* ------------------------------------------------------------------ */
/* Derived summaries                                                   */
/* ------------------------------------------------------------------ */

export function getDashboardSummary(orgId: string = ORG) {
  const orders = getServiceOrders(orgId)
  const invoices = getInvoices(orgId)

  const upcoming = orders
    .filter((o) =>
      ['confirmed', 'pending-confirmation', 'operator-dispatched'].includes(
        o.status,
      ),
    )
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))

  const completed = orders.filter((o) => o.status === 'completed')

  const outstanding = invoices
    .filter((i) => i.status === 'outstanding' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0)

  const paidThisYear = invoices.reduce((sum, i) => sum + i.amountPaid, 0)

  const upcomingPayments = getUpcomingCharges(orgId).reduce(
    (sum, c) => sum + c.estimatedAmount,
    0,
  )

  const nextDueDate = invoices
    .filter((i) => i.status === 'outstanding' || i.status === 'overdue')
    .map((i) => i.dueDate)
    .sort()[0]

  return {
    nextService: upcoming[0],
    upcomingServices: upcoming,
    totalAcresServiced: completed.reduce(
      (sum, o) => sum + (o.completion?.acresTreated ?? o.acres),
      0,
    ),
    activeFields: getFields(orgId).length,
    outstandingBalance: outstanding,
    upcomingPayments,
    paidThisYear,
    nextDueDate,
  }
}

export const CURRENCY = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

export const CURRENCY_PRECISE = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  minimumFractionDigits: 2,
})

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  })
}

export function formatShortDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
  })
}
