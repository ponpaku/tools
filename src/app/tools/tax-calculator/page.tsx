import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import TaxCalculatorTool from './tax-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('tax-calculator', '/tools/tax-calculator')
}

export default function TaxCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('tax-calculator', '/tools/tax-calculator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <TaxCalculatorTool />
    </>
  )
}