import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import JSONFormatterTool from './json-formatter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('json-formatter', '/tools/json-formatter')
}

export default function JSONFormatterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('json-formatter', '/tools/json-formatter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <JSONFormatterTool />
    </>
  )
}