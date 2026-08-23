'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Menu, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBooking } from './booking-provider'
import { ClientLoginModal } from './client-login-modal'

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
  const [loginOpen, setLoginOpen] = useState(false)

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
          ? 'glass-dark border-b border-white/10 py-3.5'
          : 'bg-transparent py-6',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-cream"
          aria-label="AgroSkyTech home"
        >
          <span className="text-2xl font-bold tracking-tight">
            <span className="font-normal text-cream">AGRO</span>
            <span className="text-cream">SKY</span>
            <span className="text-gold">TECH</span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.95rem] font-medium text-cream/85 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLoginOpen(true)}
            className="h-12 rounded-full border-cream/35 bg-transparent px-6 text-[0.95rem] font-semibold text-cream transition-all duration-200 hover:border-gold/60 hover:bg-cream/10 hover:text-gold"
          >
            <UserRound className="size-4" aria-hidden />
            Client Login
          </Button>
          <Button
            size="lg"
            onClick={() => openEstimate()}
            className="h-12 rounded-full bg-gold px-7 text-base font-bold text-accent-foreground shadow-lg shadow-gold/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/40"
          >
            Get Free Estimate
            <ArrowRight className="size-4" aria-hidden />
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
              variant="outline"
              onClick={() => {
                setMenuOpen(false)
                setLoginOpen(true)
              }}
              className="mt-2 border-cream/35 bg-transparent text-cream hover:border-gold/60 hover:bg-cream/10 hover:text-gold"
            >
              <UserRound className="size-4" aria-hidden />
              Client Login
            </Button>
            <Button
              onClick={() => {
                setMenuOpen(false)
                openEstimate()
              }}
              className="mt-1 bg-gold text-accent-foreground hover:bg-gold/90"
            >
              Get Free Estimate
            </Button>
          </nav>
        </div>
      )}

      <ClientLoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  )
}
