'use client'

import Image from 'next/image'
import {
  ArrowUpRight,
  Bug,
  Droplets,
  Flag,
  Map,
  SprayCan,
  Sprout,
} from 'lucide-react'
import { Reveal } from './reveal'
import { useServiceModal } from './service-modal-provider'

const SERVICES = [
  {
    icon: SprayCan,
    title: 'Crop Spraying',
    text: 'Pesticides, herbicides and fungicides applied with centimetre-level precision.',
    image: '/images/service-spraying.png',
  },
  {
    icon: Sprout,
    title: 'Fertilizer Application',
    text: 'Liquid and granular nutrients spread evenly for stronger, healthier growth.',
    image: '/images/service-fertilizer.png',
  },
  {
    icon: Droplets,
    title: 'Irrigation Services',
    text: 'Targeted water application to stressed zones without flooding the field.',
    image: '/images/service-irrigation.png',
  },
  {
    icon: Flag,
    title: 'Golf Course Treatment',
    text: 'Precision watering and turf management for fairways, greens and roughs.',
    image: '/images/service-golf.png',
  },
  {
    icon: Bug,
    title: 'Pest Control',
    text: 'Fast aerial treatment that responds to outbreaks before they spread.',
    image: '/images/service-pest.png',
  },
  {
    icon: Map,
    title: 'Field Mapping',
    text: 'High-resolution multispectral crop analysis to guide every decision.',
    image: '/images/service-mapping.png',
  },
]

export function Services() {
  const { openService } = useServiceModal()

  return (
    <section id="services" className="bg-secondary py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">
            Our Services
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Full-Service Aerial Application
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            One fleet, one team, every treatment your operation needs — from
            seeding support to in-season crop protection.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal/5">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={s.image || '/placeholder.svg'}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-xl glass-dark text-cream">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-charcoal">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => openService(s.title)}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-forest transition-colors hover:text-gold"
                  >
                    Learn More
                    <ArrowUpRight className="size-4" aria-hidden />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
