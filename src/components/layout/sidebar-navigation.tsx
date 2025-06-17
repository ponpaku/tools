'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, Home, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toolsConfig } from '@/lib/tools-config'
import { cn } from '@/lib/utils'

export function SidebarNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  // デフォで開いときたいカテゴリはここに配列で入れる
  // 例：const [expandedCategories, setExpandedCategories] = useState<string[]>(['text', 'encoding', 'datetime'])
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['text'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      Type: '📝',
      Lock: '🔒',
      Calendar: '📅',
      Code: '💻',
      Sparkles: '✨',
      Image: '🖼️',
      Gamepad2: '🎮',
      Calculator: '🧮',
      DollarSign: '💰',
      Network: '🌐',
      Wrench: '🔧',
      Settings: '⚙️'
    }
    return iconMap[iconName] || '🔧'
  }

  const getToolIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      Activity: '🏃',
      AlignLeft: '📝',
      ArrowLeftRight: '↔️',
      ArrowUpDown: '↕️',
      Binary: '🔢',
      Bookmark: '🔖',
      Braces: '{}',
      Calculator: '🧮',
      Calendar: '📅',
      CalendarDays: '📆',
      CaseSensitive: 'Aa',
      CircleDot: '⭕',
      Clock: '⏰',
      Clock4: '🕐',
      Code: '💻',
      CreditCard: '💳',
      Dices: '🎲',
      DollarSign: '💰',
      Eye: '👁️',
      FileCode: '📄',
      FileSearch: '🔍',
      FileText: '📄',
      Fingerprint: '🔐',
      Gamepad2: '🎮',
      GitCompare: '🔍',
      Grid3X3: '🔲',
      Hash: '#️⃣',
      Heart: '❤️',
      Highlighter: '🖍️',
      Image: '🖼️',
      Key: '🔑',
      Languages: '🈯',
      Link: '🔗',
      List: '📋',
      Lock: '🔒',
      MapPin: '📍',
      Maximize2: '🔍',
      Minimize2: '🗜️',
      Network: '🌐',
      Palette: '🎨',
      Percent: '💯',
      QrCode: '📱',
      RefreshCw: '🔄',
      RotateCcw: '↩️',
      ScanLine: '📖',
      Search: '🔍',
      Shield: '🛡️',
      ShoppingCart: '🛒',
      Smile: '😀',
      Sparkles: '✨',
      Spellcheck: '✔️',
      Star: '⭐',
      TestTube: '🧪',
      Timer: '⏱️',
      TrendingUp: '📈',
      Trophy: '🏆',
      Type: '📝',
      Weight: '⚖️',
      Wifi: '📶',
      Wrench: '🔧',
      Zap: '⚡'
    }
    return iconMap[iconName] || '🔧'
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          <span className="text-2xl">🔧</span>
          <span>ぽんぱくツール</span>
        </Link>
      </div>

      {/* ナビゲーション */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* ホーム */}
        <Link href="/">
          <Button
            variant={pathname === '/' ? 'default' : 'ghost'}
            className="w-full justify-start text-left"
          >
            <Home className="mr-2 h-4 w-4" />
            ホーム
          </Button>
        </Link>

        {/* カテゴリリスト */}
        {toolsConfig.categories.map(category => (
          <Collapsible
            key={category.id}
            open={expandedCategories.includes(category.id)}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left p-2 h-auto"
              >
                <div className="flex items-center">
                  <span className="mr-2">{getIcon(category.icon)}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-1 space-y-1">
              {category.tools.map(tool => (
                <Link key={tool.id} href={tool.path}>
                  <Button
                    variant={pathname === tool.path ? 'default' : 'ghost'}
                    className={cn(
                      "w-full justify-start text-left p-2 h-auto text-sm",
                      pathname === tool.path && "bg-blue-100 text-blue-700"
                    )}
                  >
                    <span className="mr-2 text-xs">{getToolIcon(tool.icon)}</span>
                    <span>{tool.name}</span>
                  </Button>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* モバイル用ハンバーガーメニュー */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      )}

      {/* サイドバー */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* モバイル用クローズボタン */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SidebarContent />
      </aside>
    </>
  )
}