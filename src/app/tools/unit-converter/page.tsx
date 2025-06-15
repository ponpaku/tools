import { Metadata } from 'next'
import UnitConverterTool from './unit-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '単位変換ツール【長さ・重さ・温度・無料変換計算機】',
    description: '長さ（メートル・フィート）、重さ（キログラム・ポンド）、温度（摂氏・華氏）の単位変換を瞬時に行う無料ツール。料理、建築、貿易、学習に最適。',
    keywords: [
      '単位変換', '長さ変換', '重さ変換', '温度変換', 'メートル', 'フィート', 'キログラム', 'ポンド',
      '摂氏', '華氏', 'センチメートル', 'インチ', '料理', '建築', '貿易', '学習',
      '無料', 'オンライン', 'リアルタイム', '計算機'
    ],
    openGraph: {
      title: '単位変換ツール【長さ・重さ・温度・無料変換計算機】',
      description: '長さ、重さ、温度の単位変換を瞬時に行う無料ツール。料理、建築、貿易、学習に最適。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/unit-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '単位変換ツール【長さ・重さ・温度・無料変換計算機】',
      description: '長さ、重さ、温度の単位変換を瞬時に行う無料ツール。',
    },
    alternates: {
      canonical: '/tools/unit-converter',
    },
  }
}

export default function UnitConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "単位変換ツール",
    "description": "長さ、重さ、温度の単位変換ツール",
    "url": `${siteUrl}/tools/unit-converter`,
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
    "keywords": "単位変換, 長さ変換, 重さ変換, 温度変換, メートル, フィート"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <UnitConverterTool />
    </>
  )
}