'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ConversionResult {
  decimal: string
  percentage: string
  fraction: { numerator: number; denominator: number; simplified?: string }
}

// 最大公約数を求める関数
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

// 分数を約分する関数
function simplifyFraction(numerator: number, denominator: number): { numerator: number; denominator: number } {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator))
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  }
}

// 小数を分数に変換する関数
function decimalToFraction(decimal: number): { numerator: number; denominator: number } {
  const tolerance = 1.0E-6
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1
  let b = decimal
  
  do {
    const a = Math.floor(b)
    let aux = h1
    h1 = a * h1 + h2
    h2 = aux
    aux = k1
    k1 = a * k1 + k2
    k2 = aux
    b = 1 / (b - a)
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance)
  
  return { numerator: h1, denominator: k1 }
}

export default function FractionPercentageConverterTool() {
  const [activeTab, setActiveTab] = useState('decimal')
  
  // 小数入力
  const [decimalInput, setDecimalInput] = useState('')
  
  // パーセント入力
  const [percentageInput, setPercentageInput] = useState('')
  
  // 分数入力
  const [numeratorInput, setNumeratorInput] = useState('')
  const [denominatorInput, setDenominatorInput] = useState('')

  // 小数からの変換結果
  const decimalResult = useMemo((): ConversionResult | null => {
    const value = parseFloat(decimalInput)
    if (isNaN(value)) return null
    
    const percentage = (value * 100).toString()
    const fractionResult = decimalToFraction(value)
    const simplified = simplifyFraction(fractionResult.numerator, fractionResult.denominator)
    
    return {
      decimal: value.toString(),
      percentage: percentage,
      fraction: {
        ...fractionResult,
        simplified: `${simplified.numerator}/${simplified.denominator}`
      }
    }
  }, [decimalInput])

  // パーセントからの変換結果
  const percentageResult = useMemo((): ConversionResult | null => {
    const value = parseFloat(percentageInput)
    if (isNaN(value)) return null
    
    const decimal = (value / 100)
    const fractionResult = decimalToFraction(decimal)
    const simplified = simplifyFraction(fractionResult.numerator, fractionResult.denominator)
    
    return {
      decimal: decimal.toString(),
      percentage: value.toString(),
      fraction: {
        ...fractionResult,
        simplified: `${simplified.numerator}/${simplified.denominator}`
      }
    }
  }, [percentageInput])

  // 分数からの変換結果
  const fractionResult = useMemo((): ConversionResult | null => {
    const numerator = parseFloat(numeratorInput)
    const denominator = parseFloat(denominatorInput)
    
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return null
    
    const decimal = numerator / denominator
    const percentage = (decimal * 100)
    const simplified = simplifyFraction(numerator, denominator)
    
    return {
      decimal: decimal.toString(),
      percentage: percentage.toString(),
      fraction: {
        numerator,
        denominator,
        simplified: `${simplified.numerator}/${simplified.denominator}`
      }
    }
  }, [numeratorInput, denominatorInput])

  const commonFractions = [
    { fraction: '1/2', decimal: 0.5, percentage: 50 },
    { fraction: '1/3', decimal: 0.3333, percentage: 33.33 },
    { fraction: '2/3', decimal: 0.6667, percentage: 66.67 },
    { fraction: '1/4', decimal: 0.25, percentage: 25 },
    { fraction: '3/4', decimal: 0.75, percentage: 75 },
    { fraction: '1/5', decimal: 0.2, percentage: 20 },
    { fraction: '2/5', decimal: 0.4, percentage: 40 },
    { fraction: '3/5', decimal: 0.6, percentage: 60 },
    { fraction: '4/5', decimal: 0.8, percentage: 80 },
    { fraction: '1/8', decimal: 0.125, percentage: 12.5 },
    { fraction: '3/8', decimal: 0.375, percentage: 37.5 },
    { fraction: '5/8', decimal: 0.625, percentage: 62.5 },
    { fraction: '7/8', decimal: 0.875, percentage: 87.5 }
  ]

  return (
    <ToolLayout
      title="分数・小数・パーセント変換"
      description="分数・小数・パーセントの相互変換ツール"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="decimal">小数 → 変換</TabsTrigger>
            <TabsTrigger value="percentage">パーセント → 変換</TabsTrigger>
            <TabsTrigger value="fraction">分数 → 変換</TabsTrigger>
          </TabsList>

          {/* 小数入力タブ */}
          <TabsContent value="decimal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>小数を入力</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  step="any"
                  placeholder="例: 0.75"
                  value={decimalInput}
                  onChange={(e) => setDecimalInput(e.target.value)}
                  className="text-lg"
                />
              </CardContent>
            </Card>

            {decimalResult && (
              <Card>
                <CardHeader>
                  <CardTitle>変換結果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">小数</div>
                      <div className="text-xl font-bold text-blue-600">
                        {parseFloat(decimalResult.decimal).toFixed(6).replace(/\.?0+$/, '')}
                        <CopyButton text={decimalResult.decimal} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">パーセント</div>
                      <div className="text-xl font-bold text-green-600">
                        {parseFloat(decimalResult.percentage).toFixed(4).replace(/\.?0+$/, '')}%
                        <CopyButton text={`${decimalResult.percentage}%`} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">分数（約分）</div>
                      <div className="text-xl font-bold text-purple-600">
                        {decimalResult.fraction.simplified}
                        <CopyButton text={decimalResult.fraction.simplified || ''} className="ml-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* パーセント入力タブ */}
          <TabsContent value="percentage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>パーセントを入力</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="any"
                    placeholder="例: 75"
                    value={percentageInput}
                    onChange={(e) => setPercentageInput(e.target.value)}
                    className="text-lg"
                  />
                  <span className="text-lg font-medium">%</span>
                </div>
              </CardContent>
            </Card>

            {percentageResult && (
              <Card>
                <CardHeader>
                  <CardTitle>変換結果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">小数</div>
                      <div className="text-xl font-bold text-blue-600">
                        {parseFloat(percentageResult.decimal).toFixed(6).replace(/\.?0+$/, '')}
                        <CopyButton text={percentageResult.decimal} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">パーセント</div>
                      <div className="text-xl font-bold text-green-600">
                        {parseFloat(percentageResult.percentage).toFixed(4).replace(/\.?0+$/, '')}%
                        <CopyButton text={`${percentageResult.percentage}%`} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">分数（約分）</div>
                      <div className="text-xl font-bold text-purple-600">
                        {percentageResult.fraction.simplified}
                        <CopyButton text={percentageResult.fraction.simplified || ''} className="ml-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 分数入力タブ */}
          <TabsContent value="fraction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>分数を入力</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="分子"
                    value={numeratorInput}
                    onChange={(e) => setNumeratorInput(e.target.value)}
                    className="text-lg"
                  />
                  <span className="text-2xl font-bold">/</span>
                  <Input
                    type="number"
                    placeholder="分母"
                    value={denominatorInput}
                    onChange={(e) => setDenominatorInput(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {fractionResult && (
              <Card>
                <CardHeader>
                  <CardTitle>変換結果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">小数</div>
                      <div className="text-xl font-bold text-blue-600">
                        {parseFloat(fractionResult.decimal).toFixed(6).replace(/\.?0+$/, '')}
                        <CopyButton text={fractionResult.decimal} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">パーセント</div>
                      <div className="text-xl font-bold text-green-600">
                        {parseFloat(fractionResult.percentage).toFixed(4).replace(/\.?0+$/, '')}%
                        <CopyButton text={`${fractionResult.percentage}%`} className="ml-2" />
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">分数（約分）</div>
                      <div className="text-xl font-bold text-purple-600">
                        {fractionResult.fraction.simplified}
                        <CopyButton text={fractionResult.fraction.simplified || ''} className="ml-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* よく使う分数一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>よく使う分数一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {commonFractions.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    const [num, den] = item.fraction.split('/')
                    setNumeratorInput(num)
                    setDenominatorInput(den)
                    setActiveTab('fraction')
                  }}
                >
                  <div className="font-bold text-lg mb-1">{item.fraction}</div>
                  <div className="text-sm text-gray-600">{item.decimal.toFixed(4).replace(/\.?0+$/, '')}</div>
                  <div className="text-sm text-gray-600">{item.percentage}%</div>
                </div>
              ))}
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
                  <li>小数・パーセント・分数の相互変換</li>
                  <li>分数の自動約分機能</li>
                  <li>よく使う分数の一覧表示</li>
                  <li>高精度計算（小数点第6位まで）</li>
                  <li>変換結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>数学・算数の学習・宿題</li>
                  <li>料理レシピの分量計算</li>
                  <li>統計・アンケート結果の表現</li>
                  <li>割引率・利率の計算</li>
                  <li>グラフ・図表作成時のデータ変換</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">変換例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>0.75 = 75% = 3/4</li>
                  <li>0.333... = 33.33% = 1/3</li>
                  <li>1.25 = 125% = 5/4</li>
                  <li>0.125 = 12.5% = 1/8</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}