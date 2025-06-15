import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import FullHalfConverterTool from './full-half-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('full-half-converter', '/tools/full-half-converter')
}

export default function FullHalfConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('full-half-converter', '/tools/full-half-converter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <FullHalfConverterTool />
    </>
  )
}