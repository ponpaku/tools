'use client'

import { Copy, Home, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SidebarNavigation } from './sidebar-navigation'
import { ToolPageAd } from '@/components/ads/ad-wrapper'
import { Footer } from './footer'
import { useState } from 'react'
import Link from 'next/link'

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
          {/* パンくずナビゲーション（ツールページの場合） */}
          {title && (
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                ホーム
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{title}</span>
            </nav>
          )}
          
          {title && (
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                  {description && <p className="text-gray-600">{description}</p>}
                </div>
                <Link href="/" className="self-start md:self-auto">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">ホームに戻る</span>
                    <span className="sm:hidden">ホーム</span>
                  </Button>
                </Link>
              </div>
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
        
        {/* フッター */}
        <Footer />
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