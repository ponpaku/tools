'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SpeedUnit {
  name: string
  toMeterPerSecond: number // 1単位をm/sに変換する係数
}

const speedUnits: Record<string, SpeedUnit> = {
  'ms': { name: 'メートル毎秒 (m/s)', toMeterPerSecond: 1 },
  'kmh': { name: 'キロメートル毎時 (km/h)', toMeterPerSecond: 1/3.6 },
  'mph': { name: 'マイル毎時 (mph)', toMeterPerSecond: 0.44704 },
  'ft_s': { name: 'フィート毎秒 (ft/s)', toMeterPerSecond: 0.3048 },
  'knot': { name: 'ノット (kn)', toMeterPerSecond: 0.514444 },
  'mach': { name: 'マッハ (Mach)', toMeterPerSecond: 343 }, // 海面上での音速
  'cm_s': { name: 'センチメートル毎秒 (cm/s)', toMeterPerSecond: 0.01 },
  'km_s': { name: 'キロメートル毎秒 (km/s)', toMeterPerSecond: 1000 },
  'in_s': { name: 'インチ毎秒 (in/s)', toMeterPerSecond: 0.0254 },
  'mm_s': { name: 'ミリメートル毎秒 (mm/s)', toMeterPerSecond: 0.001 },
  'ft_min': { name: 'フィート毎分 (ft/min)', toMeterPerSecond: 0.00508 },
  'm_min': { name: 'メートル毎分 (m/min)', toMeterPerSecond: 1/60 }
}

export default function SpeedConverterTool() {
  const [fromUnit, setFromUnit] = useState<string>('kmh')
  const [toUnit, setToUnit] = useState<string>('ms')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')

  const convertSpeed = useCallback((value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setOutputValue('')
      return
    }

    // 入力値をm/sに変換
    const meterPerSecondValue = numValue * speedUnits[fromUnit].toMeterPerSecond
    
    // m/sから目標単位に変換
    const result = meterPerSecondValue / speedUnits[toUnit].toMeterPerSecond

    setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''))
  }, [fromUnit, toUnit])

  // 単位変更時に再計算
  useEffect(() => {
    if (inputValue) {
      convertSpeed(inputValue)
    }
  }, [fromUnit, toUnit, inputValue, convertSpeed])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    convertSpeed(value)
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
      convertSpeed(outputValue)
    }
  }

  return (
    <ToolLayout
      title="速度変換ツール"
      description="km/h・m/s・mph・ノット等の速度単位変換"
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
                  {Object.entries(speedUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="速度値を入力"
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
                  {Object.entries(speedUnits).map(([key, unit]) => (
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
                <h4 className="font-semibold mb-2">🚗 日常速度</h4>
                <ul className="space-y-1">
                  <li>100 km/h = 27.8 m/s</li>
                  <li>60 km/h = 16.7 m/s</li>
                  <li>1 m/s = 3.6 km/h</li>
                  <li>50 mph = 80.5 km/h</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🛩️ 航空・海運</h4>
                <ul className="space-y-1">
                  <li>1 knot = 1.852 km/h</li>
                  <li>500 mph = 804.7 km/h</li>
                  <li>1 Mach = 1,235 km/h</li>
                  <li>100 knot = 185.2 km/h</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏃 スポーツ</h4>
                <ul className="space-y-1">
                  <li>10 m/s = 36 km/h</li>
                  <li>5 m/s = 18 km/h</li>
                  <li>15 mph = 24.1 km/h</li>
                  <li>20 ft/s = 21.8 km/h</li>
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
                  <li>12種類の速度単位に対応</li>
                  <li>リアルタイム変換</li>
                  <li>高精度計算（小数点第6位まで）</li>
                  <li>単位の入れ替え機能</li>
                  <li>変換結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">対応単位</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>基本単位：m/s、km/h、mph、ft/s</li>
                  <li>航空・海運：ノット、マッハ</li>
                  <li>細分単位：cm/s、mm/s、in/s</li>
                  <li>大単位：km/s、時間系：m/min、ft/min</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>自動車・交通での速度変換</li>
                  <li>航空・飛行機の速度計算</li>
                  <li>海運・船舶のノット変換</li>
                  <li>スポーツでの走行速度測定</li>
                  <li>物理学・工学での速度計算</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}