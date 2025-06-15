import { Metadata } from 'next'
import NumberBaseConverterTool from './number-base-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '進数変換ツール【2進数・8進数・10進数・16進数】無料',
    description: '2進数、8進数、10進数、16進数の相互変換を瞬時に実行する無料ツール。プログラミング、計算機科学、デジタル回路設計に最適。リアルタイム変換でエラーチェック機能付き。',
    keywords: [
      '進数変換', '2進数', '8進数', '10進数', '16進数', 'Binary', 'Octal', 'Decimal', 'Hexadecimal',
      'プログラミング', '計算機科学', 'デジタル回路', 'コンピュータサイエンス',
      '基数変換', 'ビット演算', '無料', 'オンライン', 'リアルタイム'
    ],
    openGraph: {
      title: '進数変換ツール【2進数・8進数・10進数・16進数】無料',
      description: '2進数、8進数、10進数、16進数の相互変換を瞬時に実行する無料ツール。プログラミング、計算機科学に最適。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/number-base-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '進数変換ツール【2進数・8進数・10進数・16進数】無料',
      description: '2進数、8進数、10進数、16進数の相互変換を瞬時に実行する無料ツール。',
    },
    alternates: {
      canonical: '/tools/number-base-converter',
    },
  }
}

export default function NumberBaseConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "進数変換ツール",
    "description": "2進数、8進数、10進数、16進数の相互変換ツール",
    "url": `${siteUrl}/tools/number-base-converter`,
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
    "keywords": "進数変換, 2進数, 8進数, 10進数, 16進数, プログラミング"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <NumberBaseConverterTool />
    </>
  )
}