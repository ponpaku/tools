'use client'

import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SidebarNavigation } from './sidebar-navigation'
import { ToolPageAd } from '@/components/ads/ad-wrapper'
import { useState } from 'react'

interface AppLayoutProps {
  title?: string
  description?: string
  children: React.ReactNode
  showCard?: boolean
  showAds?: boolean
}

export function AppLayout({ title, description, children, showCard = true, showAds = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SidebarNavigation />
      
      {/* メインコンテンツ */}
      <main className="lg:ml-80 min-h-screen">
        <div className="pt-16 lg:pt-8 px-4 lg:px-8 py-8">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}

          {showCard ? (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* ツールページ用広告 (上部) */}
              {showAds && <ToolPageAd />}
              
              <Card>
                <CardContent className="p-6">
                  {children}
                </CardContent>
              </Card>
              
              {/* ツールページ用広告 (下部) */}
              {showAds && <ToolPageAd />}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      onClick={copyToClipboard}
      variant="outline"
      size="sm"
      className={className}
    >
      <Copy className="mr-2 h-4 w-4" />
      {copied ? 'コピーしました' : 'コピー'}
    </Button>
  )
}