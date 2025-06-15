import { Metadata } from 'next'
import MarkdownPreviewTool from './markdown-preview-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Markdownプレビュー【リアルタイム表示・HTML変換・無料オンラインツール】',
    description: 'Markdownテキストをリアルタイムでプレビュー・HTML変換。見出し、リスト、表、コードブロック対応。技術文書・ブログ執筆に最適な無料ツール。',
    keywords: [
      'Markdown', 'マークダウン', 'プレビュー', 'HTML変換', 'リアルタイム',
      '技術文書', 'ブログ', 'README', 'ドキュメント', '執筆', '無料', 'オンライン'
    ],
    openGraph: {
      title: 'Markdownプレビュー【リアルタイム表示・HTML変換・無料オンラインツール】',
      description: 'Markdownテキストをリアルタイムでプレビュー・HTML変換。見出し、リスト、表、コードブロック対応。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/markdown-preview',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Markdownプレビュー【リアルタイム表示・HTML変換・無料オンラインツール】',
      description: 'Markdownテキストをリアルタイムでプレビュー・HTML変換。見出し、リスト、表、コードブロック対応。',
    },
    alternates: {
      canonical: '/tools/markdown-preview',
    },
  }
}

export default function MarkdownPreviewPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Markdownプレビュー",
    "description": "Markdownテキストをリアルタイムでプレビュー・HTML変換するツール",
    "url": `${siteUrl}/tools/markdown-preview`,
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
    "keywords": "Markdown, マークダウン, プレビュー, HTML変換, リアルタイム"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <MarkdownPreviewTool />
    </>
  )
}