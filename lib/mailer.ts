import nodemailer from 'nodemailer'

/**
 * Destination inbox for all website form submissions.
 */
export const DESTINATION_EMAIL = 'hello@agroskytech.ca'

/**
 * SMTP configuration is read from server-side environment variables only.
 * These must NEVER be exposed to the client (do not prefix with NEXT_PUBLIC_).
 *
 *   SMTP_HOST
 *   SMTP_PORT
 *   SMTP_USER
 *   SMTP_PASSWORD
 */
export function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !port || !user || !pass) {
    return null
  }

  return { host, port, user, pass }
}

let cachedTransport: nodemailer.Transporter | null = null

/**
 * Returns a cached Nodemailer transport, or null when SMTP is not configured.
 */
export function getTransport(): nodemailer.Transporter | null {
  if (cachedTransport) return cachedTransport

  const config = getSmtpConfig()
  if (!config) return null

  cachedTransport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // 465 = implicit TLS, otherwise STARTTLS is negotiated.
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })

  return cachedTransport
}

export type MailAttachment = {
  filename: string
  content: Buffer
  contentType?: string
}

/**
 * Sends an email through the configured SMTP transport.
 * Throws when SMTP is not configured or delivery fails.
 */
export async function sendMail({
  subject,
  html,
  replyTo,
  attachments,
}: {
  subject: string
  html: string
  replyTo?: string
  attachments?: MailAttachment[]
}): Promise<void> {
  const transport = getTransport()
  if (!transport) {
    throw new Error('SMTP is not configured on the server.')
  }

  const config = getSmtpConfig()!

  await transport.sendMail({
    from: `"AgroSkyTech Website" <${config.user}>`,
    to: DESTINATION_EMAIL,
    subject,
    html,
    replyTo,
    attachments,
  })
}

/**
 * Escapes user-supplied text so it is safe to embed in HTML emails.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
