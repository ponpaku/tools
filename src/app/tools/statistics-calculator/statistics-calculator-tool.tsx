'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StatisticsResult {
  data: number[]
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  range: number
  min: number
  max: number
  variance: number
  standardDeviation: number
  standardError: number
  quartiles: {
    q1: number
    q3: number
    iqr: number
  }
}

export default function StatisticsCalculatorTool() {
  const [inputData, setInputData] = useState('10, 20, 30, 40, 50, 60, 70, 80, 90, 100')
  const [separator, setSeparator] = useState<'comma' | 'space' | 'newline'>('comma')

  const result = useMemo(() => {
    const separatorMap = {
      comma: /[,，]/,
      space: /\s+/,
      newline: /\n/
    }

    const data = inputData
      .split(separatorMap[separator])
      .map(str => parseFloat(str.trim()))
      .filter(num => !isNaN(num))

    if (data.length === 0) return null

    const sortedData = [...data].sort((a, b) => a - b)
    const count = data.length
    const sum = data.reduce((acc, val) => acc + val, 0)
    const mean = sum / count
    const min = sortedData[0]
    const max = sortedData[count - 1]
    const range = max - min

    // 中央値
    const median = count % 2 === 0
      ? (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2
      : sortedData[Math.floor(count / 2)]

    // 最頻値
    const frequency: { [key: number]: number } = {}
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1
    })
    const maxFreq = Math.max(...Object.values(frequency))
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number)

    // 分散と標準偏差
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
    const standardDeviation = Math.sqrt(variance)
    const standardError = standardDeviation / Math.sqrt(count)

    // 四分位数
    const q1Index = Math.floor(count * 0.25)
    const q3Index = Math.floor(count * 0.75)
    const q1 = count > 1 ? sortedData[q1Index] : sortedData[0]
    const q3 = count > 1 ? sortedData[q3Index] : sortedData[0]
    const iqr = q3 - q1

    return {
      data: sortedData,
      count,
      sum,
      mean,
      median,
      mode,
      range,
      min,
      max,
      variance,
      standardDeviation,
      standardError,
      quartiles: { q1, q3, iqr }
    }
  }, [inputData, separator])

  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals)
  }

  const generateSummaryText = () => {
    if (!result) return ''
    
    return `【統計計算結果】
データ数: ${result.count}
合計: ${formatNumber(result.sum)}
平均: ${formatNumber(result.mean)}
中央値: ${formatNumber(result.median)}
最頻値: ${result.mode.map(m => formatNumber(m)).join(', ')}
最小値: ${formatNumber(result.min)}
最大値: ${formatNumber(result.max)}
範囲: ${formatNumber(result.range)}
分散: ${formatNumber(result.variance)}
標準偏差: ${formatNumber(result.standardDeviation)}
標準誤差: ${formatNumber(result.standardError)}
第1四分位数: ${formatNumber(result.quartiles.q1)}
第3四分位数: ${formatNumber(result.quartiles.q3)}
四分位範囲: ${formatNumber(result.quartiles.iqr)}
`
  }

  return (
    <ToolLayout
      title="統計計算機"
      description="数値データの基本統計量（平均・分散・標準偏差など）を計算します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>データ入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="separator">区切り文字</label>
              <Select value={separator} onValueChange={(value: 'comma' | 'space' | 'newline') => setSeparator(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comma">カンマ（,）</SelectItem>
                  <SelectItem value="space">スペース</SelectItem>
                  <SelectItem value="newline">改行</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="inputData">数値データ</label>
              <Textarea
                id="inputData"
                placeholder="数値を入力してください（例: 10, 20, 30, 40, 50）"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="min-h-[120px] font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                {separator === 'comma' && 'カンマ（,）で区切って入力'}
                {separator === 'space' && 'スペースで区切って入力'}
                {separator === 'newline' && '改行で区切って入力'}
              </p>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>基本統計量</CardTitle>
                  <CopyButton text={generateSummaryText()} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">データ数:</span>
                      <span className="font-semibold">{result.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">合計:</span>
                      <span className="font-semibold">{formatNumber(result.sum)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">平均:</span>
                      <span className="font-semibold text-blue-600">{formatNumber(result.mean)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">中央値:</span>
                      <span className="font-semibold">{formatNumber(result.median)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最頻値:</span>
                      <span className="font-semibold">{result.mode.map(m => formatNumber(m)).join(', ')}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最小値:</span>
                      <span className="font-semibold">{formatNumber(result.min)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">最大値:</span>
                      <span className="font-semibold">{formatNumber(result.max)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">範囲:</span>
                      <span className="font-semibold">{formatNumber(result.range)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">分散:</span>
                      <span className="font-semibold">{formatNumber(result.variance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">標準偏差:</span>
                      <span className="font-semibold text-green-600">{formatNumber(result.standardDeviation)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>詳細統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">標準誤差:</span>
                    <span className="font-semibold">{formatNumber(result.standardError)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">第1四分位数 (Q1):</span>
                    <span className="font-semibold">{formatNumber(result.quartiles.q1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">第3四分位数 (Q3):</span>
                    <span className="font-semibold">{formatNumber(result.quartiles.q3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">四分位範囲 (IQR):</span>
                    <span className="font-semibold">{formatNumber(result.quartiles.iqr)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">変動係数</h4>
                  <p className="text-sm">
                    {formatNumber((result.standardDeviation / result.mean) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    データのばらつきを相対的に評価
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>データ分布情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">ソート済みデータ（最初の20件）</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono">
                      {result.data.slice(0, 20).map(val => formatNumber(val)).join(', ')}
                      {result.data.length > 20 && ` ... (全${result.data.length}件)`}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">分布の特徴</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>平均と中央値の差:</span>
                      <span className="font-mono">{formatNumber(result.mean - result.median)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>歪度の目安:</span>
                      <span>
                        {Math.abs(result.mean - result.median) < result.standardDeviation * 0.1 
                          ? '対称的' 
                          : result.mean > result.median 
                            ? '右に歪み' 
                            : '左に歪み'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>外れ値の境界:</span>
                      <span className="text-xs">
                        下限: {formatNumber(result.quartiles.q1 - 1.5 * result.quartiles.iqr)}<br/>
                        上限: {formatNumber(result.quartiles.q3 + 1.5 * result.quartiles.iqr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>統計量の説明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">代表値</h4>
                  <ul className="space-y-1">
                    <li><span className="font-medium">平均:</span> 全データの合計を個数で割った値</li>
                    <li><span className="font-medium">中央値:</span> データを並べた時の真ん中の値</li>
                    <li><span className="font-medium">最頻値:</span> 最も頻繁に現れる値</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">散布度</h4>
                  <ul className="space-y-1">
                    <li><span className="font-medium">範囲:</span> 最大値と最小値の差</li>
                    <li><span className="font-medium">分散:</span> 平均からの偏差の平方の平均</li>
                    <li><span className="font-medium">標準偏差:</span> 分散の平方根、データの散らばり</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">四分位数</h4>
                <ul className="space-y-1">
                  <li><span className="font-medium">Q1:</span> データの下位25%の境界値</li>
                  <li><span className="font-medium">Q3:</span> データの上位25%の境界値</li>
                  <li><span className="font-medium">IQR:</span> Q3 - Q1、中央50%のデータの範囲</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">活用シーン</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>アンケート結果の分析</li>
                  <li>成績や評価データの統計処理</li>
                  <li>実験データの基本統計量計算</li>
                  <li>売上データの傾向分析</li>
                  <li>品質管理データの分析</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}