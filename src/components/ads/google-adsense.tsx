'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface GoogleAdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  adSize?: 'small' | 'medium' | 'large' | 'responsive'
  className?: string
  style?: React.CSSProperties
}

export function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  adSize = 'responsive',
  className = '',
  style = {}
}: GoogleAdSenseProps) {
  useEffect(() => {
    // AdSenseスクリプトが読み込まれているかチェック
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense広告の読み込みに失敗しました:', err)
      }
    }
  }, [])

  // 開発環境では表示しない
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`} style={style}>
        <div className="text-gray-500 text-sm font-medium">
          🖼️ AdSense広告エリア
        </div>
        <div className="text-gray-400 text-xs mt-1">
          本番環境で表示されます (Slot: {adSlot})
        </div>
      </div>
    )
  }

  // サイズクラスを動的に設定
  const getSizeClasses = () => {
    switch (adSize) {
      case 'small':
        return 'h-[150px] max-w-[300px]'
      case 'medium':
        return 'h-[250px] max-w-[300px]'
      case 'large':
        return 'h-[600px] max-w-[300px]'
      case 'responsive':
      default:
        return 'min-h-[150px] w-full'
    }
  }

  return (
    <div className={`${getSizeClasses()} ${className}`} style={style}>
      <ins
        className="adsbygoogle block w-full h-full"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7607779602110545"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// 事前定義された広告コンポーネント
export function AdBanner({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <GoogleAdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || ''}
      adFormat="horizontal"
      adSize="responsive"
      className={className}
      style={style}
    />
  )
}

export function AdSquare({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <GoogleAdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SQUARE_SLOT || ''}
      adFormat="rectangle"
      adSize="medium"
      className={className}
      style={style}
    />
  )
}

export function AdSidebar({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <GoogleAdSense
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || ''}
      adFormat="vertical"
      adSize="large"
      className={className}
      style={style}
    />
  )
}