'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { useServiceModal } from './service-modal-provider'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from '@/lib/contact'

const SERVICE_LINKS = [
  'Crop Spraying',
  'Fertilizer Application',
  'Irrigation Services',
  'Golf Course Treatment',
  'Pest Control',
  'Field Mapping',
]

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 1.88 6.48 1.88 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.78v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6Zm0 8.74a3.44 3.44 0 1 1 0-6.88 3.44 3.44 0 0 1 0 6.88Zm6.74-8.94a1.24 1.24 0 1 1-2.48 0 1.24 1.24 0 0 1 2.48 0Z" />
    </svg>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.1v12.4a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.47V9.66a5.7 5.7 0 0 0-.8-.06A5.7 5.7 0 0 0 4.14 15.3 5.7 5.7 0 0 0 9.84 21a5.7 5.7 0 0 0 5.7-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.28a4.28 4.28 0 0 1-3.24-1.46Z" />
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 11v2.8h4.65c-.2 1.2-1.42 3.52-4.65 3.52-2.8 0-5.08-2.32-5.08-5.18S9.2 6.96 12 6.96c1.59 0 2.66.68 3.27 1.26l2.23-2.15C16.06 4.7 14.22 3.9 12 3.9 7.5 3.9 3.86 7.54 3.86 12.04S7.5 20.18 12 20.18c4.65 0 7.73-3.27 7.73-7.87 0-.53-.06-.93-.13-1.33H12Z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'Facebook', href: '#', Icon: FacebookIcon },
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'TikTok', href: '#', Icon: TikTokIcon },
  { label: 'Google Business Profile', href: '#', Icon: GoogleIcon },
]

export function SiteFooter() {
  const { openService } = useServiceModal()

  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand + socials */}
          <div className="lg:col-span-2 lg:max-w-sm">
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight">
                <span className="font-normal text-cream">AGRO</span>
                <span className="text-cream">SKY</span>
                <span className="text-gold">TECH</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Professional agricultural drone services delivering precision,
              speed and results across Canada, the USA and Europe.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold hover:text-accent-foreground hover:shadow-lg hover:shadow-gold/25"
                >
                  <Icon className="size-4 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    onClick={() => openService(link)}
                    className="text-left text-sm text-cream/70 transition-colors hover:text-cream"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-gold"
                  aria-hidden
                />
                Winnipeg, Manitoba, Canada
              </li>
              <li>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="flex items-center gap-3 transition-colors hover:text-cream"
                >
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 transition-colors hover:text-cream"
                >
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden />
                  {CONTACT_EMAIL}
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
