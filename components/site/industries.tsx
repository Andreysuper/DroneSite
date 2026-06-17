import Image from 'next/image'
import { Reveal } from './reveal'

const INDUSTRIES = [
  {
    title: 'Agriculture',
    text: 'Row crops, cereals and oilseeds at scale.',
    image: '/images/industry-agriculture.png',
  },
  {
    title: 'Golf Courses',
    text: 'Turf health, watering and treatment.',
    image: '/images/industry-golf.png',
  },
  {
    title: 'Forestry',
    text: 'Reforestation support and canopy treatment.',
    image: '/images/industry-forestry.png',
  },
  {
    title: 'Municipalities',
    text: 'Parks, sports fields and public green space.',
    image: '/images/industry-municipal.png',
  },
  {
    title: 'Industrial Properties',
    text: 'Vegetation control on large sites.',
    image: '/images/industry-industrial.png',
  },
  {
    title: 'Land Management',
    text: 'Acreage, wetlands and conservation land.',
    image: '/images/industry-land.png',
  },
]

export function Industries() {
  return (
    <section id="industries" className="bg-secondary py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-forest">
            Industries We Serve
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            Trusted Across Sectors
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Wherever there is ground to treat, our fleet delivers precise,
            efficient coverage.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 90}>
              <article className="group relative h-64 overflow-hidden rounded-2xl">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 max-h-0 overflow-hidden text-sm text-cream/80 opacity-0 transition-all duration-300 group-hover:max-h-16 group-hover:opacity-100">
                    {item.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
