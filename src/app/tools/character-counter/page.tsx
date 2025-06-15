import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'
import { Metadata } from 'next'
import CharacterCounterTool from './character-counter-tool'

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata('character-counter', '/tools/character-counter')
}

export default function CharacterCounterPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  const structuredData = generateToolStructuredData('character-counter', '/tools/character-counter', siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <CharacterCounterTool />
    </>
  )
}