import { Metadata } from 'next'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import ExcelToHtmlTool from './excel-to-html-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('excel-to-html', '/tools/excel-to-html')
}

export default function ExcelToHtmlPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('excel-to-html', '/tools/excel-to-html', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ExcelToHtmlTool />
    </>
  )
}