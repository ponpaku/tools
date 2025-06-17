import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import PDFMergeTool from '@/components/tools/pdf-merge-tool'

export const metadata: Metadata = generateToolMetadata('pdf-merge', '/tools/pdf-merge')

export default function PDFMergePage() {
  const structuredData = generateToolStructuredData('pdf-merge', '/tools/pdf-merge')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PDFMergeTool />
    </>
  )
}