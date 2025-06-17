import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import SlopeCalculatorTool from './slope-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('slope-calculator', '/tools/slope-calculator')
}

export default function SlopeCalculatorPage() {
  const structuredData = generateToolStructuredData('slope-calculator', '/tools/slope-calculator')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SlopeCalculatorTool />
    </>
  )
}