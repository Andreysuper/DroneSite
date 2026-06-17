'use client'

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookServiceModal } from './book-service-modal'

type BookingContextValue = {
  /** Opens the short Free Estimate form. */
  openEstimate: (service?: string) => void
  /** Opens the detailed Book Service form. */
  openBooking: (service?: string) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

const SERVICES = [
  'Crop Spraying',
  'Fertilizer Application',
  'Irrigation Services',
  'Golf Course Treatment',
  'Pest Control',
  'Field Mapping',
  'Not sure yet',
]

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [service, setService] = useState<string>('Crop Spraying')
  const [bookingService, setBookingService] = useState<string | undefined>(
    undefined,
  )
  const [submitting, setSubmitting] = useState(false)

  function openEstimate(preset?: string) {
    if (preset) setService(preset)
    setIsOpen(true)
  }

  function openBooking(preset?: string) {
    setBookingService(preset)
    setBookingOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    // Simulate request to the operations team
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setIsOpen(false)
    toast.success('Estimate request sent', {
      description:
        'Thank you. Your estimate request has been sent. Our team will contact you soon.',
    })
  }

  return (
    <BookingContext.Provider value={{ openEstimate, openBooking }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Get a Free Estimate</DialogTitle>
            <DialogDescription>
              Tell us about your operation and we&apos;ll prepare a free,
              no-obligation estimate.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="(204) 555-0142"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@farm.ca"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="service">Service Needed</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="fieldSize">Field Size (acres)</Label>
                <Input
                  id="fieldSize"
                  name="fieldSize"
                  placeholder="e.g. 320"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Brandon, MB"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="date">Preferred Date</Label>
                <Input id="date" name="date" type="date" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Tell us about your crops, terrain, or timeline."
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-1 w-full bg-forest text-primary-foreground hover:bg-forest-deep"
            >
              {submitting ? 'Sending request…' : 'Request Estimate'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No commitment. We typically respond within one business day.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <BookServiceModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        initialService={bookingService}
      />
    </BookingContext.Provider>
  )
}
