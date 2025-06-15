'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calculator, Percent, DollarSign, JapaneseYenIcon, Gift, ShoppingCart } from 'lucide-react'

interface CalculationResult {
  originalPrice: number
  discountAmount: number
  discountedPrice: number
  discountRate: number
  taxIncludedPrice: number
  taxExcludedPrice: number
  pointsEarned: number
  finalPrice: number
  totalSavings: number
}

// 税率（日本の消費税）
const TAX_RATE = 0.1

// 計算関数
function calculateDiscount(
  originalPrice: number,
  discountRate: number,
  additionalDiscount: number = 0,
  pointRate: number = 0,
  taxIncluded: boolean = true
): CalculationResult {
  // 基本割引計算
  const baseDiscountAmount = originalPrice * (discountRate / 100)
  const priceAfterDiscount = originalPrice - baseDiscountAmount
  
  // 追加割引
  const additionalDiscountAmount = priceAfterDiscount * (additionalDiscount / 100)
  const discountedPrice = priceAfterDiscount - additionalDiscountAmount
  
  // 税込み・税抜き計算
  let taxIncludedPrice: number
  let taxExcludedPrice: number
  
  if (taxIncluded) {
    // 入力価格が税込みの場合
    taxIncludedPrice = discountedPrice
    taxExcludedPrice = discountedPrice / (1 + TAX_RATE)
  } else {
    // 入力価格が税抜きの場合
    taxExcludedPrice = discountedPrice
    taxIncludedPrice = discountedPrice * (1 + TAX_RATE)
  }
  
  // ポイント計算（税抜き価格ベース）
  const pointsEarned = taxExcludedPrice * (pointRate / 100)
  
  // 最終価格（税込み価格からポイント分を引く）
  const finalPrice = taxIncludedPrice - pointsEarned
  
  // 総割引額
  const totalDiscountAmount = baseDiscountAmount + additionalDiscountAmount
  const totalSavings = originalPrice - finalPrice + pointsEarned
  
  return {
    originalPrice,
    discountAmount: totalDiscountAmount,
    discountedPrice,
    discountRate: discountRate + additionalDiscount,
    taxIncludedPrice,
    taxExcludedPrice,
    pointsEarned,
    finalPrice,
    totalSavings
  }
}

export default function DiscountCalculatorTool() {
  // 入力値
  const [originalPrice, setOriginalPrice] = useState<string>('')
  const [discountRate, setDiscountRate] = useState<string>('')
  const [additionalDiscount, setAdditionalDiscount] = useState<string>('')
  const [pointRate, setPointRate] = useState<string>('')
  const [taxIncluded, setTaxIncluded] = useState(true)
  
  // 計算結果
  const result = useMemo((): CalculationResult | null => {
    const price = parseFloat(originalPrice)
    const discount = parseFloat(discountRate) || 0
    const additional = parseFloat(additionalDiscount) || 0
    const points = parseFloat(pointRate) || 0
    
    if (isNaN(price) || price <= 0) return null
    
    return calculateDiscount(price, discount, additional, points, taxIncluded)
  }, [originalPrice, discountRate, additionalDiscount, pointRate, taxIncluded])

  // プリセット例
  const presets = [
    { name: '20%OFF', price: '10000', discount: '20', additional: '0', points: '1' },
    { name: '30%OFF + 5%クーポン', price: '5000', discount: '30', additional: '5', points: '2' },
    { name: '半額セール', price: '8000', discount: '50', additional: '0', points: '1' },
    { name: '70%OFF + 10%ポイント', price: '15000', discount: '70', additional: '0', points: '10' }
  ]

  const loadPreset = (preset: typeof presets[0]) => {
    setOriginalPrice(preset.price)
    setDiscountRate(preset.discount)
    setAdditionalDiscount(preset.additional)
    setPointRate(preset.points)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <ToolLayout
      title="商品値引き計算機"
      description="割引率・税込価格・ポイント還元を含む商品価格計算ツール"
    >
      <div className="space-y-6">
        {/* 入力エリア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              価格情報入力
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 元価格 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  元価格 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="10000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="pr-8"
                  />
                  <JapaneseYenIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* 割引率 */}
              <div>
                <label className="block text-sm font-medium mb-2">基本割引率</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="20"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(e.target.value)}
                    className="pr-8"
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* 追加割引率 */}
              <div>
                <label className="block text-sm font-medium mb-2">追加割引率（クーポン等）</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="5"
                    value={additionalDiscount}
                    onChange={(e) => setAdditionalDiscount(e.target.value)}
                    className="pr-8"
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* ポイント還元率 */}
              <div>
                <label className="block text-sm font-medium mb-2">ポイント還元率</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="1"
                    value={pointRate}
                    onChange={(e) => setPointRate(e.target.value)}
                    className="pr-8"
                  />
                  <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* 税込み・税抜き切り替え */}
            <div>
              <label className="block text-sm font-medium mb-2">価格設定</label>
              <div className="flex gap-2">
                <Button
                  variant={taxIncluded ? "default" : "outline"}
                  onClick={() => setTaxIncluded(true)}
                  size="sm"
                >
                  税込み価格
                </Button>
                <Button
                  variant={!taxIncluded ? "default" : "outline"}
                  onClick={() => setTaxIncluded(false)}
                  size="sm"
                >
                  税抜き価格
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* プリセット */}
        <Card>
          <CardHeader>
            <CardTitle>よく使う設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => loadPreset(preset)}
                  className="text-sm h-auto py-3 px-2"
                >
                  <div className="text-center">
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatPrice(parseFloat(preset.price))}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 計算結果 */}
        {result && (
          <div className="space-y-6">
            {/* 価格概要 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  価格概要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">元価格</div>
                    <div className="text-xl font-bold text-gray-800">
                      {formatPrice(result.originalPrice)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">割引額</div>
                    <div className="text-xl font-bold text-red-600">
                      -{formatPrice(result.discountAmount)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">ポイント</div>
                    <div className="text-xl font-bold text-green-600">
                      {Math.round(result.pointsEarned)}pt
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">実質支払額</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(result.finalPrice)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 詳細計算結果 */}
            <Card>
              <CardHeader>
                <CardTitle>詳細計算結果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 割引計算 */}
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-red-800">割引計算</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">元価格</div>
                        <div className="font-medium">{formatPrice(result.originalPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">総割引率</div>
                        <div className="font-medium">{result.discountRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">割引後価格</div>
                        <div className="font-medium">{formatPrice(result.discountedPrice)}</div>
                      </div>
                    </div>
                  </div>

                  {/* 税計算 */}
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-yellow-800">税計算</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">税抜き価格</div>
                        <div className="font-medium">{formatPrice(result.taxExcludedPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">税込み価格</div>
                        <div className="font-medium">{formatPrice(result.taxIncludedPrice)}</div>
                      </div>
                    </div>
                  </div>

                  {/* ポイント・最終計算 */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-green-800">ポイント・最終計算</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">獲得ポイント</div>
                        <div className="font-medium">{Math.round(result.pointsEarned)}pt</div>
                      </div>
                      <div>
                        <div className="text-gray-600">実質支払額</div>
                        <div className="font-medium">{formatPrice(result.finalPrice)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">総節約額</div>
                        <div className="font-medium text-green-600">{formatPrice(result.totalSavings)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 節約効果 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  節約効果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-green-600">
                    {((result.totalSavings / result.originalPrice) * 100).toFixed(1)}% OFF
                  </div>
                  <div className="text-lg">
                    <span className="text-gray-600">元価格より</span>
                    <span className="font-bold text-green-600 mx-2">
                      {formatPrice(result.totalSavings)}
                    </span>
                    <span className="text-gray-600">お得です！</span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>お得度ランク:</strong>
                      {(() => {
                        const savingsRate = (result.totalSavings / result.originalPrice) * 100
                        if (savingsRate >= 50) return ' 🌟🌟🌟 超お得！'
                        if (savingsRate >= 30) return ' 🌟🌟 とてもお得！'
                        if (savingsRate >= 15) return ' 🌟 お得！'
                        return ' 普通'
                      })()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                  <li>基本割引率 + 追加割引（クーポン等）の計算</li>
                  <li>税込み・税抜き価格の自動計算</li>
                  <li>ポイント還元を考慮した実質支払額計算</li>
                  <li>総節約額・節約率の表示</li>
                  <li>よく使う設定のプリセット機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>オンラインショッピングでの価格比較</li>
                  <li>セール・バーゲンでのお得度確認</li>
                  <li>複数クーポン併用時の最終価格計算</li>
                  <li>ポイント還元を含めた実質価格比較</li>
                  <li>店舗運営での価格設定・プロモーション計算</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">計算方式</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>基本割引 → 追加割引の順で適用</li>
                  <li>税率は日本の消費税10%で計算</li>
                  <li>ポイントは税抜き価格ベースで計算</li>
                  <li>実質支払額 = 税込み価格 - ポイント相当額</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}