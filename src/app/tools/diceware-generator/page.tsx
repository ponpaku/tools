import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import DicewareGeneratorTool from './diceware-generator-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('diceware-generator', '/tools/diceware-generator')
}

export default function DicewareGeneratorPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('diceware-generator', '/tools/diceware-generator', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <DicewareGeneratorTool />
    </>
  )
}