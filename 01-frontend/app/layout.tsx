import type { Metadata } from 'next'
import Link from 'next/link';
import Script from 'next/script';
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
  const GA_TRACKING_ID = 'G-BVLZXL823S';  
  
  return (
    <html lang="en">
      <body>{children}
        
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive" // 建議的策略，在頁面可交互後加載
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname, // 確保路由變化時能正確追蹤 page_view
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
