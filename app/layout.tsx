import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ProjectProvider } from '@/lib/project-context'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cartografo.dev'),
  title: {
    default: 'Cartógrafo — Onboarding inteligente sobre código legacy',
    template: '%s · Cartógrafo',
  },
  description:
    'Reducí el tiempo de onboarding sobre bases de código legacy. Cartógrafo genera documentación, mapas de arquitectura, análisis de deuda técnica y un tour guiado personalizado a partir de tu repositorio — sin alucinar: siempre distingue lo detectado de lo inferido.',
  keywords: [
    'onboarding de código',
    'documentación automática',
    'legacy code',
    'análisis de repositorio',
    'deuda técnica',
    'arquitectura de software',
    'onboarding de desarrolladores',
  ],
  authors: [{ name: 'Cartógrafo' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'Cartógrafo — Onboarding inteligente sobre código legacy',
    description:
      'Documentación, arquitectura y un tour guiado personalizado a partir de tu repositorio. Basado en evidencia, nunca en suposiciones.',
    siteName: 'Cartógrafo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cartógrafo — Onboarding inteligente sobre código legacy',
    description:
      'Documentación, arquitectura y un tour guiado personalizado a partir de tu repositorio.',
  },
  robots: { index: true, follow: true },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0d12',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`dark ${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ProjectProvider>
          {children}
        </ProjectProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

