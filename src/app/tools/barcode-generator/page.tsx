import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import BarcodeGeneratorTool from './barcode-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('barcode-generator', '/tools/barcode-generator')
}

export default function BarcodeGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('barcode-generator', '/tools/barcode-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <BarcodeGeneratorTool />
    </>
  )
}