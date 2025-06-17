import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import UnitPriceCalculatorTool from '@/components/tools/unit-price-calculator-tool'

export const metadata: Metadata = generateToolMetadata('unit-price-calculator', '/tools/unit-price-calculator')

export default function UnitPriceCalculatorPage() {
  const structuredData = generateToolStructuredData('unit-price-calculator', '/tools/unit-price-calculator')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <UnitPriceCalculatorTool />
    </>
  )
}