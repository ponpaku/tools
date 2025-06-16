import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import StatisticsCalculatorTool from './statistics-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('statistics-calculator', '/tools/statistics-calculator')
}

export default function StatisticsCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('statistics-calculator', '/tools/statistics-calculator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <StatisticsCalculatorTool />
    </>
  )
}