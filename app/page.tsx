import { BookingProvider } from '@/components/site/booking-provider'
import { ServiceModalProvider } from '@/components/site/service-modal-provider'
import { CanadaMapSection } from '@/components/site/canada-map-section'
import { Comparison } from '@/components/site/comparison'
import { FinalCta } from '@/components/site/final-cta'
import { Fleet } from '@/components/site/fleet'
import { Hero } from '@/components/site/hero'
import { HowItWorks } from '@/components/site/how-it-works'
import { Industries } from '@/components/site/industries'
import { Results } from '@/components/site/results'
import { Services } from '@/components/site/services'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { Testimonials } from '@/components/site/testimonials'
import { WhyUs } from '@/components/site/why-us'
import { getCanadaMap } from '@/lib/canada-map'

export default function Page() {
  const canadaMap = getCanadaMap()

  return (
    <BookingProvider>
      <ServiceModalProvider>
        <SiteHeader />
        <main>
          <Hero />
          <WhyUs />
          <Services />
          <Comparison />
          <HowItWorks />
          <Results />
          <Industries />
          <Fleet />
          <CanadaMapSection map={canadaMap} />
          <Testimonials />
          <FinalCta />
        </main>
        <SiteFooter />
      </ServiceModalProvider>
    </BookingProvider>
  )
}
