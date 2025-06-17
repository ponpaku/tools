'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function PercentageCalculatorTool() {
  // 基本的なパーセンテージ計算
  const [value1, setValue1] = useState<string>('')
  const [percentage1, setPercentage1] = useState<string>('')
  const [percentageResult, setPercentageResult] = useState<string>('')

  // 増減計算
  const [originalValue, setOriginalValue] = useState<string>('')
  const [newValue, setNewValue] = useState<string>('')
  const [changeRate, setChangeRate] = useState<string>('')
  const [changeAmount, setChangeAmount] = useState<string>('')

  // パーセンテージの増減
  const [baseValue, setBaseValue] = useState<string>('')
  const [percentageChange, setPercentageChange] = useState<string>('')
  const [increaseResult, setIncreaseResult] = useState<string>('')
  const [decreaseResult, setDecreaseResult] = useState<string>('')

  // 割合計算
  const [part, setPart] = useState<string>('')
  const [whole, setWhole] = useState<string>('')
  const [ratio, setRatio] = useState<string>('')

  // 基本的なパーセンテージ計算
  useEffect(() => {
    const val = parseFloat(value1)
    const pct = parseFloat(percentage1)
    if (!isNaN(val) && !isNaN(pct)) {
      const result = (val * pct) / 100
      setPercentageResult(result.toString())
    } else {
      setPercentageResult('')
    }
  }, [value1, percentage1])

  // 増減率計算
  useEffect(() => {
    const original = parseFloat(originalValue)
    const newVal = parseFloat(newValue)
    if (!isNaN(original) && !isNaN(newVal) && original !== 0) {
      const rate = ((newVal - original) / original) * 100
      const amount = newVal - original
      setChangeRate(rate.toFixed(2))
      setChangeAmount(amount.toString())
    } else {
      setChangeRate('')
      setChangeAmount('')
    }
  }, [originalValue, newValue])

  // パーセンテージの増減計算
  useEffect(() => {
    const base = parseFloat(baseValue)
    const pct = parseFloat(percentageChange)
    if (!isNaN(base) && !isNaN(pct)) {
      const increase = base * (1 + pct / 100)
      const decrease = base * (1 - pct / 100)
      setIncreaseResult(increase.toString())
      setDecreaseResult(decrease.toString())
    } else {
      setIncreaseResult('')
      setDecreaseResult('')
    }
  }, [baseValue, percentageChange])

  // 割合計算
  useEffect(() => {
    const partVal = parseFloat(part)
    const wholeVal = parseFloat(whole)
    if (!isNaN(partVal) && !isNaN(wholeVal) && wholeVal !== 0) {
      const ratioVal = (partVal / wholeVal) * 100
      setRatio(ratioVal.toFixed(2))
    } else {
      setRatio('')
    }
  }, [part, whole])

  const clearAll = () => {
    setValue1('')
    setPercentage1('')
    setPercentageResult('')
    setOriginalValue('')
    setNewValue('')
    setChangeRate('')
    setChangeAmount('')
    setBaseValue('')
    setPercentageChange('')
    setIncreaseResult('')
    setDecreaseResult('')
    setPart('')
    setWhole('')
    setRatio('')
  }

  return (
    <ToolLayout
      title="パーセンテージ計算機"
      description="百分率・増減率・割合計算"
    >
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本計算</TabsTrigger>
            <TabsTrigger value="change">増減率</TabsTrigger>
            <TabsTrigger value="increase">増減計算</TabsTrigger>
            <TabsTrigger value="ratio">割合</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* 基本的なパーセンテージ計算 */}
            <Card>
              <CardHeader>
                <CardTitle>Xの Y% はいくつ？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-sm font-medium">値 (X)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={value1}
                      onChange={(e) => setValue1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">パーセント (Y%)</label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={percentage1}
                      onChange={(e) => setPercentage1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">結果</label>
                    <div className="flex">
                      <div className="text-lg p-2 bg-green-50 rounded-lg font-mono flex-1">
                        {percentageResult || '－'}
                      </div>
                      {percentageResult && <CopyButton text={percentageResult} />}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  例：100の25% = 25
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="change" className="space-y-6">
            {/* 増減率計算 */}
            <Card>
              <CardHeader>
                <CardTitle>XからYへの変化率は？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-sm font-medium">元の値 (X)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">新しい値 (Y)</label>
                    <Input
                      type="number"
                      placeholder="120"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">変化率 (%)</label>
                    <div className="flex">
                      <div className="text-lg p-2 bg-blue-50 rounded-lg font-mono flex-1">
                        {changeRate ? `${changeRate}%` : '－'}
                      </div>
                      {changeRate && <CopyButton text={`${changeRate}%`} />}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">変化量</label>
                    <div className="flex">
                      <div className="text-lg p-2 bg-purple-50 rounded-lg font-mono flex-1">
                        {changeAmount || '－'}
                      </div>
                      {changeAmount && <CopyButton text={changeAmount} />}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  例：100から120への変化率 = +20% (変化量: +20)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="increase" className="space-y-6">
            {/* パーセンテージの増減 */}
            <Card>
              <CardHeader>
                <CardTitle>XをY%増加・減少させると？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium">基準値 (X)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">変化率 (Y%)</label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={percentageChange}
                      onChange={(e) => setPercentageChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">増加後の値 (+{percentageChange || 'Y'}%)</label>
                    <div className="flex">
                      <div className="text-lg p-3 bg-green-50 rounded-lg font-mono flex-1 text-center">
                        {increaseResult || '－'}
                      </div>
                      {increaseResult && <CopyButton text={increaseResult} />}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">減少後の値 (-{percentageChange || 'Y'}%)</label>
                    <div className="flex">
                      <div className="text-lg p-3 bg-red-50 rounded-lg font-mono flex-1 text-center">
                        {decreaseResult || '－'}
                      </div>
                      {decreaseResult && <CopyButton text={decreaseResult} />}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  例：100を20%増加 = 120、100を20%減少 = 80
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratio" className="space-y-6">
            {/* 割合計算 */}
            <Card>
              <CardHeader>
                <CardTitle>XはYの何%？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-sm font-medium">部分 (X)</label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={part}
                      onChange={(e) => setPart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">全体 (Y)</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={whole}
                      onChange={(e) => setWhole(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">割合 (%)</label>
                    <div className="flex">
                      <div className="text-lg p-2 bg-yellow-50 rounded-lg font-mono flex-1">
                        {ratio ? `${ratio}%` : '－'}
                      </div>
                      {ratio && <CopyButton text={`${ratio}%`} />}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  例：25は100の25%
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* クリアボタン */}
        <div className="flex justify-center">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            🗑️ すべてクリア
          </button>
        </div>

        {/* よく使う計算例 */}
        <Card>
          <CardHeader>
            <CardTitle>よく使う計算例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">💰 消費税・割引</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 1,000円の10% = 100円（消費税）</li>
                  <li>• 5,000円を20%割引 = 4,000円</li>
                  <li>• 元値3,000円が2,400円 = 20%割引</li>
                  <li>• 税込み1,100円の本体価格 = 1,000円</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📈 ビジネス・統計</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 売上100万→120万 = 20%増</li>
                  <li>• 合格者80人/受験者100人 = 80%</li>
                  <li>• 利益率：利益20万/売上100万 = 20%</li>
                  <li>• 成長率：前年比110% = 10%成長</li>
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
                  <li>4種類のパーセンテージ計算</li>
                  <li>リアルタイム計算</li>
                  <li>高精度計算（小数点第2位まで）</li>
                  <li>計算結果のコピー機能</li>
                  <li>わかりやすい計算例表示</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">計算タイプ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>基本計算：値の指定パーセントを計算</li>
                  <li>増減率：2つの値の変化率を計算</li>
                  <li>増減計算：パーセント増減後の値を計算</li>
                  <li>割合：部分が全体の何パーセントかを計算</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>消費税・割引・税込価格の計算</li>
                  <li>売上・利益率・成長率の分析</li>
                  <li>試験の得点率・合格率の計算</li>
                  <li>統計データの割合計算</li>
                  <li>投資・金融の利回り計算</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}