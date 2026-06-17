import { escapeHtml } from './mailer'

export type EmailRow = { label: string; value: unknown }
export type EmailSection = { title: string; rows: EmailRow[] }

const BRAND_GREEN = '#2f5233'
const BRAND_GOLD = '#c8a24a'
const TEXT = '#1f2421'
const MUTED = '#6b7280'
const BORDER = '#e5e7eb'

function renderRow({ label, value }: EmailRow): string {
  const raw = Array.isArray(value) ? value.join(', ') : value
  const display =
    raw === undefined || raw === null || String(raw).trim() === ''
      ? '—'
      : escapeHtml(raw).replace(/\n/g, '<br />')
  return `
    <tr>
      <td style="padding:8px 12px;width:42%;vertical-align:top;color:${MUTED};font-size:13px;border-bottom:1px solid ${BORDER};">${escapeHtml(
        label,
      )}</td>
      <td style="padding:8px 12px;vertical-align:top;color:${TEXT};font-size:14px;font-weight:500;border-bottom:1px solid ${BORDER};">${display}</td>
    </tr>`
}

function renderSection({ title, rows }: EmailSection): string {
  if (!rows.length) return ''
  return `
    <div style="margin:0 0 22px;">
      <h2 style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_GREEN};">${escapeHtml(
        title,
      )}</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
        ${rows.map(renderRow).join('')}
      </table>
    </div>`
}

/**
 * Builds a branded, responsive HTML email from titled sections.
 */
export function buildEmailHtml({
  heading,
  intro,
  sections,
}: {
  heading: string
  intro?: string
  sections: EmailSection[]
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f5f3;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:${BRAND_GREEN};padding:24px 28px;">
                <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">AgroSky<span style="color:${BRAND_GOLD};">Tech</span></p>
                <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">Agricultural Drone Services</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 6px;font-size:20px;color:${TEXT};">${escapeHtml(
                  heading,
                )}</h1>
                ${
                  intro
                    ? `<p style="margin:0 0 22px;color:${MUTED};font-size:14px;line-height:1.5;">${escapeHtml(
                        intro,
                      )}</p>`
                    : ''
                }
                ${sections.map(renderSection).join('')}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid ${BORDER};">
                <p style="margin:0;color:${MUTED};font-size:12px;line-height:1.5;">This message was sent from the AgroSkyTech website contact forms. Reply directly to respond to the customer.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
