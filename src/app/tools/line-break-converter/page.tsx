import { Metadata } from 'next'
import LineBreakConverterTool from './line-break-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '改行コード変換【Windows・Unix・Mac対応・無料オンラインツール】',
    description: 'テキストの改行コードをWindows（CRLF）・Unix/Linux（LF）・Mac（CR）間で変換。プログラミング、テキスト処理に最適な無料オンラインツール。',
    keywords: [
      '改行コード変換', 'CRLF', 'LF', 'CR', 'Windows', 'Unix', 'Linux', 'Mac',
      'テキスト変換', 'プログラミング', '文字コード', 'テキストエディタ', '無料', 'オンライン'
    ],
    openGraph: {
      title: '改行コード変換【Windows・Unix・Mac対応・無料オンラインツール】',
      description: 'テキストの改行コードをWindows（CRLF）・Unix/Linux（LF）・Mac（CR）間で変換。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/line-break-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: '改行コード変換【Windows・Unix・Mac対応・無料オンラインツール】',
      description: 'テキストの改行コードをWindows（CRLF）・Unix/Linux（LF）・Mac（CR）間で変換。',
    },
    alternates: {
      canonical: '/tools/line-break-converter',
    },
  }
}

export default function LineBreakConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "改行コード変換",
    "description": "テキストの改行コードをWindows・Unix・Mac間で変換するツール",
    "url": `${siteUrl}/tools/line-break-converter`,
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
    "keywords": "改行コード変換, CRLF, LF, CR, Windows, Unix, Linux, Mac, テキスト変換"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <LineBreakConverterTool />
    </>
  )
}