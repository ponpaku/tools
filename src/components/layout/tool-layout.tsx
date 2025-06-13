'use client'

import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppLayout } from './app-layout'
import { useState } from 'react'

interface ToolLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <AppLayout title={title} description={description} showAds={true}>
      {children}
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