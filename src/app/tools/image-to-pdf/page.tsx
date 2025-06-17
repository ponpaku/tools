import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import ImageToPDFTool from '@/components/tools/image-to-pdf-tool'

export const metadata: Metadata = generateToolMetadata('image-to-pdf', '/tools/image-to-pdf')

export default function ImageToPDFPage() {
  const structuredData = generateToolStructuredData('image-to-pdf', '/tools/image-to-pdf')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageToPDFTool />
    </>
  )
}