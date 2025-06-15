import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import HashGeneratorTool from './hash-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('hash-generator', '/tools/hash-generator')
}

export default function HashGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('hash-generator', '/tools/hash-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <HashGeneratorTool />
    </>
  )
}