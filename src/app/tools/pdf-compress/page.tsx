import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import PDFCompressTool from '@/components/tools/pdf-compress-tool'

export const metadata: Metadata = generateToolMetadata('pdf-compress', '/tools/pdf-compress')

export default function PDFCompressPage() {
  const structuredData = generateToolStructuredData('pdf-compress', '/tools/pdf-compress')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PDFCompressTool />
    </>
  )
}