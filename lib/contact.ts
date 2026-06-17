// Central contact details for AgroSkyTech. Update these in one place.
export const CONTACT_EMAIL = 'hello@agroskytech.ca'
export const CONTACT_PHONE_DISPLAY = '204 698 1770'
export const CONTACT_PHONE_HREF = 'tel:+12046981770'

const GENERIC_ERROR = 'Unable to send request. Please try again later.'

async function parseError(res: Response): Promise<string> {
  const json = (await res.json().catch(() => null)) as
    | { error?: string }
    | null
  return json?.error || GENERIC_ERROR
}

/**
 * Submits the Free Estimate form to the secure server route, which sends the
 * email via SMTP (Nodemailer). No SMTP credentials are ever exposed here.
 */
export async function submitEstimate(payload: {
  name: string
  phone: string
  email: string
  service: string
  fieldSize: string
  location: string
  date: string
  message: string
}): Promise<void> {
  const res = await fetch('/api/send-estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
}

/**
 * Submits the detailed Book Service form (including any file attachments) to
 * the secure server route, which sends the email via SMTP (Nodemailer).
 */
export async function submitBooking(formData: FormData): Promise<void> {
  const res = await fetch('/api/send-booking', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error(await parseError(res))
}
