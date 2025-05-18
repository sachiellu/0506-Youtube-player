import type { Metadata } from 'next'
import Link from 'next/link';
import './globals.css'

export const metadata: Metadata = {
  title: 'YouTube Player',
  description: '根據曲風隨機播放 YouTube 音樂的應用程式',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
