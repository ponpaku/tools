import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import SvgToImageTool from './svg-to-image-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('svg-to-image', '/tools/svg-to-image')
}

export default function SvgToImagePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('svg-to-image', '/tools/svg-to-image', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <SvgToImageTool />
    </>
  )
}