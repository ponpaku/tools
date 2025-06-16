import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import HttpHeaderViewerTool from './http-header-viewer-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('http-header-viewer', '/tools/http-header-viewer')
}

export default function HttpHeaderViewerPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('http-header-viewer', '/tools/http-header-viewer', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <HttpHeaderViewerTool />
    </>
  )
}