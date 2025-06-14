'use client'

import { useState, useCallback } from 'react'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// ビンゴカードの型定義
interface BingoCard {
  id: string
  numbers: number[][]
  markedNumbers: Set<number>
  bingoLines: string[]
  isComplete: boolean
}

export default function BingoCardPage() {
  const [cards, setCards] = useState<BingoCard[]>([])
  const [cardCount, setCardCount] = useState('1')

  // ビンゴカード生成関数
  const generateBingoCard = useCallback((): BingoCard => {
    const generateColumn = (min: number, max: number): number[] => {
      const numbers: number[] = []
      const available = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * available.length)
        numbers.push(available[randomIndex])
        available.splice(randomIndex, 1)
      }
      
      return numbers
    }

    // 5つの列を生成
    const columns = [
      generateColumn(1, 15),   // B列
      generateColumn(16, 30),  // I列
      generateColumn(31, 45),  // N列
      generateColumn(46, 60),  // G列
      generateColumn(61, 75)   // O列
    ]

    // 5x5の配列に変換
    const numbers: number[][] = []
    for (let row = 0; row < 5; row++) {
      const rowNumbers: number[] = []
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          rowNumbers.push(0) // 中央のFREE
        } else {
          rowNumbers.push(columns[col][row])
        }
      }
      numbers.push(rowNumbers)
    }

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      numbers,
      markedNumbers: new Set([0]), // FREEは最初からマーク
      bingoLines: [],
      isComplete: false
    }
  }, [])

  // ビンゴ判定関数
  const checkBingo = useCallback((card: BingoCard): string[] => {
    const bingoLines: string[] = []
    const { numbers, markedNumbers } = card

    // 横のラインをチェック
    for (let row = 0; row < 5; row++) {
      let isComplete = true
      for (let col = 0; col < 5; col++) {
        const number = numbers[row][col]
        if (!markedNumbers.has(number)) {
          isComplete = false
          break
        }
      }
      if (isComplete) {
        bingoLines.push(`横${row + 1}`)
      }
    }

    // 縦のラインをチェック
    for (let col = 0; col < 5; col++) {
      let isComplete = true
      for (let row = 0; row < 5; row++) {
        const number = numbers[row][col]
        if (!markedNumbers.has(number)) {
          isComplete = false
          break
        }
      }
      if (isComplete) {
        bingoLines.push(`縦${col + 1}`)
      }
    }

    // 斜めのラインをチェック（左上から右下）
    let isDiagonal1Complete = true
    for (let i = 0; i < 5; i++) {
      const number = numbers[i][i]
      if (!markedNumbers.has(number)) {
        isDiagonal1Complete = false
        break
      }
    }
    if (isDiagonal1Complete) {
      bingoLines.push('斜め（↘）')
    }

    // 斜めのラインをチェック（右上から左下）
    let isDiagonal2Complete = true
    for (let i = 0; i < 5; i++) {
      const number = numbers[i][4 - i]
      if (!markedNumbers.has(number)) {
        isDiagonal2Complete = false
        break
      }
    }
    if (isDiagonal2Complete) {
      bingoLines.push('斜め（↙）')
    }

    return bingoLines
  }, [])

  // 数字マーク/マーク解除
  const toggleMark = useCallback((cardId: string, number: number) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card

      const newMarkedNumbers = new Set(card.markedNumbers)
      if (newMarkedNumbers.has(number)) {
        newMarkedNumbers.delete(number)
      } else {
        newMarkedNumbers.add(number)
      }

      const updatedCard = {
        ...card,
        markedNumbers: newMarkedNumbers
      }

      const bingoLines = checkBingo(updatedCard)
      
      return {
        ...updatedCard,
        bingoLines,
        isComplete: bingoLines.length > 0
      }
    }))
  }, [checkBingo])

  // カード生成
  const generateCards = useCallback(() => {
    const count = parseInt(cardCount) || 1
    const newCards: BingoCard[] = []
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      newCards.push(generateBingoCard())
    }
    
    setCards(prev => [...prev, ...newCards])
  }, [cardCount, generateBingoCard])

  // 全カードクリア
  const clearAllCards = useCallback(() => {
    setCards([])
  }, [])

  // カード削除
  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }, [])

  // カードリセット（マークを全て解除）
  const resetCard = useCallback((cardId: string) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card
      
      return {
        ...card,
        markedNumbers: new Set([0]), // FREEのみマーク
        bingoLines: [],
        isComplete: false
      }
    }))
  }, [])

  return (
    <ToolLayout
      title="ビンゴカード"
      description="ビンゴカード生成・管理ツール - プレイヤー用"
    >
      <div className="space-y-6">
        {/* カード生成コントロール */}
        <Card>
          <CardHeader>
            <CardTitle>カード生成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">生成枚数</label>
                <Input
                  type="number"
                  value={cardCount}
                  onChange={(e) => setCardCount(e.target.value)}
                  min="1"
                  max="10"
                  className="w-20"
                />
              </div>
              <Button onClick={generateCards}>
                カード生成
              </Button>
              {cards.length > 0 && (
                <Button variant="outline" onClick={clearAllCards}>
                  全削除
                </Button>
              )}
            </div>
            
            {cards.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                現在 {cards.length} 枚のカードがあります
                {cards.filter(card => card.isComplete).length > 0 && (
                  <span className="ml-2 text-green-600 font-semibold">
                    🎉 {cards.filter(card => card.isComplete).length} 枚でビンゴ達成！
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ビンゴカード一覧 */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Card 
                key={card.id} 
                className={`
                  ${card.isComplete ? 'border-green-500 bg-green-50' : ''}
                `}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      カード {index + 1}
                      {card.isComplete && (
                        <Badge className="ml-2 bg-green-500">
                          BINGO!
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetCard(card.id)}
                      >
                        リセット
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                  
                  {card.bingoLines.length > 0 && (
                    <div className="text-sm text-green-600 font-semibold">
                      完成ライン: {card.bingoLines.join(', ')}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {/* ビンゴカードグリッド */}
                  <div className="space-y-2">
                    {/* ヘッダー（オプション表示） */}
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      {['B', 'I', 'N', 'G', 'O'].map(letter => (
                        <div key={letter} className="text-center font-bold text-sm py-1 bg-blue-100 rounded text-blue-700">
                          {letter}
                        </div>
                      ))}
                    </div>
                    
                    {/* カードの数字 */}
                    <div className="grid grid-cols-5 gap-1">
                      {card.numbers.flat().map((number, cellIndex) => {
                        const row = Math.floor(cellIndex / 5)
                        const col = cellIndex % 5
                        const isCenter = row === 2 && col === 2
                        const isMarked = card.markedNumbers.has(number)
                        
                        return (
                          <button
                            key={cellIndex}
                            onClick={() => !isCenter && toggleMark(card.id, number)}
                            className={`
                              aspect-square flex items-center justify-center text-sm font-semibold rounded
                              transition-all duration-200
                              ${isMarked 
                                ? 'bg-blue-500 text-white shadow-lg' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }
                              ${isCenter ? 'cursor-default' : 'cursor-pointer'}
                              ${card.isComplete && isMarked ? 'animate-pulse' : ''}
                            `}
                          >
                            {isCenter ? 'FREE' : number}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* カードが未生成の場合の案内 */}
        {cards.length === 0 && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="text-gray-500 space-y-2">
                <div className="text-xl">📋</div>
                <div>まだビンゴカードがありません</div>
                <div className="text-sm">上の「カード生成」ボタンからカードを作成してください</div>
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
                  <li>「カード生成」で新しいビンゴカードを作成できます</li>
                  <li>カードの数字をクリックしてマーク/マーク解除ができます</li>
                  <li>中央の「FREE」は最初からマークされています</li>
                  <li>縦・横・斜めのいずれかのラインが完成すると「BINGO」です</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">カード管理</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>最大10枚まで同時にカードを管理できます</li>
                  <li>「リセット」でカードのマークを全て解除できます</li>
                  <li>「削除」で不要なカードを削除できます</li>
                  <li>「全削除」で全てのカードを一括削除できます</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">数字の範囲</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>B列:</strong> 1〜15の数字</li>
                  <li><strong>I列:</strong> 16〜30の数字</li>
                  <li><strong>N列:</strong> 31〜45の数字（中央はFREE）</li>
                  <li><strong>G列:</strong> 46〜60の数字</li>
                  <li><strong>O列:</strong> 61〜75の数字</li>
                </ul>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold mb-2">ヒント</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ビンゴルーレットツールと組み合わせてご利用ください</li>
                  <li>複数のカードを使って当選確率を上げられます</li>
                  <li>印刷機能でカードを紙に印刷することも可能です</li>
                  <li>スマートフォンでも快適に操作できます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}