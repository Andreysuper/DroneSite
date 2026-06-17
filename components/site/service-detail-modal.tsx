'use client'

import Image from 'next/image'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Check, X, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from './booking-provider'
import {
  type ServiceDetail,
  SERVICE_DETAILS,
  TRUST_STATS,
} from './services-data'

export function ServiceDetailModal({
  service,
  onOpenChange,
}: {
  service: ServiceDetail | null
  onOpenChange: (open: boolean) => void
}) {
  const { openEstimate, openBooking } = useBooking()
  const open = service !== null

  function handleEstimate() {
    const title = service?.id
    onOpenChange(false)
    // allow the detail modal to close before the estimate dialog opens
    setTimeout(() => openEstimate(title), 120)
  }

  function handleBooking() {
    const title = service?.id
    onOpenChange(false)
    // allow the detail modal to close before the booking dialog opens
    setTimeout(() => openBooking(title), 120)
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => onOpenChange(next)}
    >
      <DialogPrimitive.Portal keepMounted={false}>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-charcoal/70 backdrop-blur-md duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-[1160px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-card text-charcoal shadow-2xl ring-1 ring-charcoal/10 duration-200 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {/* Close button */}
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-20 size-10 rounded-full glass-dark text-cream hover:bg-charcoal/80 hover:text-cream"
              />
            }
          >
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {service && (
            <div className="overflow-y-auto">
              {/* Hero */}
              <div className="relative h-56 w-full sm:h-72 lg:h-80">
                <Image
                  src={service.heroImage || '/placeholder.svg'}
                  alt={service.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/20" />
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 lg:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold backdrop-blur">
                    Service Overview
                  </span>
                  <DialogPrimitive.Title className="mt-3 text-3xl font-semibold tracking-tight text-cream sm:text-4xl lg:text-5xl">
                    {service.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-2 max-w-2xl text-pretty text-base text-cream/85 sm:text-lg">
                    {service.subtitle}
                  </DialogPrimitive.Description>
                </div>
              </div>

              <div className="space-y-12 p-6 sm:p-8 lg:p-10">
                {/* Overview */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
                    Overview
                  </h3>
                  <div className="mt-4 space-y-4 text-pretty text-base leading-relaxed text-muted-foreground">
                    {service.overview.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </section>

                {/* Benefits */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
                    Key Benefits
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {service.benefits.map((b) => (
                      <div
                        key={b.title}
                        className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/60 p-5 transition-colors hover:border-forest/30"
                      >
                        <span className="flex size-11 items-center justify-center rounded-lg bg-forest/10 text-forest">
                          <b.icon className="size-5" aria-hidden />
                        </span>
                        <div>
                          <p className="font-semibold text-charcoal">
                            {b.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {b.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* What we apply + Ideal for */}
                <section className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
                      {service.applyHeading}
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {service.apply.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-charcoal shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
                      Ideal For
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {service.idealFor.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-forest/10 px-4 py-2 text-sm font-medium text-forest"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Comparison */}
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-forest">
                    {service.comparisonHeading}
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border-2 border-forest/30 bg-forest/5 p-6">
                      <p className="font-semibold text-forest">
                        {service.droneLabel}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {service.dronePros.map((p) => (
                          <li
                            key={p}
                            className="flex items-center gap-3 text-sm text-charcoal"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-forest text-cream">
                              <Check className="size-3.5" aria-hidden />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/50 p-6">
                      <p className="font-semibold text-muted-foreground">
                        {service.traditionalLabel}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {service.traditionalCons.map((c) => (
                          <li
                            key={c}
                            className="flex items-center gap-3 text-sm text-muted-foreground"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-muted-foreground">
                              <X className="size-3.5" aria-hidden />
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Trust */}
                <section className="rounded-2xl bg-charcoal p-8 sm:p-10">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {TRUST_STATS.map((t) => (
                      <div key={t.label} className="text-center sm:text-left">
                        <p className="text-balance text-2xl font-bold text-gold sm:text-3xl">
                          {t.value}
                        </p>
                        <p className="mt-1 text-sm text-cream/70">{t.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Bottom CTA */}
                <section className="text-center">
                  <h3 className="text-balance text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
                    {service.ctaHeading}
                  </h3>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      onClick={handleEstimate}
                      className="h-12 bg-gold px-7 text-base font-bold text-accent-foreground shadow-lg shadow-gold/25 transition-all hover:-translate-y-0.5 hover:bg-gold/90"
                    >
                      Get Free Estimate
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleBooking}
                      className="h-12 border-2 border-forest/30 px-7 text-base font-semibold text-forest transition-all hover:-translate-y-0.5 hover:border-forest hover:bg-forest/5"
                    >
                      Book Service
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { SERVICE_DETAILS }
