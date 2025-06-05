import React from 'react'
import '../styles/globals.css'

export const metadata = {
  title: 'Compass - AI Career Coaching',
  description: 'AI-powered career coaching platform for modern professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
