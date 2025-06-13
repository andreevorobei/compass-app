import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Compass AI - Ваш персональный ИИ-помощник',
  description: 'Персональный ИИ-помощник для карьерного развития, планирования целей и отслеживания прогресса',
  keywords: ['ИИ', 'карьера', 'цели', 'развитие', 'аналитика'],
  authors: [{ name: 'Compass AI Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 