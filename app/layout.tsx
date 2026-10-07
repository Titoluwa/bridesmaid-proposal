import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope, Pinyon_Script } from 'next/font/google'
import { site } from '@/lib/site'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pinyon',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${site.title} · ${site.couple}`,
    template: `%s · ${site.couple}`,
  },
  description: 'A little letter from your Bride-to-be. 🤍',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/logo/TM-logo-wine.png', type: 'image/png' },
      { url: '/logo/TM-wine.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo/TM-logo-wine.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${pinyon.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
