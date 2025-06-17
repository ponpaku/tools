'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PressureUnit {
  name: string
  toPascal: number // 1単位をパスカルに変換する係数
}

const pressureUnits: Record<string, PressureUnit> = {
  Pa: { name: 'パスカル (Pa)', toPascal: 1 },
  kPa: { name: 'キロパスカル (kPa)', toPascal: 1000 },
  MPa: { name: 'メガパスカル (MPa)', toPascal: 1000000 },
  bar: { name: 'バール (bar)', toPascal: 100000 },
  mbar: { name: 'ミリバール (mbar)', toPascal: 100 },
  atm: { name: '標準大気圧 (atm)', toPascal: 101325 },
  psi: { name: '重量ポンド毎平方インチ (psi)', toPascal: 6894.76 },
  Torr: { name: 'トル (Torr)', toPascal: 133.322 },
  mmHg: { name: '水銀柱ミリメートル (mmHg)', toPascal: 133.322 },
  inHg: { name: '水銀柱インチ (inHg)', toPascal: 3386.39 },
  mmH2O: { name: '水柱ミリメートル (mmH2O)', toPascal: 9.80665 },
  cmH2O: { name: '水柱センチメートル (cmH2O)', toPascal: 98.0665 },
  inH2O: { name: '水柱インチ (inH2O)', toPascal: 249.089 }
}

export default function PressureConverterTool() {
  const [fromUnit, setFromUnit] = useState<string>('atm')
  const [toUnit, setToUnit] = useState<string>('Pa')
  const [inputValue, setInputValue] = useState<string>('')
  const [outputValue, setOutputValue] = useState<string>('')

  const convertPressure = useCallback((value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      setOutputValue('')
      return
    }

    // 入力値をパスカルに変換
    const pascalValue = numValue * pressureUnits[fromUnit].toPascal
    
    // パスカルから目標単位に変換
    const result = pascalValue / pressureUnits[toUnit].toPascal

    setOutputValue(result.toExponential(6).replace(/\.?0+e/, 'e').replace(/e\+?0+$/, ''))
  }, [fromUnit, toUnit])

  // 単位変更時に再計算
  useEffect(() => {
    if (inputValue) {
      convertPressure(inputValue)
    }
  }, [fromUnit, toUnit, inputValue, convertPressure])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    convertPressure(value)
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
      convertPressure(outputValue)
    }
  }

  return (
    <ToolLayout
      title="圧力変換ツール"
      description="atm・Pa・bar・psi・Torr等の圧力単位変換"
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
                  {Object.entries(pressureUnits).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="圧力値を入力"
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
                  {Object.entries(pressureUnits).map(([key, unit]) => (
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
                <h4 className="font-semibold mb-2">🌡️ 大気圧</h4>
                <ul className="space-y-1">
                  <li>1 atm = 101,325 Pa</li>
                  <li>1 atm = 1.01325 bar</li>
                  <li>1 atm = 14.696 psi</li>
                  <li>1 atm = 760 mmHg</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🔧 工業単位</h4>
                <ul className="space-y-1">
                  <li>1 bar = 100 kPa</li>
                  <li>1 psi = 6.895 kPa</li>
                  <li>1 MPa = 10 bar</li>
                  <li>1 kPa = 10 mbar</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🧪 実験単位</h4>
                <ul className="space-y-1">
                  <li>1 Torr = 1 mmHg</li>
                  <li>1 mmHg = 133.322 Pa</li>
                  <li>1 inHg = 25.4 mmHg</li>
                  <li>1 cmH2O = 98.1 Pa</li>
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
                  <li>13種類の圧力単位に対応</li>
                  <li>リアルタイム変換</li>
                  <li>科学記法での正確な表示</li>
                  <li>単位の入れ替え機能</li>
                  <li>変換結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">対応単位</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>SI単位：Pa、kPa、MPa</li>
                  <li>工業単位：bar、mbar、atm、psi</li>
                  <li>水銀柱：Torr、mmHg、inHg</li>
                  <li>水柱：mmH2O、cmH2O、inH2O</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>気象学・天気予報の気圧変換</li>
                  <li>工学・機械設計での圧力計算</li>
                  <li>化学実験・物理実験の単位変換</li>
                  <li>自動車・タイヤ圧力の単位変換</li>
                  <li>医療機器・血圧計の単位確認</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}