// Central contact details for AgroSkyTech. Update these in one place.
export const CONTACT_EMAIL = 'hello@agroskytech.ca'
export const CONTACT_PHONE_DISPLAY = '204 698 1770'
export const CONTACT_PHONE_HREF = 'tel:+12046981770'

/**
 * Submits a website form to AgroSkyTech.
 *
 * Delivery is handled by Web3Forms (https://web3forms.com) when an access key
 * is configured. If no key is present yet, it falls back to opening the
 * visitor's email client with a prefilled message so submissions are never
 * silently dropped.
 *
 * TODO: To enable automatic email delivery to hello@agroskytech.ca:
 *   1. Create a free access key at https://web3forms.com (set the destination
 *      email on that key to hello@agroskytech.ca).
 *   2. Add it to your project env vars as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.
 */
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

export async function submitContactForm({
  subject,
  formData,
}: {
  subject: string
  formData: FormData
}): Promise<void> {
  if (WEB3FORMS_ACCESS_KEY) {
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', subject)
    formData.append('from_name', 'AgroSkyTech Website')
    // Web3Forms delivers to the email configured on the access key.
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })
    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null
    if (!res.ok || !json?.success) {
      throw new Error(json?.message || 'Submission failed. Please try again.')
    }
    return
  }

  // ---- Fallback: no API key configured yet ----
  // Build a readable email body and open the visitor's mail client addressed
  // to CONTACT_EMAIL. This guarantees the request actually reaches us.
  const lines: string[] = []
  formData.forEach((value, key) => {
    if (typeof value === 'string') {
      if (value.trim()) lines.push(`${key}: ${value}`)
    } else if (value instanceof File && value.name) {
      lines.push(`${key}: ${value.name} (please attach this file to the email)`)
    }
  })

  const body = encodeURIComponent(
    `${lines.join('\n')}\n\n— Sent from the AgroSkyTech website`,
  )
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${body}`

  if (typeof window !== 'undefined') {
    window.location.href = mailto
  }
}
