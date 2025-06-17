'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AreaUnit {
  name: string
  toSquareMeter: number // 1単位を平方メートルに変換する係数
}

const areaUnits: Record<string, AreaUnit> = {
  'm2': { name: '平方メートル (m²)', toSquareMeter: 1 },
  'km2': { name: '平方キロメートル (km²)', toSquareMeter: 1000000 },
  'cm2': { name: '平方センチメートル (cm²)', toSquareMeter: 0.0001 },
  'mm2': { name: '平方ミリメートル (mm²)', toSquareMeter: 0.000001 },
  'ha': { name: 'ヘクタール (ha)', toSquareMeter: 10000 },
  'are': { name: 'アール (a)', toSquareMeter: 100 },
  'acre': { name: 'エーカー (ac)', toSquareMeter: 4046.86 },
  'ft2': { name: '平方フィート (ft²)', toSquareMeter: 0.092903 },
  'yd2': { name: '平方ヤード (yd²)', toSquareMeter: 0.836127 },
  'in2': { name: '平方インチ (in²)', toSquareMeter: 0.00064516 },
  'mi2': { name: '平方マイル (mi²)', toSquareMeter: 2589988.11 },
  'tsubo': { name: '坪', toSquareMeter: 3.30579 },
  'tatami': { name: '畳', toSquareMeter: 1.65289 }, // 関西間基準
  'jou': { name: '帖', toSquareMeter: 1.65289 }
}

export default function AreaConverterTool() {
  const [fromUnit, setFromUnit] = useState<string>('m2')
  const [toUnit, setToUnit] = useState<string>('tsubo')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')

  const convertArea = useCallback((value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setOutputValue('')
      return
    }

    // 入力値を平方メートルに変換
    const squareMeterValue = numValue * areaUnits[fromUnit].toSquareMeter
    
    // 平方メートルから目標単位に変換
    const result = squareMeterValue / areaUnits[toUnit].toSquareMeter

    setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''))
  }, [fromUnit, toUnit])

  // 単位変更時に再計算
  useEffect(() => {
    if (inputValue) {
      convertArea(inputValue)
    }
  }, [fromUnit, toUnit, inputValue, convertArea])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    convertArea(value)
  }

  const handleFromUnitChange = (newFromUnit: string) => {
    setFromUnit(newFromUnit)
  }

  const handleToUnitChange = (newToUnit: string) => {
    setToUnit(newToUnit)
  }

  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    if (outputValue) {
      setInputValue(outputValue)
      convertArea(outputValue)
    }
  }

  return (
    <ToolLayout
      title="面積変換ツール"
      description="m²・km²・acres・坪・畳等の面積単位変換"
    >
      <div className="space-y-6">
        {/* 変換フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 入力 */}
          <Card>
            <CardHeader>
              <CardTitle>変換元</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(areaUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="面積値を入力"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* 出力 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                {outputValue && <CopyButton text={outputValue} />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={toUnit} onValueChange={handleToUnitChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(areaUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-lg p-3 bg-gray-50 rounded-lg font-mono">
                {outputValue || '－'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 入れ替えボタン */}
        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center gap-2"
          >
            ↔️ 単位を入れ替え
          </button>
        </div>

        {/* よく使う変換例 */}
        <Card>
          <CardHeader>
            <CardTitle>よく使う変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🏠 日本の住宅</h4>
                <ul className="space-y-1">
                  <li>1坪 = 3.31 m²</li>
                  <li>1畳 = 1.65 m²</li>
                  <li>100 m² = 30.3坪</li>
                  <li>6畳 = 9.9 m²</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🌾 農業・土地</h4>
                <ul className="space-y-1">
                  <li>1 ha = 10,000 m²</li>
                  <li>1 ac = 4,047 m²</li>
                  <li>1 km² = 100 ha</li>
                  <li>1 a = 100 m²</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🇺🇸 アメリカ単位</h4>
                <ul className="space-y-1">
                  <li>1 ft² = 0.093 m²</li>
                  <li>1 yd² = 0.836 m²</li>
                  <li>1 mi² = 259 ha</li>
                  <li>1 in² = 6.45 cm²</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>14種類の面積単位に対応</li>
                  <li>リアルタイム変換</li>
                  <li>高精度計算（小数点第6位まで）</li>
                  <li>単位の入れ替え機能</li>
                  <li>変換結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">対応単位</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>SI単位：m²、km²、cm²、mm²</li>
                  <li>農業単位：ha、a、エーカー</li>
                  <li>日本単位：坪、畳、帖</li>
                  <li>ヤードポンド法：ft²、yd²、in²、mi²</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>不動産・住宅の面積確認</li>
                  <li>農業・農地の面積計算</li>
                  <li>建築・設計での面積変換</li>
                  <li>測量・土地評価</li>
                  <li>海外不動産の面積比較</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">日本の面積単位について</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>坪：尺貫法による面積単位（1坪 = 6尺 × 6尺）</li>
                  <li>畳：関西間（本間）基準を使用</li>
                  <li>帖：畳と同じ面積（表記の違い）</li>
                  <li>地域により畳の大きさは異なります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}