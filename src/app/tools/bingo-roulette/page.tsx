'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Maximize, Minimize } from 'lucide-react'

interface RouletteState {
  currentNumber: number | null
  drawnNumbers: number[]
  isDrawing: boolean
  animationNumber: number
  isFullScreen: boolean
}

export default function BingoRoulettePage() {
  const [rouletteState, setRouletteState] = useState<RouletteState>({
    currentNumber: null,
    drawnNumbers: [],
    isDrawing: false,
    animationNumber: 1,
    isFullScreen: false
  })
  
  const animationInterval = useRef<NodeJS.Timeout | null>(null)

  // 番号抽選関数（アニメーション付き）
  const drawNumber = useCallback(() => {
    // 残りの番号を取得
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(num => !rouletteState.drawnNumbers.includes(num))
    
    if (availableNumbers.length === 0) {
      alert('全ての番号が抽選されました！')
      return
    }

    // 最終的に抽選される番号を決定
    const finalNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
    
    // アニメーション開始
    setRouletteState(prev => ({
      ...prev,
      isDrawing: true,
      animationNumber: Math.floor(Math.random() * 75) + 1
    }))

    // パラパラアニメーション
    let animationCount = 0
    const maxAnimations = 25 // アニメーション回数
    
    animationInterval.current = setInterval(() => {
      animationCount++
      
      if (animationCount >= maxAnimations) {
        // アニメーション終了 - 最終番号を表示
        if (animationInterval.current) {
          clearInterval(animationInterval.current)
        }
        
        setRouletteState(prev => ({
          ...prev,
          currentNumber: finalNumber,
          drawnNumbers: [...prev.drawnNumbers, finalNumber],
          isDrawing: false,
          animationNumber: finalNumber
        }))
      } else {
        // ランダムな数字でアニメーション
        const randomNum = Math.floor(Math.random() * 75) + 1
        setRouletteState(prev => ({
          ...prev,
          animationNumber: randomNum
        }))
      }
    }, 50) // 50ms間隔でアニメーション
  }, [rouletteState.drawnNumbers])

  // ゲームリセット
  const resetGame = useCallback(() => {
    if (animationInterval.current) {
      clearInterval(animationInterval.current)
    }
    
    setRouletteState(prev => ({
      ...prev,
      currentNumber: null,
      drawnNumbers: [],
      isDrawing: false,
      animationNumber: 1
    }))
  }, [])

  // 前の番号に戻す
  const undoLastDraw = useCallback(() => {
    if (rouletteState.drawnNumbers.length === 0) return
    
    const newDrawnNumbers = [...rouletteState.drawnNumbers]
    newDrawnNumbers.pop()
    
    setRouletteState(prev => ({
      ...prev,
      currentNumber: newDrawnNumbers.length > 0 ? newDrawnNumbers[newDrawnNumbers.length - 1] : null,
      drawnNumbers: newDrawnNumbers
    }))
  }, [rouletteState.drawnNumbers])

  // 全画面モード切り替え
  const toggleFullScreen = useCallback(() => {
    setRouletteState(prev => ({
      ...prev,
      isFullScreen: !prev.isFullScreen
    }))
  }, [])

  // Escキーで全画面モード解除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && rouletteState.isFullScreen) {
        setRouletteState(prev => ({
          ...prev,
          isFullScreen: false
        }))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [rouletteState.isFullScreen])

  // 番号グリッドコンポーネント
  const NumberGrid = ({ className = "" }: { className?: string }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>番号一覧</CardTitle>
        <div className="text-sm text-gray-600">
          {rouletteState.drawnNumbers.length}/75 ({75 - rouletteState.drawnNumbers.length}個残り)
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 75 }, (_, i) => i + 1).map((number) => {
            const isDrawn = rouletteState.drawnNumbers.includes(number)
            const isLatest = rouletteState.currentNumber === number
            
            return (
              <div
                key={number}
                className={`
                  aspect-square flex items-center justify-center text-sm font-bold rounded-lg transition-all duration-300
                  ${isDrawn 
                    ? isLatest 
                      ? 'bg-red-500 text-white shadow-lg scale-110 animate-pulse' 
                      : 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {number}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  // 抽選エリアコンポーネント
  const DrawingArea = ({ className = "" }: { className?: string }) => (
    <Card className={`text-center ${className}`}>
      <CardContent className="pt-8 pb-8">
        <div className="space-y-6">
          {/* 大きな数字表示 */}
          <div className="relative">
            <div 
              className={`
                text-8xl md:text-9xl font-bold transition-all duration-200
                ${rouletteState.isDrawing 
                  ? 'text-orange-500 scale-110' 
                  : rouletteState.currentNumber 
                    ? 'text-blue-600 scale-100' 
                    : 'text-gray-400 scale-100'
                }
              `}
            >
              {rouletteState.isDrawing || rouletteState.currentNumber 
                ? rouletteState.animationNumber 
                : '?'
              }
            </div>
            
            {rouletteState.isDrawing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 opacity-30"></div>
              </div>
            )}
          </div>

          {/* 状態表示 */}
          <div className="text-lg text-gray-600">
            {rouletteState.isDrawing ? (
              <span className="text-orange-600 font-semibold">抽選中...</span>
            ) : rouletteState.currentNumber ? (
              <span className="text-blue-600 font-semibold">
                最新の抽選番号: {rouletteState.currentNumber}
              </span>
            ) : (
              <span>番号を抽選してください</span>
            )}
          </div>

          {/* 抽選ボタン */}
          <div className="space-y-3">
            <Button 
              onClick={drawNumber} 
              disabled={rouletteState.isDrawing || rouletteState.drawnNumbers.length >= 75}
              className="text-xl px-8 py-4 h-auto"
              size="lg"
            >
              {rouletteState.isDrawing ? '抽選中...' : '番号を抽選'}
            </Button>
            
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                onClick={undoLastDraw}
                disabled={rouletteState.drawnNumbers.length === 0 || rouletteState.isDrawing}
              >
                戻す
              </Button>
              <Button 
                variant="outline" 
                onClick={resetGame}
                disabled={rouletteState.isDrawing}
              >
                リセット
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 全画面モードの場合
  if (rouletteState.isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex">
        {/* 左側: 抽選エリア */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <DrawingArea />
          
          {/* 全画面モード解除ボタン */}
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={toggleFullScreen}
              className="flex items-center gap-2"
            >
              <Minimize className="w-4 h-4" />
              全画面解除 (Esc)
            </Button>
          </div>
        </div>
        
        {/* 右側: 番号グリッド */}
        <div className="flex-1 p-4">
          <NumberGrid className="h-full" />
        </div>
      </div>
    )
  }

  // 通常モードの場合
  return (
    <ToolLayout
      title="ビンゴ抽選機"
      description="番号抽選器 - 司会者・ホスト用ツール"
    >
      <div className="space-y-6">
        {/* 全画面ボタン */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={toggleFullScreen}
            className="flex items-center gap-2"
          >
            <Maximize className="w-4 h-4" />
            全画面モード
          </Button>
        </div>

        {/* メイン抽選エリア */}
        <DrawingArea />

        {/* 番号グリッド */}
        <NumberGrid />

        {/* 抽選履歴 */}
        {rouletteState.drawnNumbers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>抽選履歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 最新の5個を大きく表示 */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-600">最近の抽選</h4>
                  <div className="flex flex-wrap gap-2">
                    {rouletteState.drawnNumbers.slice(-5).reverse().map((number, index) => (
                      <div
                        key={number}
                        className={`
                          px-3 py-2 rounded-lg font-bold text-lg
                          ${index === 0 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 全履歴 */}
                {rouletteState.drawnNumbers.length > 5 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-600">全ての抽選履歴</h4>
                    <div className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto">
                      {rouletteState.drawnNumbers.map((number) => (
                        <div
                          key={number}
                          className="aspect-square flex items-center justify-center text-xs font-medium bg-gray-50 rounded text-gray-600"
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使い方ガイド */}
        <Card>
          <CardHeader>
            <CardTitle>使い方ガイド</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">基本操作</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>「番号を抽選」ボタンで1〜75の番号をランダムに抽選します</li>
                  <li>抽選時にはパラパラとアニメーションが表示されます</li>
                  <li>「戻す」ボタンで最後の抽選を取り消せます</li>
                  <li>「リセット」ボタンで全ての履歴をクリアできます</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">番号一覧機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>1〜75の全番号がグリッド表示されます</li>
                  <li>抽選済みの番号は青色でハイライトされます</li>
                  <li>最新の抽選番号は赤色で強調表示されます</li>
                  <li>残り番号数も表示されるため進捗が一目でわかります</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">全画面モード</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>「全画面モード」ボタンで大画面表示に切り替えられます</li>
                  <li>左側に抽選エリア、右側に番号一覧が表示されます</li>
                  <li>Escキーまたは「全画面解除」ボタンで通常モードに戻ります</li>
                  <li>プロジェクター投影時に最適な表示形式です</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">ヒント</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>番号一覧で既出番号を素早く確認できます</li>
                  <li>ビンゴカードツールと組み合わせてご利用ください</li>
                  <li>抽選アニメーションで盛り上がりを演出できます</li>
                  <li>全画面モードは大人数でのビンゴゲームに最適です</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}