import { Metadata } from 'next'
import FractionPercentageConverterTool from './fraction-percentage-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '分数・小数・パーセント変換【相互変換・約分・無料計算機】',
    description: '分数・小数・パーセントの相互変換ツール。自動約分機能付き。学習、料理、統計計算に最適な無料オンライン計算機。',
    keywords: [
      '分数変換', '小数変換', 'パーセント変換', '約分', '通分', '分数計算', '小数計算',
      '数学', '算数', '学習', '宿題', '料理', '統計', '無料', 'オンライン', '計算機'
    ],
    openGraph: {
      title: '分数・小数・パーセント変換【相互変換・約分・無料計算機】',
      description: '分数・小数・パーセントの相互変換ツール。自動約分機能付き。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/fraction-percentage-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '分数・小数・パーセント変換【相互変換・約分・無料計算機】',
      description: '分数・小数・パーセントの相互変換ツール。自動約分機能付き。',
    },
    alternates: {
      canonical: '/tools/fraction-percentage-converter',
    },
  }
}

export default function FractionPercentageConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "分数・小数・パーセント変換",
    "description": "分数・小数・パーセントの相互変換ツール",
    "url": `${siteUrl}/tools/fraction-percentage-converter`,
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
    "keywords": "分数変換, 小数変換, パーセント変換, 約分, 通分, 分数計算, 小数計算"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <FractionPercentageConverterTool />
    </>
  )
}