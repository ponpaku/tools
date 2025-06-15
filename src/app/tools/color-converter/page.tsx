import { Metadata } from 'next'
import ColorConverterTool from './color-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'カラーコード変換【HEX・RGB・HSL・HSV・CMYK・無料ツール】',
    description: 'HEX・RGB・HSL・HSV・CMYK形式のカラーコード変換ツール。デザイン・開発に最適。リアルタイムプレビュー、カラーピッカー対応の無料ツール。',
    keywords: [
      'カラーコード', '色変換', 'HEX', 'RGB', 'HSL', 'HSV', 'CMYK', 'カラーピッカー',
      'デザイン', 'Web開発', 'CSS', 'HTML', 'グラフィック', '無料', 'オンライン'
    ],
    openGraph: {
      title: 'カラーコード変換【HEX・RGB・HSL・HSV・CMYK・無料ツール】',
      description: 'HEX・RGB・HSL・HSV・CMYK形式のカラーコード変換ツール。デザイン・開発に最適。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/color-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'カラーコード変換【HEX・RGB・HSL・HSV・CMYK・無料ツール】',
      description: 'HEX・RGB・HSL・HSV・CMYK形式のカラーコード変換ツール。デザイン・開発に最適。',
    },
    alternates: {
      canonical: '/tools/color-converter',
    },
  }
}

export default function ColorConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "カラーコード変換",
    "description": "HEX・RGB・HSL・HSV・CMYK形式のカラーコード変換ツール",
    "url": `${siteUrl}/tools/color-converter`,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "ぽんぱく",
      "url": siteUrl
    },
    "inLanguage": "ja",
    "keywords": "カラーコード, 色変換, HEX, RGB, HSL, HSV, CMYK, カラーピッカー"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ColorConverterTool />
    </>
  )
}