'use client'

import { useState } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { toast } from 'sonner'
import { Upload, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitBooking } from '@/lib/contact'

const SERVICE_TYPES = [
  'Crop Spraying',
  'Fertilizer Application',
  'Irrigation / Water Spraying',
  'Pest Control',
  'Golf Course Service',
  'Field Mapping',
  'Other',
]

const TREATMENT_TARGETS = [
  'Crop Field',
  'Golf Course',
  'Trees',
  'Pasture',
  'Yard / Property',
  'Industrial Land',
  'Other',
]

const SURFACE_TYPES = [
  'Canola',
  'Wheat',
  'Corn',
  'Soybeans',
  'Sunflowers',
  'Grass / Turf',
  'Trees',
  'Other',
]

const PRODUCT_TYPES = [
  'Herbicide',
  'Fungicide',
  'Insecticide',
  'Liquid Fertilizer',
  'Granular Fertilizer',
  'Water',
  'Foliar Nutrients',
  'Pest Control Product',
  'Other',
]

const CONDITIONS = [
  'Wet field',
  'Difficult terrain',
  'Near trees / obstacles',
  'Near buildings',
  'Near water',
  'Power lines nearby',
  'Livestock nearby',
  'None / not sure',
]

const URGENCY = [
  'Flexible',
  'Within 7 days',
  'As soon as possible',
  'Emergency treatment',
]

function SectionHeading({
  step,
  title,
}: {
  step: number
  title: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-primary-foreground">
        {step}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
        {title}
      </h3>
    </div>
  )
}

function CheckboxGrid({
  name,
  options,
}: {
  name: string
  options: string[]
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const id = `${name}-${opt}`
        return (
          <label
            key={opt}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-charcoal transition-colors hover:border-forest/40 has-[[data-checked]]:border-forest has-[[data-checked]]:bg-forest/5"
          >
            <Checkbox id={id} name={name} value={opt} />
            <span>{opt}</span>
          </label>
        )
      })}
    </div>
  )
}

export function BookServiceModal({
  open,
  onOpenChange,
  initialService,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialService?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [serviceType, setServiceType] = useState<string>(
    initialService && SERVICE_TYPES.includes(initialService)
      ? initialService
      : 'Crop Spraying',
  )
  const [surfaceType, setSurfaceType] = useState<string>('Canola')
  const [urgency, setUrgency] = useState<string>('Flexible')
  const [provideProduct, setProvideProduct] = useState<string>(
    'advise',
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setSubmitting(true)
    try {
      const formData = new FormData(form)
      // Ensure controlled selects/radios are included.
      formData.set('serviceType', serviceType)
      formData.set('surfaceType', surfaceType)
      formData.set('urgency', urgency)
      formData.set('provideProduct', provideProduct)
      await submitBooking(formData)
      onOpenChange(false)
      form.reset()
      toast.success('Thank you. Your booking request has been submitted.')
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Unable to send request. Please try again later.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal keepMounted={false}>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-md duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[94vh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-card text-charcoal shadow-2xl ring-1 ring-charcoal/10 duration-200 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {/* Header */}
          <div className="relative shrink-0 border-b border-border bg-charcoal px-6 py-6 sm:px-8">
            <DialogPrimitive.Title className="text-2xl font-semibold tracking-tight text-cream">
              Book Drone Service
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-cream/75">
              Tell us what needs to be treated and our team will confirm
              availability, product requirements, and service details.
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 size-9 rounded-full text-cream/80 hover:bg-white/10 hover:text-cream"
                />
              }
            >
              <XIcon className="size-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto">
            <div className="space-y-9 p-6 sm:p-8">
              {/* 1. Contact */}
              <section className="space-y-4">
                <SectionHeading step={1} title="Contact Information" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-name">
                      Full Name <span className="text-forest">*</span>
                    </Label>
                    <Input id="bk-name" name="name" required placeholder="Jane Doe" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-company">Company / Farm Name</Label>
                    <Input
                      id="bk-company"
                      name="company"
                      placeholder="Prairie Acres Ltd."
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-phone">
                      Phone Number <span className="text-forest">*</span>
                    </Label>
                    <Input
                      id="bk-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="123456789"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-email">Email</Label>
                    <Input
                      id="bk-email"
                      name="email"
                      type="email"
                      placeholder="jane@farm.ca"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Service Type */}
              <section className="space-y-4">
                <SectionHeading step={2} title="Service Type" />
                <div className="grid gap-1.5">
                  <Label htmlFor="bk-service">
                    Service needed <span className="text-forest">*</span>
                  </Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="bk-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* 3. What needs to be treated */}
              <section className="space-y-4">
                <SectionHeading step={3} title="What needs to be treated?" />
                <CheckboxGrid name="treatmentTargets" options={TREATMENT_TARGETS} />
              </section>

              {/* 4. Crop / Surface Type */}
              <section className="space-y-4">
                <SectionHeading step={4} title="Crop / Surface Type" />
                <div className="grid gap-1.5 sm:max-w-sm">
                  <Label htmlFor="bk-surface">Primary surface</Label>
                  <Select value={surfaceType} onValueChange={setSurfaceType}>
                    <SelectTrigger id="bk-surface">
                      <SelectValue placeholder="Select surface type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SURFACE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* 5. Treatment Product */}
              <section className="space-y-4">
                <SectionHeading step={5} title="Treatment Product" />
                <p className="text-sm text-muted-foreground">
                  Will you provide the chemical / fertilizer / treatment product?
                </p>
                <RadioGroup
                  value={provideProduct}
                  onValueChange={setProvideProduct}
                  name="provideProduct"
                  className="gap-2.5"
                >
                  {[
                    { v: 'yes', l: 'Yes, I will provide the product' },
                    { v: 'advise', l: 'No, I need AgroSkyTech to advise' },
                    { v: 'unsure', l: 'Not sure yet' },
                  ].map((o) => (
                    <label
                      key={o.v}
                      htmlFor={`pp-${o.v}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 text-sm text-charcoal transition-colors hover:border-forest/40 has-[[data-checked]]:border-forest has-[[data-checked]]:bg-forest/5"
                    >
                      <RadioGroupItem id={`pp-${o.v}`} value={o.v} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </section>

              {/* 6. Product Type Needed */}
              <section className="space-y-4">
                <SectionHeading step={6} title="Product Type Needed" />
                <CheckboxGrid name="productTypes" options={PRODUCT_TYPES} />
              </section>

              {/* 7. Field / Area Details */}
              <section className="space-y-4">
                <SectionHeading step={7} title="Field / Area Details" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-size">
                      Field Size (acres) <span className="text-forest">*</span>
                    </Label>
                    <Input
                      id="bk-size"
                      name="fieldSize"
                      required
                      placeholder="e.g. 320"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-city">
                      Location / City <span className="text-forest">*</span>
                    </Label>
                    <Input
                      id="bk-city"
                      name="city"
                      required
                      placeholder="Brandon, MB"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-address">Exact Address or GPS Pin</Label>
                    <Input
                      id="bk-address"
                      name="address"
                      placeholder="123 Range Rd / 49.84, -99.95"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-access">Access Notes</Label>
                    <Input
                      id="bk-access"
                      name="accessNotes"
                      placeholder="Gate code, entry point, etc."
                    />
                  </div>
                </div>
              </section>

              {/* 8. Timing */}
              <section className="space-y-4">
                <SectionHeading step={8} title="Timing" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-date">
                      Preferred Service Date{' '}
                      <span className="text-forest">*</span>
                    </Label>
                    <Input id="bk-date" name="date" type="date" required />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bk-urgency">Urgency</Label>
                    <Select value={urgency} onValueChange={setUrgency}>
                      <SelectTrigger id="bk-urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* 9. Conditions */}
              <section className="space-y-4">
                <SectionHeading step={9} title="Field Conditions" />
                <CheckboxGrid name="conditions" options={CONDITIONS} />
              </section>

              {/* 10. Additional Information */}
              <section className="space-y-4">
                <SectionHeading step={10} title="Additional Information" />
                <Textarea
                  name="additionalInfo"
                  rows={4}
                  placeholder="Tell us about the problem, crop condition, pest issue, fertilizer plan, water need, or any special instructions."
                />
              </section>

              {/* 11. File Upload */}
              <section className="space-y-4">
                <SectionHeading step={11} title="Attachments (optional)" />
                <label
                  htmlFor="bk-files"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/50 px-4 py-8 text-center transition-colors hover:border-forest/40 hover:bg-forest/5"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-forest/10 text-forest">
                    <Upload className="size-5" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-charcoal">
                    Field map, photo, spray plan, product label, or prescription
                    map
                  </span>
                  <span className="text-xs text-muted-foreground">
                    You can also email maps, photos or product labels to{' '}
                    hello@agroskytech.ca after submission.
                  </span>
                  <input
                    id="bk-files"
                    name="files"
                    type="file"
                    multiple
                    className="sr-only"
                  />
                </label>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-border bg-card/95 px-6 py-4 backdrop-blur sm:px-8">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-forest text-primary-foreground hover:bg-forest-deep"
              >
                {submitting ? 'Submitting…' : 'Submit Booking Request'}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Fields marked <span className="text-forest">*</span> are
                required. Our operations team typically responds within one
                business day.
              </p>
            </div>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
