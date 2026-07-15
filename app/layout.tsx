import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getLocale, isRTL } from '@/lib/i18n'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Nova — Production web app starter',
  description:
    'Multi-language, mobile-first Next.js + Supabase starter following Alireza\'s Playbook.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} dir={isRTL(locale) ? 'rtl' : 'ltr'} className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-night antialiased">
        {children}
      </body>
    </html>
  )
}
