'use client'

import Image from 'next/image'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from './reveal'
import { useBooking } from './booking-provider'

export function FinalCta() {
  const { openEstimate, openBooking } = useBooking()
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <Image
        src="/images/cta-sunset.png"
        alt=""
        fill
        aria-hidden
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40" />

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center text-cream sm:px-6">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Ready to Upgrade Your Operation?
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-cream/80">
          Join the farms, courses and municipalities trusting AgroSkyTech for
          faster, cleaner, more profitable treatment.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={() => openEstimate()}
            className="bg-gold text-accent-foreground hover:bg-gold/90"
          >
            Get Free Estimate
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => openBooking()}
            className="border-cream/30 bg-white/5 text-cream backdrop-blur hover:bg-white/10 hover:text-cream"
          >
            <CalendarCheck className="size-4" aria-hidden />
            Book Service
          </Button>
        </div>
      </Reveal>
    </section>
  )
}
