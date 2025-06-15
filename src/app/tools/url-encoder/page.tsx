import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import URLEncoderTool from './url-encoder-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('url-encoder', '/tools/url-encoder')
}

export default function URLEncoderPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('url-encoder', '/tools/url-encoder', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <URLEncoderTool />
    </>
  )
}