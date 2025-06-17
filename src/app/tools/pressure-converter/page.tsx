import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import PressureConverterTool from './pressure-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('pressure-converter', '/tools/pressure-converter')
}

export default function PressureConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('pressure-converter', '/tools/pressure-converter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <PressureConverterTool />
    </>
  )
}