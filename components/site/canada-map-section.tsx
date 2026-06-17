'use client'

import { useState } from 'react'
import { CheckCircle2, MapPin } from 'lucide-react'
import type { CanadaMap } from '@/lib/canada-map'
import { Reveal } from './reveal'

const HIGHLIGHTED: Record<string, string> = {
  Manitoba: 'Headquarters — Winnipeg',
  Saskatchewan: 'Active service region',
  Alberta: 'Active service region',
  Ontario: 'Active service region',
}

const REGIONS = ['Manitoba', 'Saskatchewan', 'Alberta', 'Ontario']

export function CanadaMapSection({ map }: { map: CanadaMap }) {
  const [active, setActive] = useState<string | null>('Manitoba')

  return (
    <section id="contact" className="bg-secondary py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-forest">
              Where We Operate
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
              Serving Farms From Coast to Coast
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Based in Winnipeg, Manitoba, our crews deploy across the Prairies
              and Ontario — and travel for large contracts throughout Canada,
              the USA and Europe.
            </p>

            <ul className="mt-8 space-y-3">
              {REGIONS.map((r) => (
                <li
                  key={r}
                  onMouseEnter={() => setActive(r)}
                  className={`flex cursor-default items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                    active === r
                      ? 'border-forest/40 bg-forest/10'
                      : 'border-border bg-card'
                  }`}
                >
                  <span className="flex items-center gap-3 font-medium text-charcoal">
                    <CheckCircle2 className="size-5 text-forest" aria-hidden />
                    {r}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {HIGHLIGHTED[r]}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-medium text-primary-foreground">
              <MapPin className="size-4" aria-hidden />
              Available across Canada
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative rounded-2xl border border-border bg-card p-4">
              <svg
                viewBox={`0 0 ${map.width} ${map.height}`}
                className="h-auto w-full"
                role="img"
                aria-label="Map of Canada highlighting AgroSkyTech service regions"
              >
                {map.provinces.map((p) => {
                  const isHighlighted = p.name in HIGHLIGHTED
                  const isActive = active === p.name
                  return (
                    <path
                      key={p.name}
                      d={p.d}
                      onMouseEnter={() =>
                        isHighlighted && setActive(p.name)
                      }
                      className="transition-colors duration-300"
                      style={{
                        fill: isActive
                          ? 'var(--gold)'
                          : isHighlighted
                            ? 'var(--forest)'
                            : 'var(--muted)',
                        stroke: 'var(--card)',
                        strokeWidth: 1,
                        cursor: isHighlighted ? 'pointer' : 'default',
                      }}
                    >
                      <title>{p.name}</title>
                    </path>
                  )
                })}
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
