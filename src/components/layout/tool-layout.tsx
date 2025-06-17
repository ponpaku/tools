'use client'

import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { AppLayout } from './app-layout'
import { useState } from 'react'
import { getToolIdByTitle } from '@/lib/tool-utils'

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const toolId = getToolIdByTitle(title)
  
  return (
    <AppLayout title={title} description={description} showAds={true}>
      <div className="space-y-6">
        {/* ツールヘッダー */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          {toolId && (
            <FavoriteButton toolId={toolId} />
          )}
        </div>
        
        {/* ツールコンテンツ */}
        <div>
          {children}
        </div>
      </div>
    </AppLayout>
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