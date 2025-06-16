import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import FortuneGeneratorTool from './fortune-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('fortune-generator', '/tools/fortune-generator')
}

export default function FortuneGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('fortune-generator', '/tools/fortune-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <FortuneGeneratorTool />
    </>
  )
}