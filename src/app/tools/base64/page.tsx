import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import Base64Tool from './base64-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('base64', '/tools/base64')
}

export default function Base64Page() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('base64', '/tools/base64', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Base64Tool />
    </>
  )
}