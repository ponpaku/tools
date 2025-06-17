import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import AreaConverterTool from './area-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('area-converter', '/tools/area-converter')
}

export default function AreaConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('area-converter', '/tools/area-converter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AreaConverterTool />
    </>
  )
}