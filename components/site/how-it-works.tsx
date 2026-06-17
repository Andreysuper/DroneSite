'use client'

import { ClipboardList, FileBarChart, Plane, Search } from 'lucide-react'
import { Reveal } from './reveal'

const STEPS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Request Estimate',
    text: 'Share your field details and goals. We respond within one business day with a free, tailored estimate.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Site Assessment',
    text: 'We map your terrain, crops and access points to build a precise, compliant flight plan.',
  },
  {
    icon: Plane,
    step: '03',
    title: 'Drone Operation',
    text: 'Certified pilots deploy our RTK fleet, applying treatment exactly where it is needed.',
  },
  {
    icon: FileBarChart,
    step: '04',
    title: 'Report & Results',
    text: 'You receive a detailed coverage report with maps, volumes and recommendations.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            From Estimate to Results in Four Steps
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A straightforward, transparent process designed around your season
            and your fields.
          </p>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            className="absolute left-0 top-7 hidden h-px w-full bg-border lg:block"
            aria-hidden
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 120} className="relative">
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-primary-foreground shadow-lg shadow-forest/20">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <span className="text-3xl font-semibold text-border lg:mt-4">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-charcoal">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
