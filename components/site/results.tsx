import Image from 'next/image'
import { CountUp } from './count-up'
import { Reveal } from './reveal'

export function Results() {
  return (
    <section id="results" className="relative overflow-hidden py-28 sm:py-32">
      <Image
        src="/images/results-bg.png"
        alt=""
        fill
        aria-hidden
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/90" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/60" />

      <div className="relative mx-auto max-w-7xl px-4 text-center text-cream sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Proven Results at Scale
          </p>
          <h2 className="mt-4 text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            <CountUp end={300000} suffix="+" />
          </h2>
          <p className="mt-2 text-lg text-cream/80">
            Acres treated across Canada, the USA and Europe
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          <Reveal delay={80}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="text-4xl font-semibold text-gold">
                <CountUp end={95} suffix="%" separator={false} />
              </p>
              <p className="mt-2 text-sm text-cream/70">
                Customer Satisfaction
              </p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="text-4xl font-semibold text-gold">
                <CountUp end={100} suffix="+" separator={false} />
              </p>
              <p className="mt-2 text-sm text-cream/70">Commercial Clients</p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="text-4xl font-semibold text-gold">
                <CountUp end={5000} suffix="+" />
              </p>
              <p className="mt-2 text-sm text-cream/70">
                Successful Missions Flown
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
