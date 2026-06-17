'use client'

import { Quote, Star } from 'lucide-react'
import { Reveal } from './reveal'

const TESTIMONIALS = [
  {
    quote:
      'AgroSkyTech sprayed 1,200 acres of canola in two days during a wet stretch when our ground rig could not even get in the field. Yields were up and we saved on chemical.',
    name: 'Daniel Reimer',
    role: 'Grain Farmer, Steinbach MB',
  },
  {
    quote:
      'Turf health on our fairways has never been more consistent. The precision they get on greens and slopes is something our old equipment simply could not match.',
    name: 'Karen Whitfield',
    role: 'Course Superintendent, Assiniboine Golf Club',
  },
  {
    quote:
      'As an agribusiness managing thousands of acres for clients, reliability matters. Their reporting and turnaround are genuinely best-in-class.',
    name: 'Marcus Lefebvre',
    role: 'Operations Director, Prairie AgriGroup',
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">
            Client Stories
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Trusted by Operators Across the Country
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 110}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <Quote className="size-8 text-forest/25" aria-hidden />
                <div
                  className="mt-3 flex gap-0.5 text-gold"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-charcoal-soft">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-charcoal">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
