'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, X } from 'lucide-react'
import { Reveal } from './reveal'

const METRICS = [
  { label: 'Operating cost efficiency', tractor: 45, drone: 92 },
  { label: 'Crop & soil protection', tractor: 30, drone: 98 },
  { label: 'Chemical use efficiency', tractor: 55, drone: 90 },
  { label: 'Deployment speed', tractor: 50, drone: 95 },
  { label: 'Hard-to-reach access', tractor: 25, drone: 96 },
]

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setInView(true), obs.disconnect()),
      { threshold: 0.3 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

export function Comparison() {
  const { ref, inView } = useInView()

  return (
    <section className="bg-charcoal py-24 text-cream sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Drone vs Traditional Equipment
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            A Smarter Way to Treat Every Acre
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-cream/70">
            See how precision drone application compares to a conventional
            tractor sprayer across the metrics that matter most.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/compare-tractor.png"
                alt="Traditional tractor boom sprayer in a field"
                width={800}
                height={500}
                className="h-64 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-cream/60">
                  Traditional
                </p>
                <h3 className="mt-1 text-xl font-semibold">Tractor Sprayer</h3>
                <ul className="mt-3 space-y-1 text-sm text-cream/70">
                  <li className="flex items-center gap-2">
                    <X className="size-4 text-destructive" /> Soil compaction &
                    crop damage
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="size-4 text-destructive" /> Slow, weather-bound
                    setup
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 ring-1 ring-gold/20">
              <Image
                src="/images/compare-drone.png"
                alt="Agricultural drone spraying crops with precision"
                width={800}
                height={500}
                className="h-64 w-full object-cover sm:h-72"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  AgroSkyTech
                </p>
                <h3 className="mt-1 text-xl font-semibold">Precision Drone</h3>
                <ul className="mt-3 space-y-1 text-sm text-cream/80">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-gold" /> Zero soil compaction
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-gold" /> Deploys in minutes,
                    anywhere
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Animated charts */}
        <div
          ref={ref}
          className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div className="space-y-6">
            {METRICS.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-cream/90">{m.label}</span>
                </div>
                <div className="mt-2 grid grid-cols-[3.5rem_1fr] items-center gap-3">
                  <span className="text-xs text-cream/50">Tractor</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cream/40 transition-[width] duration-1000 ease-out"
                      style={{ width: inView ? `${m.tractor}%` : '0%' }}
                    />
                  </div>
                </div>
                <div className="mt-1.5 grid grid-cols-[3.5rem_1fr] items-center gap-3">
                  <span className="text-xs text-gold">Drone</span>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gold transition-[width] duration-1000 ease-out"
                      style={{
                        width: inView ? `${m.drone}%` : '0%',
                        transitionDelay: '150ms',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
