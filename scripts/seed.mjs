/**
 * Seed script for the AgroSkyTech platform.
 *
 * Creates auth users for every RBAC role (via the service-role Admin API,
 * which fires the handle_new_user trigger to create profiles), then seeds
 * customers, fields, service requests, jobs, and invoices migrated from the
 * original portal demo content.
 *
 * Run: node --env-file-if-exists=/vercel/share/.env.project scripts/seed.mjs
 * Idempotent: re-running updates existing rows by natural key.
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('[seed] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_PASSWORD = 'AgroDemo2026!'

/** Accounts, one per role. */
const USERS = [
  { email: 'andreyoper@gmail.com', full_name: 'Andrey Operator', phone: '204 698 1770', role: 'super_admin' },
  { email: 'admin.demo@agroskytech.ca', full_name: 'Dana Whitfield', phone: '204 555 0142', role: 'administrator' },
  { email: 'ops.demo@agroskytech.ca', full_name: 'Marc Chartrand', phone: '204 555 0177', role: 'operations_manager' },
  { email: 'accounting.demo@agroskytech.ca', full_name: 'Priya Anand', phone: '204 555 0193', role: 'accounting' },
  { email: 'operator.demo@agroskytech.ca', full_name: 'Sam Okafor', phone: '204 555 0128', role: 'operator' },
  { email: 'customer.demo@prairieview.ca', full_name: 'Andrew Prairie', phone: '204 698 1770', role: 'customer' },
]

async function findUserByEmail(email) {
  // paginate through users (small dataset)
  let page = 1
  while (page < 20) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match
    if (data.users.length < 200) return null
    page++
  }
  return null
}

async function upsertUser(u) {
  let existing = await findUserByEmail(u.email)
  if (!existing) {
    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, phone: u.phone },
    })
    if (error) throw error
    existing = data.user
    console.log(`[seed] created auth user ${u.email}`)
  } else {
    await admin.auth.admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: u.full_name, phone: u.phone },
    })
    console.log(`[seed] updated auth user ${u.email}`)
  }

  // Ensure the profile carries the intended role (trigger defaults to customer).
  const { error: pErr } = await admin
    .from('profiles')
    .update({ role: u.role, full_name: u.full_name, phone: u.phone, email: u.email })
    .eq('id', existing.id)
  if (pErr) throw pErr

  return existing.id
}

async function main() {
  const ids = {}
  for (const u of USERS) {
    ids[u.role] = await upsertUser(u)
  }

  // ---- Customer (Prairie View Farms) linked to the customer login ----
  const customerProfileId = ids['customer']
  const { data: existingCustomer } = await admin
    .from('customers')
    .select('id')
    .eq('name', 'Prairie View Farms')
    .maybeSingle()

  let customerId = existingCustomer?.id
  const customerRow = {
    profile_id: customerProfileId,
    name: 'Prairie View Farms',
    contact_name: 'Andrew Prairie',
    email: 'customer.demo@prairieview.ca',
    phone: '204 698 1770',
    location: 'Oakbank, Manitoba',
    region: 'Eastman',
    notes: 'Seasonal service agreement customer. Canola, wheat, soybeans, corn.',
    is_active: true,
  }
  if (customerId) {
    await admin.from('customers').update(customerRow).eq('id', customerId)
  } else {
    const { data, error } = await admin.from('customers').insert(customerRow).select('id').single()
    if (error) throw error
    customerId = data.id
  }
  console.log(`[seed] customer Prairie View Farms -> ${customerId}`)

  // A second customer with no portal login yet (admin-created record).
  const secondRow = {
    profile_id: null,
    name: 'River Bend Golf Club',
    contact_name: 'Grounds Superintendent',
    email: 'grounds@riverbend.ca',
    phone: '204 555 0200',
    location: 'Winnipeg, Manitoba',
    region: 'Winnipeg',
    notes: 'Turf health mapping and spot treatment.',
    is_active: true,
  }
  const { data: existingSecond } = await admin
    .from('customers')
    .select('id')
    .eq('name', 'River Bend Golf Club')
    .maybeSingle()
  if (existingSecond?.id) {
    await admin.from('customers').update(secondRow).eq('id', existingSecond.id)
  } else {
    await admin.from('customers').insert(secondRow)
  }

  // ---- Fields (migrated) ----
  const FIELDS = [
    { key: 'North Canola', crop: 'Canola', acres: 320, location: 'Section 14, Oakbank, Manitoba' },
    { key: 'South Wheat', crop: 'Spring Wheat', acres: 480, location: 'Section 22, Oakbank, Manitoba' },
    { key: 'East Soybean', crop: 'Soybeans', acres: 220, location: 'Section 9, Dugald, Manitoba' },
    { key: 'West Corn', crop: 'Grain Corn', acres: 410, location: 'Section 31, Oakbank, Manitoba' },
    { key: 'Home Quarter', crop: 'Oats', acres: 160, location: '48 Range Road, Oakbank, Manitoba' },
    { key: 'River Flats', crop: 'Barley', acres: 250, location: 'Section 6, Springfield, Manitoba' },
  ]
  const fieldIds = {}
  for (const f of FIELDS) {
    const { data: ex } = await admin
      .from('fields')
      .select('id')
      .eq('customer_id', customerId)
      .eq('name', f.key)
      .maybeSingle()
    const row = { customer_id: customerId, name: f.key, crop: f.crop, acres: f.acres, location: f.location }
    if (ex?.id) {
      await admin.from('fields').update(row).eq('id', ex.id)
      fieldIds[f.key] = ex.id
    } else {
      const { data, error } = await admin.from('fields').insert(row).select('id').single()
      if (error) throw error
      fieldIds[f.key] = data.id
    }
  }
  console.log(`[seed] seeded ${FIELDS.length} fields`)

  // ---- Service requests (the pipeline) ----
  // A spread across the funnel so the admin queue has realistic content.
  const REQUESTS = [
    {
      request_number: 'REQ-1042', source: 'customer_portal', status: 'new',
      contact_name: 'Andrew Prairie', contact_email: 'customer.demo@prairieview.ca', contact_phone: '204 698 1770',
      farm_name: 'Prairie View Farms', service_type: 'Pest Control', crop: 'Grain Corn', acres: 410,
      location: 'Section 31, Oakbank, Manitoba', field: 'West Corn', provides_product: 'no',
      message: 'Seeing corn rootworm pressure on the west quarter. Need an insecticide pass ASAP.',
      submitted_by: customerProfileId,
    },
    {
      request_number: 'REQ-1041', source: 'website', status: 'reviewing',
      contact_name: 'Helen Boyko', contact_email: 'helen@boykoacres.ca', contact_phone: '204 555 0310',
      farm_name: 'Boyko Acres', service_type: 'Field Mapping', crop: 'Canola', acres: 600,
      location: 'Beausejour, Manitoba', provides_product: 'unsure',
      message: 'Interested in NDVI mapping across three quarters before harvest planning.',
    },
    {
      request_number: 'REQ-1040', source: 'website', status: 'quote_sent',
      contact_name: 'Travis Reimer', contact_email: 'treimer@reimerfarms.ca', contact_phone: '204 555 0288',
      farm_name: 'Reimer Farms', service_type: 'Crop Spraying', crop: 'Soybeans', acres: 340,
      location: 'Steinbach, Manitoba', provides_product: 'yes',
      product_details: 'Providing own fungicide (Delaro Complete).',
      message: 'Need a fungicide application within the next two weeks.',
    },
    {
      request_number: 'REQ-1039', source: 'customer_portal', status: 'customer_approved',
      contact_name: 'Andrew Prairie', contact_email: 'customer.demo@prairieview.ca', contact_phone: '204 698 1770',
      farm_name: 'Prairie View Farms', service_type: 'Fertilizer Application', crop: 'Soybeans', acres: 220,
      location: 'Section 9, Dugald, Manitoba', field: 'East Soybean', provides_product: 'no',
      message: 'Approving the liquid nitrogen top-up quote. Please schedule for early September.',
      submitted_by: customerProfileId,
    },
    {
      request_number: 'REQ-1038', source: 'website', status: 'rejected',
      contact_name: 'Curtis Wall', contact_email: 'curtis@wallland.ca', contact_phone: '204 555 0355',
      farm_name: 'Wall Land Co', service_type: 'Crop Spraying', crop: 'Wheat', acres: 90,
      location: 'Brandon, Manitoba', provides_product: 'unsure',
      message: 'Small acreage outside our current service region.',
      internal_notes: 'Outside Eastman service area — referred to partner operator.',
    },
  ]

  const requestIds = {}
  for (const r of REQUESTS) {
    const { field, ...rest } = r
    const row = {
      ...rest,
      customer_id: r.source === 'customer_portal' ? customerId : null,
      field_id: field ? fieldIds[field] ?? null : null,
    }
    const { data: ex } = await admin
      .from('service_requests')
      .select('id')
      .eq('request_number', r.request_number)
      .maybeSingle()
    if (ex?.id) {
      await admin.from('service_requests').update(row).eq('id', ex.id)
      requestIds[r.request_number] = ex.id
    } else {
      const { data, error } = await admin.from('service_requests').insert(row).select('id').single()
      if (error) throw error
      requestIds[r.request_number] = data.id
    }
  }
  console.log(`[seed] seeded ${REQUESTS.length} service requests`)

  // ---- Jobs (migrated from completed / confirmed service orders) ----
  const JOBS = [
    { job_number: 'JOB-0084', status: 'confirmed', service_type: 'Crop Spraying', field: 'North Canola', acres: 320, scheduled_date: '2026-08-19', scheduled_window: '08:00 AM – 12:00 PM', operator: 'operator' },
    { job_number: 'JOB-0086', status: 'scheduled', service_type: 'Fertilizer Application', field: 'East Soybean', acres: 220, scheduled_date: '2026-09-04', scheduled_window: '07:00 AM – 09:00 AM', operator: 'operator' },
    { job_number: 'JOB-0071', status: 'closed', service_type: 'Crop Spraying', field: 'North Canola', acres: 320, scheduled_date: '2026-08-05', scheduled_window: '07:30 AM – 11:30 AM', operator: 'operator' },
    { job_number: 'JOB-0064', status: 'closed', service_type: 'Fertilizer Application', field: 'East Soybean', acres: 220, scheduled_date: '2026-07-28', scheduled_window: '09:00 AM – 11:00 AM', operator: 'operator' },
    { job_number: 'JOB-0052', status: 'closed', service_type: 'Field Mapping', field: 'South Wheat', acres: 480, scheduled_date: '2026-07-23', scheduled_window: '11:00 AM – 01:00 PM', operator: 'operator' },
  ]
  for (const j of JOBS) {
    const row = {
      job_number: j.job_number,
      customer_id: customerId,
      field_id: fieldIds[j.field] ?? null,
      status: j.status,
      service_type: j.service_type,
      scheduled_date: j.scheduled_date,
      scheduled_window: j.scheduled_window,
      operator_id: ids[j.operator] ?? null,
      acres: j.acres,
    }
    const { data: ex } = await admin.from('jobs').select('id').eq('job_number', j.job_number).maybeSingle()
    if (ex?.id) await admin.from('jobs').update(row).eq('id', ex.id)
    else {
      const { error } = await admin.from('jobs').insert(row)
      if (error) throw error
    }
  }
  console.log(`[seed] seeded ${JOBS.length} jobs`)

  // ---- Invoices (migrated) ----
  const INVOICES = [
    { invoice_number: 'INV-2026-1042', status: 'paid', issued_date: '2026-08-05', due_date: '2026-08-19', subtotal: 4480, tax: 224, total: 4704, amount_paid: 4704, items: [{ description: 'Crop Spraying — North Canola (320 ac @ $14/ac)', amount: 4480 }] },
    { invoice_number: 'INV-2026-1051', status: 'outstanding', issued_date: '2026-07-28', due_date: '2026-08-23', subtotal: 2860, tax: 143, total: 3003, amount_paid: 0, items: [{ description: 'Fertilizer Application — East Soybean (220 ac @ $13/ac)', amount: 2860 }] },
    { invoice_number: 'INV-2026-1049', status: 'outstanding', issued_date: '2026-07-23', due_date: '2026-08-23', subtotal: 2400, tax: 120, total: 2520, amount_paid: 1243, items: [{ description: 'Field Mapping — South Wheat (480 ac @ $5/ac)', amount: 2400 }] },
    { invoice_number: 'INV-2026-1033', status: 'paid', issued_date: '2026-06-25', due_date: '2026-07-09', subtotal: 1920, tax: 96, total: 2016, amount_paid: 2016, items: [{ description: 'Crop Spraying — Home Quarter (160 ac @ $12/ac)', amount: 1920 }] },
  ]
  for (const inv of INVOICES) {
    const row = {
      invoice_number: inv.invoice_number,
      customer_id: customerId,
      status: inv.status,
      issued_date: inv.issued_date,
      due_date: inv.due_date,
      subtotal: inv.subtotal,
      tax: inv.tax,
      total: inv.total,
      amount_paid: inv.amount_paid,
      line_items: inv.items,
    }
    const { data: ex } = await admin.from('invoices').select('id').eq('invoice_number', inv.invoice_number).maybeSingle()
    if (ex?.id) await admin.from('invoices').update(row).eq('id', ex.id)
    else {
      const { error } = await admin.from('invoices').insert(row)
      if (error) throw error
    }
  }
  console.log(`[seed] seeded ${INVOICES.length} invoices`)

  console.log('\n[seed] Done. Demo password for all accounts:', DEMO_PASSWORD)
}

main().catch((e) => {
  console.error('[seed] FAILED:', e)
  process.exit(1)
})
