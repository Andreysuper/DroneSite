import { Banknote, Layers, Map, Zap } from 'lucide-react'
import { Reveal } from './reveal'

const BENEFITS = [
  {
    icon: Banknote,
    title: 'Save Money',
    text: 'Reduce operational costs compared to traditional ground-based methods and equipment.',
  },
  {
    icon: Layers,
    title: 'No Soil Compaction',
    text: 'Protect crops and soil structure from the damage caused by heavy machinery.',
  },
  {
    icon: Map,
    title: 'Access Difficult Areas',
    text: 'Treat wet fields, hillsides, tree lines and golf courses that ground rigs cannot reach.',
  },
  {
    icon: Zap,
    title: 'Fast Deployment',
    text: 'Cover large areas in hours instead of days, with minimal setup time on site.',
  },
]

export function WhyUs() {
  return (
    <section id="about" className="bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">
            Why AgroSkyTech
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Why Farmers Choose AgroSkyTech
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            We combine certified pilots, RTK-precision drones and agronomic
            know-how to deliver results that protect both your crops and your
            margins.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 90}>
              <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl hover:shadow-forest/5">
                <span className="flex size-12 items-center justify-center rounded-xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-primary-foreground">
                  <b.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-charcoal">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
