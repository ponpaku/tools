import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import UUIDGeneratorTool from './uuid-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('uuid-generator', '/tools/uuid-generator')
}

export default function UUIDGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('uuid-generator', '/tools/uuid-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <UUIDGeneratorTool />
    </>
  )
}