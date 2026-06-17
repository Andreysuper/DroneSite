'use client'

import { useEffect, useState } from 'react'
import { Menu, Plane, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBooking } from './booking-provider'

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Results', href: '#results' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function SiteHeader() {
  const { openEstimate } = useBooking()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass-dark border-b border-white/10 py-3'
          : 'bg-transparent py-5',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 text-cream"
          aria-label="AgroSkyTech home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest text-primary-foreground">
            <Plane className="size-5 -rotate-45" aria-hidden />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            AgroSky<span className="text-gold">Tech</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-cream/80 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            onClick={() => openEstimate()}
            className="bg-gold text-accent-foreground hover:bg-gold/90"
          >
            Get Free Estimate
          </Button>
        </div>

        <button
          type="button"
          className="text-cream lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="glass-dark mx-4 mt-3 rounded-xl border border-white/10 p-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-gold"
              >
                {item.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMenuOpen(false)
                openEstimate()
              }}
              className="mt-2 bg-gold text-accent-foreground hover:bg-gold/90"
            >
              Get Free Estimate
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
