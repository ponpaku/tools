import { Metadata } from 'next'
import RegexTesterTool from './regex-tester-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '正規表現テスター【カラーハイライト・マッチ検証・無料ツール】',
    description: '正規表現のテスト・検証ツール。カラーハイライト表示、マッチ詳細、よく使うパターン集。プログラミング・開発に最適な無料正規表現テスター。',
    keywords: [
      '正規表現', 'regex', '正規表現テスター', 'パターンマッチ', 'テスト', '検証', 'ハイライト',
      'プログラミング', '開発', 'バリデーション', 'JavaScript', '無料', 'オンライン'
    ],
    openGraph: {
      title: '正規表現テスター【カラーハイライト・マッチ検証・無料ツール】',
      description: '正規表現のテスト・検証ツール。カラーハイライト表示、マッチ詳細表示機能付き。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/regex-tester',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '正規表現テスター【カラーハイライト・マッチ検証・無料ツール】',
      description: '正規表現のテスト・検証ツール。カラーハイライト表示、マッチ詳細表示機能付き。',
    },
    alternates: {
      canonical: '/tools/regex-tester',
    },
  }
}

export default function RegexTesterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "正規表現テスター",
    "description": "正規表現のテスト・検証ツール（カラーハイライト付き）",
    "url": `${siteUrl}/tools/regex-tester`,
    "applicationCategory": "DeveloperApplication",
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
    "keywords": "正規表現, regex, 正規表現テスター, パターンマッチ, テスト, 検証, ハイライト"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <RegexTesterTool />
    </>
  )
}