'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type UnitCategory = 'length' | 'weight' | 'temperature'

interface UnitConversions {
  length: {
    [key: string]: { name: string; factor: number }
  }
  weight: {
    [key: string]: { name: string; factor: number }
  }
  temperature: {
    [key: string]: { name: string; conversion: (value: number) => number }
  }
}

const unitConversions: UnitConversions = {
  length: {
    mm: { name: 'ミリメートル (mm)', factor: 0.001 },
    cm: { name: 'センチメートル (cm)', factor: 0.01 },
    m: { name: 'メートル (m)', factor: 1 },
    km: { name: 'キロメートル (km)', factor: 1000 },
    inch: { name: 'インチ (in)', factor: 0.0254 },
    ft: { name: 'フィート (ft)', factor: 0.3048 },
    yard: { name: 'ヤード (yd)', factor: 0.9144 },
    mile: { name: 'マイル (mi)', factor: 1609.344 }
  },
  weight: {
    mg: { name: 'ミリグラム (mg)', factor: 0.000001 },
    g: { name: 'グラム (g)', factor: 0.001 },
    kg: { name: 'キログラム (kg)', factor: 1 },
    ton: { name: 'トン (t)', factor: 1000 },
    oz: { name: 'オンス (oz)', factor: 0.0283495 },
    lb: { name: 'ポンド (lb)', factor: 0.453592 },
    stone: { name: 'ストーン (st)', factor: 6.35029 }
  },
  temperature: {
    celsius: { 
      name: '摂氏 (°C)', 
      conversion: (value: number) => value 
    },
    fahrenheit: { 
      name: '華氏 (°F)', 
      conversion: (value: number) => (value * 9/5) + 32 
    },
    kelvin: { 
      name: 'ケルビン (K)', 
      conversion: (value: number) => value + 273.15 
    }
  }
}

export default function UnitConverterTool() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [fromUnit, setFromUnit] = useState<string>('m')
  const [toUnit, setToUnit] = useState<string>('ft')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')

  const convertUnit = (value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setOutputValue('')
      return
    }

    let result: number

    if (category === 'temperature') {
      // 温度変換（摂氏ベース）
      let celsiusValue: number
      
      // 入力値を摂氏に変換
      if (fromUnit === 'celsius') {
        celsiusValue = numValue
      } else if (fromUnit === 'fahrenheit') {
        celsiusValue = (numValue - 32) * 5/9
      } else if (fromUnit === 'kelvin') {
        celsiusValue = numValue - 273.15
      } else {
        celsiusValue = numValue
      }
      
      // 摂氏から目標単位に変換
      result = unitConversions.temperature[toUnit].conversion(celsiusValue)
    } else {
      // 長さ・重さ変換（基準単位ベース）
      const conversions = category === 'length' ? unitConversions.length : unitConversions.weight
      
      // 基準単位（メートル・キログラム）に変換
      const baseValue = numValue * conversions[fromUnit].factor
      // 基準単位から目標単位に変換
      result = baseValue / conversions[toUnit].factor
    }

    setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''))
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    convertUnit(value)
  }

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory)
    setInputValue('')
    setOutputValue('')
    
    // デフォルト単位設定
    if (newCategory === 'length') {
      setFromUnit('m')
      setToUnit('ft')
    } else if (newCategory === 'weight') {
      setFromUnit('kg')
      setToUnit('lb')
    } else if (newCategory === 'temperature') {
      setFromUnit('celsius')
      setToUnit('fahrenheit')
    }
  }

  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    if (outputValue) {
      setInputValue(outputValue)
      convertUnit(outputValue)
    }
  }

  const getCurrentUnits = () => {
    if (category === 'temperature') {
      return unitConversions.temperature
    }
    return category === 'length' ? unitConversions.length : unitConversions.weight
  }

  return (
    <ToolLayout
      title="単位変換ツール"
      description="長さ・重さ・温度の単位変換"
    >
      <div className="space-y-6">
        {/* カテゴリ選択 */}
        <Card>
          <CardHeader>
            <CardTitle>変換カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={category} onValueChange={(value: UnitCategory) => handleCategoryChange(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">📏 長さ</SelectItem>
                <SelectItem value="weight">⚖️ 重さ</SelectItem>
                <SelectItem value="temperature">🌡️ 温度</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 変換フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 入力 */}
          <Card>
            <CardHeader>
              <CardTitle>変換元</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getCurrentUnits()).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="数値を入力"
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
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(getCurrentUnits()).map(([key, unit]) => (
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

        {/* 変換例 */}
        <Card>
          <CardHeader>
            <CardTitle>よく使う変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📏 長さ</h4>
                <ul className="space-y-1">
                  <li>1m = 3.28ft</li>
                  <li>1inch = 2.54cm</li>
                  <li>1km = 0.621mile</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">⚖️ 重さ</h4>
                <ul className="space-y-1">
                  <li>1kg = 2.20lb</li>
                  <li>1oz = 28.35g</li>
                  <li>1ton = 1000kg</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🌡️ 温度</h4>
                <ul className="space-y-1">
                  <li>0°C = 32°F</li>
                  <li>100°C = 212°F</li>
                  <li>20°C = 68°F</li>
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
                  <li>長さ・重さ・温度の単位変換</li>
                  <li>リアルタイム変換</li>
                  <li>高精度計算（小数点第6位まで）</li>
                  <li>単位の入れ替え機能</li>
                  <li>変換結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>海外レシピの料理・お菓子作り</li>
                  <li>建築・設計図面の単位変換</li>
                  <li>貿易・輸出入での重量・寸法確認</li>
                  <li>学習・宿題での単位変換</li>
                  <li>旅行先での温度・距離確認</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}