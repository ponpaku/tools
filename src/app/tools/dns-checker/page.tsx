import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import DnsCheckerTool from './dns-checker-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('dns-checker', '/tools/dns-checker')
}

export default function DnsCheckerPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('dns-checker', '/tools/dns-checker', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <DnsCheckerTool />
    </>
  )
}