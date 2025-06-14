'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, RotateCcw, Settings, History } from 'lucide-react'

interface RouletteResult {
  item: string
  timestamp: Date
}

export default function RoulettePage() {
  const [items, setItems] = useState<string[]>(['項目1', '項目2', '項目3', '項目4'])
  const [inputText, setInputText] = useState('')
  const [newItem, setNewItem] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [results, setResults] = useState<RouletteResult[]>([])
  const [removeAfterSelection, setRemoveAfterSelection] = useState(false)
  const [currentAngle, setCurrentAngle] = useState(0)
  const [currentSpeed, setCurrentSpeed] = useState(0)
  
  const spinInterval = useRef<NodeJS.Timeout | null>(null)
  const INITIAL_SPEED = 8 // 初期回転速度（度/フレーム）
  const DECELERATION = 0.15 // 減速度

  // 現在の角度から項目を判定する関数
  const getCurrentItemFromAngle = useCallback((angle: number): string => {
    if (items.length === 0) return ''
    
    const segmentAngle = 360 / items.length
    
    // CSSの`transform: rotate(angle)`はホイールを時計回りに回転させます。
    // ポインターは12時方向に固定されているため、回転後のポインターの位置は、
    // 回転前のホイールでいうと「-angle」の位置に相当します。
    // この角度を [0, 360) の範囲に正規化します。
    const lookupAngle = ((-angle % 360) + 360) % 360
    
    // 正規化した角度をセグメントの角度で割り、床関数を取ることで、
    // どのセグメントに属するか（=項目のインデックス）を正確に計算できます。
    const segmentIndex = Math.floor(lookupAngle / segmentAngle)
    
    return items[segmentIndex] ?? items[0]
  }, [items])

  // バルク入力からアイテムを追加
  const handleBulkAdd = useCallback(() => {
    if (!inputText.trim()) return
    
    const newItems = inputText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0 && item.length <= 50) // 50文字制限
      .filter(item => !items.includes(item))
    
    if (newItems.length > 0) {
      const totalItems = items.length + newItems.length
      if (totalItems > 20) {
        alert('項目数は最大20個までです')
        return
      }
      setItems(prev => [...prev, ...newItems])
      setInputText('')
    }
  }, [inputText, items])

  // 個別アイテム追加
  const handleAddItem = useCallback(() => {
    if (!newItem.trim() || items.includes(newItem.trim())) return
    
    if (newItem.trim().length > 50) {
      alert('項目は50文字以内で入力してください')
      return
    }
    
    if (items.length >= 20) {
      alert('項目数は最大20個までです')
      return
    }
    
    setItems(prev => [...prev, newItem.trim()])
    setNewItem('')
  }, [newItem, items])

  // アイテム削除
  const handleRemoveItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 全アイテムクリア
  const handleClearAll = useCallback(() => {
    setItems([])
    setSelectedItem('')
    setResults([])
  }, [])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current)
      }
    }
  }, [])

  // スピン開始
  const handleSpin = useCallback(() => {
    if (items.length === 0 || isSpinning) return

    setIsSpinning(true)
    setIsStopping(false)
    setSelectedItem('')
    setCurrentSpeed(INITIAL_SPEED)

    let speed = INITIAL_SPEED
    spinInterval.current = setInterval(() => {
      setCurrentAngle(prevAngle => {
        const newAngle = prevAngle + speed
        return newAngle % 360
      })
    }, 16) // 60fps
  }, [items, isSpinning])

  // スピン停止
  const handleStop = useCallback(() => {
    if (!isSpinning || isStopping) return
    
    setIsStopping(true)
    
    // 既存のスピンインターバルをクリア
    if (spinInterval.current) {
      clearInterval(spinInterval.current)
    }
    
    // 減速アニメーション
    let currentSpeedRef = currentSpeed
    const decelerateInterval = setInterval(() => {
      currentSpeedRef = Math.max(0, currentSpeedRef - DECELERATION)
      
      if (currentSpeedRef <= 0) {
        // 完全停止
        clearInterval(decelerateInterval)
        
        // 最終結果を確定
        setCurrentAngle(prevAngle => {
          const finalItem = getCurrentItemFromAngle(prevAngle)
          setSelectedItem(finalItem)
          setResults(prev => [
            { item: finalItem, timestamp: new Date() },
            ...prev.slice(0, 9)
          ])

          // 除去モードの場合はアイテムを削除
          if (removeAfterSelection) {
            // 選択されたアイテム名で削除（判定ロジックに自動追随）
            setItems(prev => prev.filter(item => item !== finalItem))
          }

          return prevAngle
        })

        setIsSpinning(false)
        setIsStopping(false)
        setCurrentSpeed(0)
      } else {
        // 回転を継続（減速しながら）
        setCurrentAngle(prevAngle => {
          const newAngle = prevAngle + currentSpeedRef
          return newAngle % 360
        })
        setCurrentSpeed(currentSpeedRef)
      }
    }, 16)
  }, [isSpinning, isStopping, currentSpeed, getCurrentItemFromAngle, removeAfterSelection])

  // ルーレットホイールの色を計算
  const wheelColors = useMemo(() => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return items.map((_, index) => colors[index % colors.length])
  }, [items])

  // SVGルーレットホイールのパス計算
  const wheelSegments = useMemo(() => {
    if (items.length === 0) return []
    
    const segmentAngle = 360 / items.length
    const radius = 150
    const centerX = 150
    const centerY = 150

    return items.map((item, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
      
      const x1 = centerX + Math.cos(startAngle) * radius
      const y1 = centerY + Math.sin(startAngle) * radius
      const x2 = centerX + Math.cos(endAngle) * radius
      const y2 = centerY + Math.sin(endAngle) * radius
      
      const largeArc = segmentAngle > 180 ? 1 : 0
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      // テキスト位置計算
      const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180)
      const textRadius = radius * 0.7
      const textX = centerX + Math.cos(textAngle) * textRadius
      const textY = centerY + Math.sin(textAngle) * textRadius

      return {
        path: pathData,
        color: wheelColors[index],
        text: item,
        textX,
        textY,
        textAngle: (index * segmentAngle + segmentAngle / 2) % 360
      }
    })
  }, [items, wheelColors])

  return (
    <ToolLayout
      title="ルーレット"
      description="カスタムルーレットで抽選・選択ができます"
    >
      <div className="space-y-6">
        {/* アイテム管理セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              ルーレット項目設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* バルク入力 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                一括入力（1行に1項目）
              </label>
              <div className="flex gap-2">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="項目1&#10;項目2&#10;項目3..."
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleBulkAdd}
                  disabled={!inputText.trim()}
                  className="self-start"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  追加
                </Button>
              </div>
            </div>

            {/* 個別追加 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                個別追加
              </label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="新しい項目を入力..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <Button 
                  onClick={handleAddItem}
                  disabled={!newItem.trim() || items.includes(newItem.trim())}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  追加
                </Button>
              </div>
            </div>

            {/* 設定オプション */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeAfterSelection}
                  onChange={(e) => setRemoveAfterSelection(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">選択後に項目を除去する</span>
              </label>
            </div>

            {/* 現在の項目一覧 */}
            {items.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    現在の項目 ({items.length}個)
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearAll}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    全削除
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {item}
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ルーレットホイール */}
        <Card>
          <CardHeader>
            <CardTitle>ルーレット</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {items.length === 0 ? (
              <div className="py-8 text-gray-500">
                項目を追加してください
              </div>
            ) : (
              <>
                <div className="relative inline-block">
                  {/* ポインター */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
                  </div>
                  
                  {/* ルーレットホイール */}
                  <div 
                    style={{ 
                      transform: `rotate(${currentAngle}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <svg width="300" height="300" className="border-4 border-gray-300 rounded-full">
                      {wheelSegments.map((segment, index) => (
                        <g key={index}>
                          <path
                            d={segment.path}
                            fill={segment.color}
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          <text
                            x={segment.textX}
                            y={segment.textY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="12"
                            fill="#333"
                            fontWeight="bold"
                            transform={`rotate(${segment.textAngle > 90 && segment.textAngle < 270 ? segment.textAngle + 180 : segment.textAngle}, ${segment.textX}, ${segment.textY})`}
                            className="select-none"
                          >
                            {segment.text.length > 8 ? segment.text.substring(0, 8) + '...' : segment.text}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                <Button 
                  onClick={isSpinning ? handleStop : handleSpin}
                  size="lg"
                  className="min-w-[120px]"
                  variant={isSpinning ? "destructive" : "default"}
                >
                  <RotateCcw className={`h-5 w-5 mr-2 ${isSpinning && !isStopping ? 'animate-spin' : ''}`} />
                  {isSpinning ? (isStopping ? '停止中...' : '停止') : 'スピン！'}
                </Button>

                {selectedItem && !isSpinning && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">🎉 結果</h3>
                    <div className="text-2xl font-bold text-yellow-900">{selectedItem}</div>
                    <div className="mt-2">
                      <CopyButton text={selectedItem} />
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 履歴 */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                抽選履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="font-medium">{result.item}</span>
                    </div>
                    <CopyButton text={result.item} className="flex-shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setResults([])}
                >
                  履歴をクリア
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使い方ガイド */}
        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">基本的な使い方</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>テキストエリアに項目を入力（1行に1項目）</li>
                  <li>「追加」ボタンでルーレットに項目を追加</li>
                  <li>「スピン！」ボタンでルーレットを回転</li>
                  <li>結果が表示されます</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">便利な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>除去モード</strong>: 選択された項目を自動的に削除（トーナメント等に便利）</li>
                  <li><strong>履歴機能</strong>: 過去の抽選結果を記録・コピー可能</li>
                  <li><strong>個別編集</strong>: 項目の個別追加・削除が可能</li>
                  <li><strong>視覚的演出</strong>: 3秒間のスピンアニメーション</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}