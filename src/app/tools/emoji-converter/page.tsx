import { Metadata } from 'next'
import EmojiConverterTool from './emoji-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Emojiコード変換【Unicode・HTML Entity・CSS・JavaScript形式対応・無料ツール】',
    description: '絵文字とUnicodeコード、HTML Entity、CSS、JavaScript形式の相互変換ツール。開発・デザインに最適な無料オンラインツール。',
    keywords: [
      'Emoji変換', 'Unicode変換', 'HTML Entity', 'CSS絵文字', 'JavaScript絵文字',
      '絵文字コード', 'Unicodeコード', 'エンコード', 'デコード', 'Web開発', '無料', 'オンライン'
    ],
    openGraph: {
      title: 'Emojiコード変換【Unicode・HTML Entity・CSS・JavaScript形式対応・無料ツール】',
      description: '絵文字とUnicodeコード、HTML Entity、CSS、JavaScript形式の相互変換ツール。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/emoji-converter',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Emojiコード変換【Unicode・HTML Entity・CSS・JavaScript形式対応・無料ツール】',
      description: '絵文字とUnicodeコード、HTML Entity、CSS、JavaScript形式の相互変換ツール。',
    },
    alternates: {
      canonical: '/tools/emoji-converter',
    },
  }
}

export default function EmojiConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Emojiコード変換",
    "description": "絵文字とUnicodeコード、HTML Entity、CSS、JavaScript形式の相互変換ツール",
    "url": `${siteUrl}/tools/emoji-converter`,
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
    "keywords": "Emoji変換, Unicode変換, HTML Entity, CSS絵文字, JavaScript絵文字"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <EmojiConverterTool />
    </>
  )
}