import { Metadata } from 'next'
import BMICalculatorTool from './bmi-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'BMI計算機【身長体重から肥満度判定・理想体重計算】',
    description: '身長・体重からBMI（Body Mass Index）を計算し、肥満度判定と理想体重範囲を表示。メートル法・ヤードポンド法対応の無料BMI計算ツール。',
    keywords: [
      'BMI計算', 'BMI計算機', '肥満度', '体重', '身長', '理想体重', 'ダイエット', '健康管理',
      'Body Mass Index', 'メートル法', 'ヤードポンド法', '無料', 'オンライン', '健康診断'
    ],
    openGraph: {
      title: 'BMI計算機【身長体重から肥満度判定・理想体重計算】',
      description: '身長・体重からBMIを計算し、肥満度判定と理想体重範囲を表示する無料ツール。',
      type: 'website',
      locale: 'ja_JP',
      url: '/tools/bmi-calculator',
      siteName: 'ぽんぱくツール',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'BMI計算機【身長体重から肥満度判定・理想体重計算】',
      description: '身長・体重からBMIを計算し、肥満度判定と理想体重範囲を表示する無料ツール。',
    },
    alternates: {
      canonical: '/tools/bmi-calculator',
    },
  }
}

export default function BMICalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BMI計算機",
    "description": "身長・体重からBMI（Body Mass Index）を計算し、肥満度判定を行うツール",
    "url": `${siteUrl}/tools/bmi-calculator`,
    "applicationCategory": "HealthApplication",
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
    "keywords": "BMI計算, BMI計算機, 肥満度, 体重, 身長, 理想体重, ダイエット, 健康管理"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <BMICalculatorTool />
    </>
  )
}