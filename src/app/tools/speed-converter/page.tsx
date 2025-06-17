import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import SpeedConverterTool from './speed-converter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('speed-converter', '/tools/speed-converter')
}

export default function SpeedConverterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('speed-converter', '/tools/speed-converter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SpeedConverterTool />
    </>
  )
}