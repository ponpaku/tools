import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ぽんぱくツール - 便利なオンラインツールボックス',
    template: '%s | ぽんぱくツール'
  },
  description: '文字列処理、エンコーディング、日付計算、開発者ツールなど、日常業務を効率化する便利なオンラインツールを無料で提供。ブラウザ上ですぐに使える実用的なツール集です。',
  keywords: [
    'オンラインツール',
    'ツールボックス', 
    '文字列処理',
    'エンコーディング',
    'Base64',
    'QRコード生成',
    'JSON整形',
    'ハッシュ生成',
    '日付計算',
    '開発者ツール',
    '無料ツール',
    '便利ツール',
    'ブラウザツール'
  ],
  authors: [{ name: 'ぽんぱく' }],
  creator: 'ぽんぱく',
  publisher: 'ぽんぱく',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: '/',
    title: 'ぽんぱくツール - 便利なオンラインツールボックス',
    description: '文字列処理、エンコーディング、日付計算、開発者ツールなど、日常業務を効率化する便利なオンラインツールを無料で提供。ブラウザ上ですぐに使える実用的なツール集です。',
    siteName: 'ぽんぱくツール',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ぽんぱくツール - 便利なオンラインツールボックス',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ぽんぱくツール - 便利なオンラインツールボックス',
    description: '文字列処理、エンコーディング、日付計算、開発者ツールなど、日常業務を効率化する便利なオンラインツールを無料で提供。',
    images: ['/og-image.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/icon.svg',
      },
    ],
  },
  other: {
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-TileImage': '/android-chrome-192x192.png',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ぽんぱくツール',
    'google-adsense-account': 'ca-pub-7607779602110545',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ぽんぱくツール",
    "description": "便利なオンラインツールが集まったツールボックス。文字列処理、エンコーディング、日付計算、開発者ツールなど、日常業務を効率化する無料ツールを提供しています。",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "creator": {
      "@type": "Organization",
      "name": "ぽんぱく",
      "url": "https://note.com/ponpaku"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-MQJFXJGK"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MQJFXJGK');
            `,
          }}
        />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7607779602110545"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* PWA Service Worker */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
        
        {children}
      </body>
    </html>
  )
}