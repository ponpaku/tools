import { Metadata } from 'next'
import JwtDecoderTool from './jwt-decoder-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'JWT/PASTOデコーダ【JSON Web Token・PASETO解析・無料オンラインツール】',
    description: 'JWT（JSON Web Token）とPASETOのデコード・解析ツール。ヘッダー、ペイロード、署名の詳細表示。Web開発・API開発に最適な無料ツール。',
    keywords: [
      'JWT', 'JSON Web Token', 'PASETO', 'デコード', '解析', 'トークン',
      'ヘッダー', 'ペイロード', '署名', 'Web開発', 'API', 'セキュリティ', '無料', 'オンライン'
    ],
    openGraph: {
      title: 'JWT/PASTOデコーダ【JSON Web Token・PASETO解析・無料オンラインツール】',
      description: 'JWT（JSON Web Token）とPASETOのデコード・解析ツール。ヘッダー、ペイロード、署名の詳細表示。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/jwt-decoder',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'JWT/PASTOデコーダ【JSON Web Token・PASETO解析・無料オンラインツール】',
      description: 'JWT（JSON Web Token）とPASETOのデコード・解析ツール。ヘッダー、ペイロード、署名の詳細表示。',
    },
    alternates: {
      canonical: '/tools/jwt-decoder',
    },
  }
}

export default function JwtDecoderPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "JWT/PASTOデコーダ",
    "description": "JWT（JSON Web Token）とPASETOのデコード・解析ツール",
    "url": `${siteUrl}/tools/jwt-decoder`,
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
    "keywords": "JWT, JSON Web Token, PASETO, デコード, 解析, トークン"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <JwtDecoderTool />
    </>
  )
}