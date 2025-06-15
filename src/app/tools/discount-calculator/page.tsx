import { Metadata } from 'next'
import DiscountCalculatorTool from './discount-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '商品値引き計算機【割引率・税込価格・ポイント還元計算・無料ツール】',
    description: '商品の割引率計算、税込み・税抜き価格、ポイント還元を含む総合的な価格計算ツール。ショッピング・EC・店舗運営に最適な無料計算機。',
    keywords: [
      '値引き計算', '割引率計算', '税込価格', '税抜き価格', 'ポイント還元',
      'セール計算', 'ショッピング', 'EC', '店舗', '価格計算', '無料', 'オンライン'
    ],
    openGraph: {
      title: '商品値引き計算機【割引率・税込価格・ポイント還元計算・無料ツール】',
      description: '商品の割引率計算、税込み・税抜き価格、ポイント還元を含む総合的な価格計算ツール。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/discount-calculator',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '商品値引き計算機【割引率・税込価格・ポイント還元計算・無料ツール】',
      description: '商品の割引率計算、税込み・税抜き価格、ポイント還元を含む総合的な価格計算ツール。',
    },
    alternates: {
      canonical: '/tools/discount-calculator',
    },
  }
}

export default function DiscountCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "商品値引き計算機",
    "description": "商品の割引率計算、税込み・税抜き価格、ポイント還元を含む総合的な価格計算ツール",
    "url": `${siteUrl}/tools/discount-calculator`,
    "applicationCategory": "UtilityApplication",
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
    "keywords": "値引き計算, 割引率計算, 税込価格, ポイント還元, ショッピング"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <DiscountCalculatorTool />
    </>
  )
}