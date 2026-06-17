import Image from 'next/image'
import { Cpu, Plane, Truck, UserCheck } from 'lucide-react'
import { Reveal } from './reveal'

const SPECS = [
  {
    icon: Plane,
    title: 'DJI Agras-Class Drones',
    text: 'High-capacity spray tanks and spreaders for fast, even coverage.',
  },
  {
    icon: Cpu,
    title: 'RTK Precision Systems',
    text: 'Centimetre-level positioning for repeatable, accurate flight lines.',
  },
  {
    icon: Truck,
    title: 'Support Vehicles',
    text: 'Pickup-and-trailer rigs carry batteries, mix stations and spares.',
  },
  {
    icon: UserCheck,
    title: 'Certified Operators',
    text: 'Licensed pilots trained in agronomy and Transport Canada compliance.',
  },
]

export function Fleet() {
  return (
    <section className="bg-charcoal py-24 text-cream sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Our Fleet
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Professional Equipment for Professional Results
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-cream/70">
              We own and maintain a complete field-ready operation — aircraft,
              positioning systems, transport and the people who run them — so
              every job is delivered to commercial standards.
            </p>

            <dl className="mt-10 grid gap-6 sm:grid-cols-2">
              {SPECS.map((s) => (
                <div key={s.title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <dt className="font-semibold">{s.title}</dt>
                    <dd className="mt-1 text-sm text-cream/65">{s.text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/fleet-setup.png"
                alt="Drone operations setup with support truck and trailer in the field"
                width={800}
                height={500}
                className="h-56 w-full object-cover sm:h-64"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/fleet-drone.png"
                alt="Close-up of an agricultural spraying drone on a landing pad"
                width={400}
                height={400}
                className="h-44 w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/fleet-operator.png"
                alt="Certified drone operator with a control tablet in the field"
                width={400}
                height={400}
                className="h-44 w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
