import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import QRGeneratorTool from './qr-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('qr-generator', '/tools/qr-generator')
}

export default function QRGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('qr-generator', '/tools/qr-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <QRGeneratorTool />
    </>
  )
}