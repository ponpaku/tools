import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import SportsScoreboardTool from './sports-scoreboard-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'スポーツスコアボード【バスケ・バレー・テニス・卓球対応】',
    description: 'バスケットボール、バレーボール、テニス、卓球に対応したスポーツ専用スコアボード。セット管理、スコア履歴、フルスクリーンモード搭載。リアルタイムでスコアを記録・管理できる無料ツール。',
    keywords: [
      'スポーツスコアボード', 'バスケットボール', 'バレーボール', 'テニス', '卓球',
      'セット管理', 'スコア記録', 'フルスクリーン', 'リアルタイムスコア',
      'スポーツ管理', '得点管理', '試合管理', '無料', 'オンライン'
    ],
    openGraph: {
      title: 'スポーツスコアボード【バスケ・バレー・テニス・卓球対応】',
      description: 'バスケットボール、バレーボール、テニス、卓球に対応したスポーツ専用スコアボード。セット管理、スコア履歴、フルスクリーンモード搭載。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/sports-scoreboard',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'スポーツスコアボード【バスケ・バレー・テニス・卓球対応】',
      description: 'バスケットボール、バレーボール、テニス、卓球に対応したスポーツ専用スコアボード。',
    },
    alternates: {
      canonical: '/tools/sports-scoreboard',
    },
  }
}

export default function SportsScoreboardPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "スポーツスコアボード",
    "description": "バスケットボール、バレーボール、テニス、卓球に対応したスポーツ専用スコアボードツール",
    "url": `${siteUrl}/tools/sports-scoreboard`,
    "applicationCategory": "SportsApplication",
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
    "keywords": "スポーツスコアボード, バスケットボール, バレーボール, テニス, 卓球, セット管理"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SportsScoreboardTool />
    </>
  )
}