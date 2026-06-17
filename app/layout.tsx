import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'AgroSkyTech | Agricultural Drone Services in Canada',
    template: '%s | AgroSkyTech',
  },
  description:
    'AgroSkyTech provides professional agricultural drone services across Canada, the USA and Europe — precision crop spraying, fertilizer application, irrigation, golf course treatment, pest control and field mapping. Over 300,000 acres treated. Based in Winnipeg, Manitoba.',
  keywords: [
    'Agricultural Drone Services Canada',
    'Drone Spraying Canada',
    'Crop Spraying Services',
    'Golf Course Drone Spraying',
    'Precision Agriculture Canada',
    'Agricultural Drone Company Winnipeg',
    'DJI Agras spraying',
    'aerial fertilizer application',
  ],
  authors: [{ name: 'AgroSkyTech' }],
  creator: 'AgroSkyTech',
  metadataBase: new URL('https://agroskytech.example'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    title: 'AgroSkyTech | Agricultural Drone Services in Canada',
    description:
      'Precision drone spraying, fertilization, irrigation and crop treatment. 300,000+ acres treated across Canada, the USA and Europe.',
    siteName: 'AgroSkyTech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgroSkyTech | Agricultural Drone Services in Canada',
    description:
      'Precision drone spraying, fertilization, irrigation and crop treatment. 300,000+ acres treated.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1c3026',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
