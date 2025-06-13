'use client'

import { Card, CardContent } from '@/components/ui/card'
import { GoogleAdSense } from './google-adsense'

interface AdWrapperProps {
  adSlot: string
  title?: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  adSize?: 'small' | 'medium' | 'large' | 'responsive'
  className?: string
  showBorder?: boolean
  showTitle?: boolean
}

export function AdWrapper({
  adSlot,
  title = 'スポンサードリンク',
  adFormat = 'auto',
  adSize = 'responsive',
  className = '',
  showBorder = true,
  showTitle = true
}: AdWrapperProps) {
  const AdContent = () => (
    <div className="space-y-2">
      {showTitle && (
        <div className="text-xs text-gray-500 text-center font-medium">
          {title}
        </div>
      )}
      <GoogleAdSense
        adSlot={adSlot}
        adFormat={adFormat}
        adSize={adSize}
      />
    </div>
  )

  if (showBorder) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <AdContent />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <AdContent />
    </div>
  )
}

// 特定の用途向けの広告ラッパー
export function HomePageAd({ className }: { className?: string }) {
  return (
    <AdWrapper
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT || ''}
      title="おすすめ"
      adFormat="rectangle"
      adSize="responsive"
      className={className}
      showBorder={true}
    />
  )
}

export function ToolPageAd({ className }: { className?: string }) {
  return (
    <AdWrapper
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_TOOL_SLOT || ''}
      title="関連サービス"
      adFormat="horizontal"
      adSize="responsive"
      className={className}
      showBorder={true}
    />
  )
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <AdWrapper
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ''}
      title="スポンサー"
      adFormat="vertical"
      adSize="large"
      className={className}
      showBorder={false}
    />
  )
}