/**
 * Wedding-wide settings.
 *
 * The countdown on the final screen only appears when a wedding date is set.
 * Set it here or via the NEXT_PUBLIC_WEDDING_DATE env var, using an ISO
 * date/time, e.g. "2027-04-17" or "2027-04-17T11:00:00+01:00".
 */
export const site = {
  bride: 'Tolu',
  couple: 'Tolu & Moyo',
  monogram: 'T & M',
  logo: '/logo/TM-logo-wine.png',
  title: 'A Letter From Your Bride',
  weddingDate: (process.env.NEXT_PUBLIC_WEDDING_DATE || null) as string | null,
}
