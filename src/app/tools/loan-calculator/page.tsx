import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import LoanCalculatorTool from './loan-calculator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('loan-calculator', '/tools/loan-calculator')
}

export default function LoanCalculatorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('loan-calculator', '/tools/loan-calculator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <LoanCalculatorTool />
    </>
  )
}