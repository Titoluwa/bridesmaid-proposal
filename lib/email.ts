import nodemailer from 'nodemailer'
import type { Bridesmaid, BridesmaidColor } from '@/lib/bridesmaids'
import { site } from '@/lib/site'

type SendKeepsakeParams = {
  toEmail: string
  bridesmaid: Bridesmaid
  colors: BridesmaidColor[]
}

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || '587')
  const secure = process.env.SMTP_SECURE === 'true' || port === 465
  const user = process.env.SMTP_USER?.trim()
  const rawPass = process.env.SMTP_PASSWORD
  const pass = rawPass?.replace(/\s+/g, '')

  if (!user || !pass) {
    throw new Error('SMTP credentials are not configured in environment variables.')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })
}

function buildKeepsakeHtml({
  bridesmaid,
  colors,
}: {
  bridesmaid: Bridesmaid
  colors: BridesmaidColor[]
}): string {
  const weddingDate = process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-12-19'

  const swatchHtml = colors
    .map(
      (c) => `
        <td align="center" style="padding: 0 10px;">
          <div style="width: 58px; height: 58px; border-radius: 50%; background-color: ${c.hex}; border: 3px solid #FAF7F2; box-shadow: 0 4px 12px rgba(60,45,30,0.18);"></div>
        </td>
      `,
    )
    .join('')

  const colorNames = colors.map((c) => c.name).join(' / ')
  const colorHexes = colors.map((c) => c.hex).join(' · ')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Bridesmaid Keepsake · ${site.couple}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2C221E; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F5EE; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E6DCCD; box-shadow: 0 14px 34px -10px rgba(60,45,30,0.12); overflow: hidden;">
          
          <!-- Top Wine Accent Line -->
          <tr>
            <td style="background-color: #6D2335; height: 6px; line-height: 6px; font-size: 6px;">&nbsp;</td>
          </tr>

          <!-- Inner Content -->
          <tr>
            <td style="padding: 44px 36px 36px; text-align: center;">
              
              <!-- Eyebrow -->
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: #8F7D73; font-weight: 600;">
                The Bridal Party of
              </p>

              <!-- Couple Name -->
              <h1 style="margin: 10px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; font-weight: normal; color: #2C221E; letter-spacing: 0.02em;">
                ${site.couple}
              </h1>

              <div style="margin: 22px auto; width: 48px; height: 1px; background-color: #DCD0C0;"></div>

              <!-- Bridesmaid Name & Role -->
              <h2 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: normal; color: #6D2335;">
                ${bridesmaid.name}
              </h2>
              
              <p style="margin: 8px 0 0; font-size: 16px; font-style: italic; color: #5B4840; font-family: Georgia, serif;">
                ${bridesmaid.role}
              </p>

              <span style="display: inline-block; margin-top: 10px; background-color: #FAF4EB; border: 1px solid #E8DCB8; color: #7B5F25; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; padding: 4px 12px; border-radius: 20px;">
                ${bridesmaid.weddingRole}
              </span>

              <!-- Keepsake Card Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px; background-color: #FDFBF7; border: 1px solid #EFE6D8; border-radius: 14px; padding: 28px 20px; text-align: center;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 18px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; color: #8F7D73; font-weight: 600;">
                      ${colors.length > 1 ? 'Your Designated Colors' : 'Your Designated Color'}
                    </p>
                    
                    <!-- Color Swatches -->
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        ${swatchHtml}
                      </tr>
                    </table>

                    <p style="margin: 18px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: #2C221E;">
                      ${colorNames}
                    </p>
                    
                    <p style="margin: 4px 0 0; font-family: monospace; font-size: 12px; letter-spacing: 0.15em; color: #8F7D73;">
                      ${colorHexes}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Bride's Message Note -->
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.7; color: #5B4840;">
                You are officially part of my bridal party. Keep this color safe for your fittings and preparations &mdash; I cannot wait to have you walking with me into this new chapter! 🤍
              </p>

              <p style="margin: 22px 0 0; font-family: Georgia, serif; font-size: 18px; font-style: italic; color: #6D2335;">
                With all my love,<br>
                <span style="font-size: 20px; font-weight: normal; color: #2C221E;">Toluwani</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F5EE; border-top: 1px solid #EFE6D8; padding: 22px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #8F7D73;">
                Wedding Date &middot; ${weddingDate}
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #A49389;">
                A Letter From Your Bride
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export async function sendKeepsakeEmail({
  toEmail,
  bridesmaid,
  colors,
}: SendKeepsakeParams): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = getTransporter()
    const fromAddress = process.env.SMTP_FROM || `Tolu's Bridal Party <${process.env.SMTP_USER}>`

    const html = buildKeepsakeHtml({ bridesmaid, colors })

    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your Bridesmaid Keepsake & Color · ${bridesmaid.shortName} 💌`,
      html,
    })

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    console.error('[sendKeepsakeEmail] Error:', err)
    return { success: false, error: message }
  }
}
