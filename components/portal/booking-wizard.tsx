'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FieldMapView } from '@/components/portal/field-map'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Field, ServiceKind } from '@/lib/portal/types'
import { CURRENCY } from '@/lib/portal/demo-data'

const STEPS = [
  'Service',
  'Field',
  'Timing',
  'Details',
  'Review',
] as const

const SERVICE_KINDS: {
  kind: ServiceKind
  blurb: string
  ratePerAcre: number
}[] = [
  {
    kind: 'Crop Spraying',
    blurb: 'Herbicide, fungicide and desiccant application.',
    ratePerAcre: 13,
  },
  {
    kind: 'Fertilizer Application',
    blurb: 'Liquid or granular nutrient application.',
    ratePerAcre: 13,
  },
  {
    kind: 'Irrigation / Water Application',
    blurb: 'Targeted water application for stressed zones.',
    ratePerAcre: 11,
  },
  {
    kind: 'Pest Control',
    blurb: 'Insecticide and targeted pest suppression.',
    ratePerAcre: 14,
  },
  {
    kind: 'Golf Course Service',
    blurb: 'Fairway, green and rough turf treatment.',
    ratePerAcre: 22,
  },
  {
    kind: 'Field Mapping',
    blurb: 'NDVI, crop health and prescription mapping.',
    ratePerAcre: 6,
  },
]

const URGENCY = [
  'Standard (within 2 weeks)',
  'Priority (within 1 week)',
  'Urgent (48 hours)',
] as const

const TIME_WINDOWS = [
  'Early morning (5am - 9am)',
  'Morning (9am - 12pm)',
  'Afternoon (12pm - 5pm)',
  'Evening (5pm - dusk)',
  'Operator discretion',
] as const

export function BookingWizard({ fields }: { fields: Field[] }) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [reference, setReference] = useState<string | null>(null)

  // Step 1
  const [kind, setKind] = useState<ServiceKind | null>(null)
  // Step 2
  const [fieldId, setFieldId] = useState<string>('')
  const [partialAcres, setPartialAcres] = useState('')
  // Step 3
  const [preferredDate, setPreferredDate] = useState('')
  const [alternateDate, setAlternateDate] = useState('')
  const [timeWindow, setTimeWindow] = useState<string>(TIME_WINDOWS[0])
  const [urgency, setUrgency] = useState<string>(URGENCY[0])
  // Step 4
  const [product, setProduct] = useState('')
  const [rate, setRate] = useState('')
  const [suppliedBy, setSuppliedBy] = useState('AgroSkyTech supplies product')
  const [notes, setNotes] = useState('')
  const [confirmAccurate, setConfirmAccurate] = useState(false)

  const field = fields.find((f) => f.id === fieldId) ?? null
  const selected = SERVICE_KINDS.find((s) => s.kind === kind) ?? null

  const billableAcres = useMemo(() => {
    const partial = Number(partialAcres)
    if (partialAcres.trim() && Number.isFinite(partial) && partial > 0) {
      return Math.min(partial, field?.acres ?? partial)
    }
    return field?.acres ?? 0
  }, [partialAcres, field])

  const estimate = useMemo(() => {
    if (!selected || !billableAcres) return null
    const base = billableAcres * selected.ratePerAcre
    const rush = urgency === URGENCY[2] ? base * 0.15 : 0
    return { base, rush, total: base + rush }
  }, [selected, billableAcres, urgency])

  const canAdvance = (() => {
    if (step === 0) return Boolean(kind)
    if (step === 1) return Boolean(fieldId)
    if (step === 2) return Boolean(preferredDate)
    if (step === 3) return Boolean(product.trim()) && confirmAccurate
    return true
  })()

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/portal/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          fieldName: field?.name,
          fieldAddress: field?.address,
          acres: billableAcres,
          preferredDate,
          alternateDate,
          timeWindow,
          urgency,
          product,
          rate,
          suppliedBy,
          notes,
          estimate: estimate?.total ?? null,
        }),
      })
      const data = (await res.json()) as { reference?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Unable to submit request.')
      setReference(data.reference ?? 'AST-PENDING')
      toast.success('Service request submitted')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Unable to submit request.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (reference) {
    return (
      <Card className="mx-auto max-w-2xl border-border/60 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest/10 text-forest">
          <CircleCheck className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">
          Request submitted
        </h2>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Your service request has been received. Our operations team will
          review field conditions and confirm scheduling within one business
          day.
        </p>
        <dl className="mt-6 flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/40 p-5 text-left">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Reference</dt>
            <dd className="font-mono text-sm font-semibold">{reference}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Service</dt>
            <dd className="text-sm font-medium">{kind}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Field</dt>
            <dd className="text-sm font-medium">{field?.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="text-sm font-medium text-forest">
              Pending confirmation
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button nativeButton={false} render={<Link href="/portal/services" />}>
            View my services
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/portal" />}>
            Back to dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1">
        {/* Stepper */}
        <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-3">
          {STEPS.map((label, i) => {
            const done = i < step
            const active = i === step
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                    done && 'bg-forest text-primary-foreground',
                    active && 'bg-gold text-accent-foreground',
                    !done && !active && 'bg-muted text-muted-foreground',
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className="mx-1 hidden h-px w-6 bg-border sm:block"
                    aria-hidden
                  />
                )}
              </li>
            )
          })}
        </ol>

        <Card className="border-border/60 p-6">
          {step === 0 && (
            <fieldset className="flex flex-col gap-4">
              <legend className="text-lg font-semibold tracking-tight">
                What service do you need?
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_KINDS.map((s) => (
                  <button
                    key={s.kind}
                    type="button"
                    onClick={() => setKind(s.kind)}
                    aria-pressed={kind === s.kind}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all duration-200',
                      kind === s.kind
                        ? 'border-forest bg-forest/5 ring-1 ring-forest/30'
                        : 'border-border/60 hover:border-forest/40 hover:bg-muted/40',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{s.kind}</span>
                      {kind === s.kind && (
                        <Check className="size-4 text-forest" aria-hidden />
                      )}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {s.blurb}
                    </span>
                    <span className="mt-2 block text-xs font-medium text-forest">
                      from {CURRENCY.format(s.ratePerAcre)}/acre
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="flex flex-col gap-4">
              <legend className="text-lg font-semibold tracking-tight">
                Which field?
              </legend>
              <div className="flex flex-col gap-3">
                {fields.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFieldId(f.id)}
                    aria-pressed={fieldId === f.id}
                    className={cn(
                      'flex items-center gap-4 rounded-xl border p-3 text-left transition-all duration-200',
                      fieldId === f.id
                        ? 'border-forest bg-forest/5 ring-1 ring-forest/30'
                        : 'border-border/60 hover:border-forest/40 hover:bg-muted/40',
                    )}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <FieldMapView variant={f.mapImage} seed={f.id} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{f.name}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{f.address}</span>
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {f.acres} acres · {f.cropType}
                      </span>
                    </span>
                    {fieldId === f.id && (
                      <Check className="size-5 shrink-0 text-forest" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="partialAcres">
                  Treat only part of the field? (optional)
                </Label>
                <Input
                  id="partialAcres"
                  type="number"
                  min="1"
                  max={field?.acres}
                  value={partialAcres}
                  onChange={(e) => setPartialAcres(e.target.value)}
                  placeholder={
                    field ? `Full field is ${field.acres} acres` : 'Acres'
                  }
                />
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="text-lg font-semibold tracking-tight">
                When would you like the work done?
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="preferredDate">Preferred date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="alternateDate">
                    Alternate date (optional)
                  </Label>
                  <Input
                    id="alternateDate"
                    type="date"
                    value={alternateDate}
                    onChange={(e) => setAlternateDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="timeWindow">Preferred time window</Label>
                <Select value={timeWindow} onValueChange={setTimeWindow}>
                  <SelectTrigger id="timeWindow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_WINDOWS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Urgent requests carry a 15% priority surcharge and depend on
                  operator availability.
                </p>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="flex flex-col gap-5">
              <legend className="text-lg font-semibold tracking-tight">
                Product and application details
              </legend>
              <div className="flex flex-col gap-2">
                <Label htmlFor="product">Product / treatment</Label>
                <Input
                  id="product"
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Liberty 150 SN herbicide"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rate">Application rate (optional)</Label>
                  <Input
                    id="rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 1.35 L/ac"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="suppliedBy">Product supplied by</Label>
                  <Select value={suppliedBy} onValueChange={setSuppliedBy}>
                    <SelectTrigger id="suppliedBy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AgroSkyTech supplies product">
                        AgroSkyTech supplies product
                      </SelectItem>
                      <SelectItem value="I supply the product">
                        I supply the product
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">
                  Field conditions and access notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hazards, power lines, beehives, gate codes, adjacent sensitive crops..."
                />
              </div>
              <label className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-4">
                <Checkbox
                  checked={confirmAccurate}
                  onCheckedChange={(v) => setConfirmAccurate(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  I confirm the field and product information above is accurate
                  and that I hold any permits required for this application.
                </span>
              </label>
            </fieldset>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold tracking-tight">
                Review your request
              </h2>
              <dl className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
                {[
                  ['Service', kind],
                  ['Field', field ? `${field.name} — ${field.address}` : '—'],
                  ['Acres to treat', `${billableAcres} acres`],
                  ['Preferred date', preferredDate || '—'],
                  ['Alternate date', alternateDate || 'Not provided'],
                  ['Time window', timeWindow],
                  ['Urgency', urgency],
                  ['Product', product || '—'],
                  ['Application rate', rate || 'Operator recommendation'],
                  ['Supplied by', suppliedBy],
                  ['Notes', notes || 'None'],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium sm:max-w-md sm:text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Submitting this request does not confirm the booking. Our
                operations team will review weather windows and operator
                availability, then confirm your scheduled date.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
              >
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {submitting ? 'Submitting...' : 'Submit request'}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Live estimate */}
      <Card className="border-border/60 p-5 lg:w-80 lg:shrink-0">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="size-4 text-gold" aria-hidden />
          Estimated cost
        </h2>
        {estimate ? (
          <>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {CURRENCY.format(estimate.total)}
            </p>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">
                  {billableAcres} ac × {CURRENCY.format(selected!.ratePerAcre)}
                </dt>
                <dd>{CURRENCY.format(estimate.base)}</dd>
              </div>
              {estimate.rush > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Priority surcharge</dt>
                  <dd>{CURRENCY.format(estimate.rush)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Estimate only. Final pricing is confirmed after our team reviews
              field conditions, product cost and access.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Select a service and field to see a live cost estimate.
          </p>
        )}
      </Card>
    </div>
  )
}
