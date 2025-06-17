'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, HardDrive, Info, ToggleLeft, ToggleRight } from 'lucide-react'
import { ToolLayout } from '@/components/layout/tool-layout'

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'
type ConversionMode = 'binary' | 'decimal'

interface ConversionResult {
  unit: Unit
  value: number
  displayValue: string
  fullName: string
}

export default function MemorySizeConverterPage() {
  const [inputValue, setInputValue] = useState<string>('1')
  const [inputUnit, setInputUnit] = useState<Unit>('MB')
  const [mode, setMode] = useState<ConversionMode>('binary')

  const units = useMemo(() => [
    { value: 'B' as Unit, label: 'Byte', fullName: 'バイト' },
    { value: 'KB' as Unit, label: 'KB', fullName: 'キロバイト' },
    { value: 'MB' as Unit, label: 'MB', fullName: 'メガバイト' },
    { value: 'GB' as Unit, label: 'GB', fullName: 'ギガバイト' },
    { value: 'TB' as Unit, label: 'TB', fullName: 'テラバイト' },
    { value: 'PB' as Unit, label: 'PB', fullName: 'ペタバイト' }
  ], [])

  const conversionFactors = useMemo(() => {
    const base = mode === 'binary' ? 1024 : 1000
    return {
      B: 1,
      KB: base,
      MB: Math.pow(base, 2),
      GB: Math.pow(base, 3),
      TB: Math.pow(base, 4),
      PB: Math.pow(base, 5)
    }
  }, [mode])

  const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    if (num < 0.001) return num.toExponential(3)
    if (num >= 1e15) return num.toExponential(3)
    if (num >= 1e12) return (num / 1e12).toFixed(3) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(3) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(3) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(3) + 'K'
    if (num >= 100) return num.toFixed(0)
    if (num >= 10) return num.toFixed(1)
    if (num >= 1) return num.toFixed(2)
    if (num >= 0.01) return num.toFixed(4)
    return num.toFixed(6)
  }

  const conversions = useMemo(() => {
    const numValue = parseFloat(inputValue) || 0
    if (numValue === 0) {
      return units.map(unit => ({
        unit: unit.value,
        value: 0,
        displayValue: '0',
        fullName: unit.fullName
      }))
    }

    // 入力値をByteに変換
    const inputInBytes = numValue * conversionFactors[inputUnit]

    return units.map(unit => {
      const convertedValue = inputInBytes / conversionFactors[unit.value]
      return {
        unit: unit.value,
        value: convertedValue,
        displayValue: formatNumber(convertedValue),
        fullName: unit.fullName
      }
    })
  }, [inputValue, inputUnit, conversionFactors, units])

  const handleCopyValue = (value: string, unit: string) => {
    navigator.clipboard.writeText(`${value} ${unit}`)
  }

  const toggleMode = () => {
    setMode(prev => prev === 'binary' ? 'decimal' : 'binary')
  }

  const examples = useMemo(() => [
    { value: '1', unit: 'GB' as Unit, description: '一般的な画像ファイルサイズ' },
    { value: '8', unit: 'GB' as Unit, description: '標準的なRAMサイズ' },
    { value: '1', unit: 'TB' as Unit, description: 'ハードドライブサイズ' },
    { value: '100', unit: 'MB' as Unit, description: '動画ファイルサイズ' }
  ], [])

  return (
    <ToolLayout
      title="メモリサイズ変換"
      description="Byte・KB・MB・GB・TB・PBの相互変換を行う無料ツール。Binary（1024進法）とDecimal（1000進法）両対応。"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>メモリサイズ変換ツール</span>
            </CardTitle>
            <CardDescription>
              データサイズの単位を相互変換します。バイナリ（1024進法）とデシマル（1000進法）の両方に対応。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 入力エリア */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">数値</label>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="変換する数値を入力"
                  min="0"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">単位</label>
                <Select value={inputUnit} onValueChange={(value) => setInputUnit(value as Unit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label} ({unit.fullName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">変換方式</label>
                <Button
                  onClick={toggleMode}
                  variant="outline"
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    {mode === 'binary' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    <span>{mode === 'binary' ? 'Binary (1024)' : 'Decimal (1000)'}</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* モード説明 */}
            <div className="flex items-center space-x-4">
              <Badge variant={mode === 'binary' ? 'default' : 'secondary'}>
                Binary: 1 KB = 1,024 Bytes
              </Badge>
              <Badge variant={mode === 'decimal' ? 'default' : 'secondary'}>
                Decimal: 1 KB = 1,000 Bytes
              </Badge>
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* 変換結果 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">変換結果</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {conversions.map((result) => (
                  <Card key={result.unit} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">{result.fullName}</div>
                        <div className="font-mono text-lg">
                          {result.displayValue} <span className="text-sm">{result.unit}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCopyValue(result.displayValue, result.unit)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* クイック例 */}
            <div className="space-y-3">
              <h4 className="font-semibold">クイック例</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setInputValue(example.value)
                      setInputUnit(example.unit)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-2 px-3 flex flex-col"
                  >
                    <span className="font-mono">{example.value} {example.unit}</span>
                    <span className="text-gray-500 text-xs">{example.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用方法と説明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>単位の説明と使い分け</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Binary（1024進法）</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• コンピューターのメモリサイズ</li>
                  <li>• ストレージの実際の容量</li>
                  <li>• プログラムのメモリ使用量</li>
                  <li>• システム情報の表示</li>
                  <li>• 1 KB = 1,024 Bytes</li>
                  <li>• KiB, MiB, GiB表記も使用</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Decimal（1000進法）</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• ストレージメーカーの表記</li>
                  <li>• ネットワーク転送速度</li>
                  <li>• マーケティング表記</li>
                  <li>• SI単位系に準拠</li>
                  <li>• 1 KB = 1,000 Bytes</li>
                  <li>• 国際標準の計算方式</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-3">
              <h4 className="font-semibold">各単位の説明</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Byte (B):</span> 1文字分のデータサイズ
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Kilobyte (KB):</span> 小さなテキストファイル
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Megabyte (MB):</span> 写真、音楽ファイル
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Gigabyte (GB):</span> 動画、ゲーム、アプリ
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Terabyte (TB):</span> 大容量ストレージ
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Petabyte (PB):</span> 企業・データセンター
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}