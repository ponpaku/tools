import { Metadata } from 'next'

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
  noIndex?: boolean
}

export function generateMetadata({
  title = "ぽんぱくツール",
  description = "便利なオンラインツールが集まったツールボックス。文字列処理、エンコーディング、日付計算、開発者ツールなど、日常業務を効率化する無料ツールを提供しています。",
  keywords = ["オンラインツール", "文字列処理", "エンコーディング", "日付計算", "開発者ツール", "無料ツール", "便利ツール"],
  ogImage = "/og-image.png",
  canonical,
  noIndex = false
}: MetaTagsProps): Metadata {
  const fullTitle = title === "ぽんぱくツール" ? title : `${title} | ぽんぱくツール`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.ponpaku.com"
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    alternates: canonical ? {
      canonical: canonical
    } : undefined,
    openGraph: {
      type: 'website',
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ],
      url: canonical || siteUrl,
      siteName: "ぽんぱくツール",
      locale: "ja_JP"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`]
    },
    other: {
      "theme-color": "#3b82f6",
      "msapplication-TileColor": "#3b82f6",
      "format-detection": "telephone=no"
    }
  }
}

// クライアント側で使用するコンポーネント
export function MetaTags(props: MetaTagsProps) {
  // App Router ではこのコンポーネントは実際には何もレンダリングしない
  return null
}