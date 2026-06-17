'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CountUp } from './count-up'
import { useBooking } from './booking-provider'

export function Hero() {
  const { openEstimate, openBooking } = useBooking()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-charcoal"
    >
      {/* Background farmland */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.08)` }}
      >
        <Image
          src="/images/hero-drone-spraying-v2.png"
          alt="Agricultural drone spraying lush Canadian crop fields at golden-hour sunrise"
          fill
          priority
          className="object-cover"
        />
        {/* Subtle dark scrim to keep the image bright while lifting contrast */}
        <div className="absolute inset-0 bg-charcoal/25" />
        {/* Focused gradient behind the text column only */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:px-12 lg:pt-28 xl:pl-20">
        <div className="max-w-2xl">
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl drop-shadow-md">
            Professional Drone Services for Agriculture
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-cream/90 drop-shadow-sm">
            Precision spraying, irrigation, fertilization, and crop treatment
            for higher yields and lower operating costs — delivered by our own
            fleet and certified operators.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => openEstimate()}
              className="h-13 bg-gold px-7 text-base font-bold text-accent-foreground shadow-lg shadow-gold/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/35"
            >
              Get Free Estimate
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => openBooking()}
              className="h-13 border-2 border-cream/40 bg-cream/10 px-7 text-base font-semibold text-cream shadow-md backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-cream/60 hover:bg-cream/20 hover:text-cream hover:shadow-lg"
            >
              <CalendarCheck className="size-4" aria-hidden />
              Book Service
            </Button>
          </div>

          {/* Trust metrics */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-8 sm:gap-x-12">
            <div>
              <dt className="sr-only">Acres treated</dt>
              <dd className="whitespace-nowrap text-4xl font-bold tracking-tight text-gold lg:text-5xl">
                <CountUp end={300000} suffix="+" />
              </dd>
              <p className="mt-1.5 text-sm font-medium text-cream/80">
                Acres Treated
              </p>
            </div>
            <div>
              <dt className="sr-only">Service regions</dt>
              <dd className="text-base font-semibold leading-tight text-cream">
                Canada
                <br />
                USA • Europe
              </dd>
              <p className="mt-1.5 text-xs text-cream/60">Service Area</p>
            </div>
            <div>
              <dt className="sr-only">Years experience</dt>
              <dd className="text-2xl font-semibold text-cream">
                <CountUp end={5} suffix="+" separator={false} />
              </dd>
              <p className="mt-1.5 text-xs text-cream/60">Years Experience</p>
            </div>
            <div>
              <dt className="sr-only">Commercial clients</dt>
              <dd className="text-2xl font-semibold text-cream">
                <CountUp end={100} suffix="+" separator={false} />
              </dd>
              <p className="mt-1.5 text-xs text-cream/60">Commercial Clients</p>
            </div>
          </dl>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
