import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import TimeCalculatorTool from './time-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('time-calculator', '/tools/time-calculator')
}

export default function TimeCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('time-calculator', '/tools/time-calculator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <TimeCalculatorTool />
    </>
  )
}