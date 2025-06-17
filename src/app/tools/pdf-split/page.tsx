import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import PDFSplitTool from '@/components/tools/pdf-split-tool'

export const metadata: Metadata = generateToolMetadata('pdf-split', '/tools/pdf-split')

export default function PDFSplitPage() {
  const structuredData = generateToolStructuredData('pdf-split', '/tools/pdf-split')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PDFSplitTool />
    </>
  )
}