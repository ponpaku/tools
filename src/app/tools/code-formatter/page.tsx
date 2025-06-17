import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import CodeFormatterTool from './code-formatter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('code-formatter', '/tools/code-formatter')
}

export default function CodeFormatterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('code-formatter', '/tools/code-formatter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <CodeFormatterTool />
    </>
  )
}