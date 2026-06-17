import { Camera, Globe, Mail, MapPin, Phone, Users, Video } from 'lucide-react'
import { LogoMark } from './logo-mark'

const COLUMNS = [
  {
    title: 'Services',
    links: [
      'Crop Spraying',
      'Fertilizer Application',
      'Irrigation Services',
      'Golf Course Treatment',
      'Pest Control',
      'Field Mapping',
    ],
  },
  {
    title: 'Industries',
    links: [
      'Agriculture',
      'Golf Courses',
      'Forestry',
      'Municipalities',
      'Industrial Properties',
      'Land Management',
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-10" />
              <span className="text-lg font-semibold">
                AgroSky<span className="text-gold">Tech</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Professional agricultural drone services delivering precision,
              speed and results across Canada, the USA and Europe.
            </p>
            <div className="mt-5 flex gap-3">
              {[Users, Camera, Globe, Video].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-cream/80 transition-colors hover:bg-gold hover:text-accent-foreground"
                  aria-label="AgroSkyTech social media"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#services"
                      className="text-sm text-cream/70 transition-colors hover:text-cream"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                Winnipeg, Manitoba, Canada
              </li>
              <li>
                <a
                  href="tel:+12045550142"
                  className="flex items-center gap-3 transition-colors hover:text-cream"
                >
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden />
                  (204) 555-0142
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@agroskytech.ca"
                  className="flex items-center gap-3 transition-colors hover:text-cream"
                >
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden />
                  hello@agroskytech.ca
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} AgroSkyTech. All rights reserved.</p>
          <p>Precision Agriculture • Canada • USA • Europe</p>
        </div>
      </div>
    </footer>
  )
}
