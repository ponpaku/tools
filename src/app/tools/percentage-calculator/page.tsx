import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import PercentageCalculatorTool from './percentage-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('percentage-calculator', '/tools/percentage-calculator')
}

export default function PercentageCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('percentage-calculator', '/tools/percentage-calculator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <PercentageCalculatorTool />
    </>
  )
}