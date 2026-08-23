import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  Mail,
  MessageSquare,
  Phone,
  PlaneTakeoff,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PageHeader } from '@/components/portal/page-header'
import { SupportRequestForm } from '@/components/portal/support-request-form'
import { getFields } from '@/lib/portal/demo-data'

export const metadata: Metadata = {
  title: 'Support | Client Portal',
  description:
    'Reach the AgroSkyTech team, raise a support request, and read answers to common questions about drone application services.',
}

const FAQS = [
  {
    q: 'What weather conditions ground a flight?',
    a: 'We stand down when sustained winds exceed 25 km/h, during active precipitation, or when temperature inversion risk makes drift unpredictable. You will get a notification and a proposed new window the same day — there is no charge for a weather reschedule.',
  },
  {
    q: 'How soon after a flight are maps available?',
    a: 'As-applied coverage maps are typically processed within 24 hours of landing. NDVI and crop health analysis take up to 48 hours because they run through our agronomy review. You will get a "report ready" notification when each layer lands in Maps & Reports.',
  },
  {
    q: 'Do I need to supply the chemical?',
    a: 'Either works. Most clients have us source and supply product at cost plus handling, which keeps the application record and label documentation in one place. If you supply your own, we need the product name, rate and a copy of the label at least 48 hours before the flight.',
  },
  {
    q: 'How are acres measured for billing?',
    a: 'We bill on acres actually flown, computed from the drone telemetry log rather than your field boundary. If a portion of a field is skipped for a buffer zone or obstruction, it is excluded. The exact figure appears on every invoice next to the per-acre rate.',
  },
  {
    q: 'What buffer zones do you observe?',
    a: 'We follow all federal and provincial label requirements, including downwind buffers to sensitive habitat, waterways and occupied structures. Buffer geometry is included in your application record so it can be shown to an inspector.',
  },
  {
    q: 'Can I add someone else to my account?',
    a: 'Yes. Send us the name, email and the level of access they need — view-only, booking, or billing. Team access management is rolling out to the portal directly, and until then we set it up for you within one business day.',
  },
]

export default function SupportPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Support"
        subtitle="Talk to a person, raise a request, or find the answer yourself. Urgent in-season issues get a same-day response."
      />

      {/* Contact channels */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col gap-2 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest">
            <Phone className="size-4" aria-hidden />
          </span>
          <h2 className="font-semibold">Call operations</h2>
          <p className="text-sm text-muted-foreground">
            Fastest route for a flight happening today.
          </p>
          <a
            href="tel:+12045550142"
            className="mt-auto font-semibold text-forest underline-offset-4 hover:underline"
          >
            +1 (204) 555-0142
          </a>
          <p className="text-xs text-muted-foreground">
            Mon–Sat, 6:00 AM – 9:00 PM CT
          </p>
        </Card>
        <Card className="flex flex-col gap-2 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest">
            <MessageSquare className="size-4" aria-hidden />
          </span>
          <h2 className="font-semibold">Message your team</h2>
          <p className="text-sm text-muted-foreground">
            Keeps the whole thread attached to your account.
          </p>
          <Button
            variant="outline"
            className="mt-auto w-fit"
            nativeButton={false}
            render={<Link href="/portal/messages">Open messages</Link>}
          />
        </Card>
        <Card className="flex flex-col gap-2 p-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-forest/10 text-forest">
            <Mail className="size-4" aria-hidden />
          </span>
          <h2 className="font-semibold">Email us</h2>
          <p className="text-sm text-muted-foreground">
            Best for billing questions and documentation.
          </p>
          <a
            href="mailto:support@agroskytech.ca"
            className="mt-auto font-semibold text-forest underline-offset-4 hover:underline"
          >
            support@agroskytech.ca
          </a>
          <p className="text-xs text-muted-foreground">
            Replies within one business day
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* FAQ */}
        <section className="flex flex-col gap-3">
          <h2 className="font-serif text-xl font-bold">Common questions</h2>
          <Card className="p-2 sm:p-4">
            <Accordion>
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <h2 className="mt-3 font-serif text-xl font-bold">
            Raise a support request
          </h2>
          <SupportRequestForm fields={getFields()} />
        </section>

        {/* Side rail */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3 border-gold/40 bg-gold/5 p-4">
            <span className="flex items-center gap-2 font-semibold">
              <PlaneTakeoff className="size-4 text-gold-deep" aria-hidden />
              Flight in progress?
            </span>
            <p className="text-sm text-muted-foreground">
              If you need to stop or redirect a crew that is currently in the
              air, call the operations line directly. Do not use the form —
              phone is the only channel we monitor in real time.
            </p>
            <Button
              className="w-fit bg-forest text-primary-foreground hover:bg-forest-deep"
              nativeButton={false}
              render={<a href="tel:+12045550142">Call now</a>}
            />
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <span className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="size-4 text-forest" aria-hidden />
              Licensing & insurance
            </span>
            <p className="text-sm text-muted-foreground">
              Transport Canada RPAS Advanced certified, $5M liability coverage,
              and provincial pesticide applicator licences on file.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-fit"
              nativeButton={false}
              render={
                <Link href="/portal/documents">View certificates</Link>
              }
            />
          </Card>

          <Card className="flex flex-col gap-3 p-4">
            <span className="flex items-center gap-2 font-semibold">
              <BookOpen className="size-4 text-forest" aria-hidden />
              Preparing your field
            </span>
            <p className="text-sm text-muted-foreground">
              A short checklist covering gate access, livestock, beehive
              notification and marking obstructions before we arrive.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-fit"
              nativeButton={false}
              render={<Link href="/portal/documents">Read the guide</Link>}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
