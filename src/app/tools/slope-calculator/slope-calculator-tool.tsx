'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type CalculationMode = 'coordinates' | 'rise-run' | 'angle'

interface SlopeResult {
  percentage: number
  degrees: number
  radians: number
  ratio: string
  tanValue: number
  rise: number
  run: number
}

export default function SlopeCalculatorTool() {
  const [mode, setMode] = useState<CalculationMode>('rise-run')
  
  // 座標入力
  const [x1, setX1] = useState('')
  const [y1, setY1] = useState('')
  const [x2, setX2] = useState('')
  const [y2, setY2] = useState('')
  
  // 勾配・距離入力
  const [rise, setRise] = useState('')
  const [run, setRun] = useState('')
  
  // 角度入力
  const [angleInput, setAngleInput] = useState('')
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees')

  const result = useMemo((): SlopeResult | null => {
    let tanValue: number
    let actualRise: number
    let actualRun: number

    if (mode === 'coordinates') {
      const x1Val = parseFloat(x1)
      const y1Val = parseFloat(y1)
      const x2Val = parseFloat(x2)
      const y2Val = parseFloat(y2)
      
      if (isNaN(x1Val) || isNaN(y1Val) || isNaN(x2Val) || isNaN(y2Val)) {
        return null
      }
      
      actualRun = x2Val - x1Val
      actualRise = y2Val - y1Val
      
      if (actualRun === 0) {
        return null // 垂直線は計算不可
      }
      
      tanValue = actualRise / actualRun
    } else if (mode === 'rise-run') {
      const riseVal = parseFloat(rise)
      const runVal = parseFloat(run)
      
      if (isNaN(riseVal) || isNaN(runVal) || runVal === 0) {
        return null
      }
      
      actualRise = riseVal
      actualRun = runVal
      tanValue = actualRise / actualRun
    } else { // angle mode
      const angleVal = parseFloat(angleInput)
      
      if (isNaN(angleVal)) {
        return null
      }
      
      let angleInRadians: number
      if (angleUnit === 'degrees') {
        angleInRadians = (angleVal * Math.PI) / 180
      } else {
        angleInRadians = angleVal
      }
      
      tanValue = Math.tan(angleInRadians)
      
      // 標準的な run = 1 として rise を計算
      actualRun = 1
      actualRise = tanValue
    }

    // 計算結果
    const percentage = tanValue * 100
    const degrees = (Math.atan(tanValue) * 180) / Math.PI
    const radians = Math.atan(tanValue)
    
    // 比率計算 (1:n または n:1)
    let ratio: string
    if (Math.abs(tanValue) >= 1) {
      // 急勾配の場合は n:1 形式
      ratio = `${(Math.abs(tanValue)).toFixed(3)}:1`
    } else {
      // 緩勾配の場合は 1:n 形式
      ratio = `1:${(1 / Math.abs(tanValue)).toFixed(3)}`
    }
    
    return {
      percentage: parseFloat(percentage.toFixed(4)),
      degrees: parseFloat(degrees.toFixed(6)),
      radians: parseFloat(radians.toFixed(8)),
      ratio,
      tanValue: parseFloat(tanValue.toFixed(8)),
      rise: actualRise,
      run: actualRun
    }
  }, [mode, x1, y1, x2, y2, rise, run, angleInput, angleUnit])

  const getResultDisplay = () => {
    if (!result) return null

    const copyText = `勾配: ${result.percentage}% (${result.degrees}° / ${result.ratio})`

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>計算結果</CardTitle>
            <CopyButton text={copyText} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* メイン結果 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">パーセント</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.percentage}%
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">角度（度）</div>
              <div className="text-2xl font-bold text-green-600">
                {result.degrees}°
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">比率</div>
              <div className="text-2xl font-bold text-orange-600">
                {result.ratio}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">ラジアン</div>
              <div className="text-2xl font-bold text-purple-600">
                {result.radians}
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">勾配の詳細</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>高さ (rise):</span>
                  <span className="font-mono">{result.rise.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>水平距離 (run):</span>
                  <span className="font-mono">{result.run.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>tan値:</span>
                  <span className="font-mono">{result.tanValue}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">換算値</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>1m上昇に必要な水平距離:</span>
                  <span className="font-mono">{(1 / Math.abs(result.tanValue)).toFixed(2)}m</span>
                </div>
                <div className="flex justify-between">
                  <span>100m進行時の高低差:</span>
                  <span className="font-mono">{(Math.abs(result.tanValue) * 100).toFixed(2)}m</span>
                </div>
                <div className="flex justify-between">
                  <span>勾配の向き:</span>
                  <span>{result.tanValue >= 0 ? '上り勾配' : '下り勾配'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ToolLayout
      title="勾配計算機"
      description="角度・傾斜・勾配をパーセント・度数・比率で相互変換"
    >
      <div className="space-y-6">
        {/* 計算モード選択 */}
        <Card>
          <CardHeader>
            <CardTitle>計算方法を選択</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(value) => setMode(value as CalculationMode)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rise-run">📏 高さ・距離</TabsTrigger>
                <TabsTrigger value="coordinates">📍 座標</TabsTrigger>
                <TabsTrigger value="angle">📐 角度</TabsTrigger>
              </TabsList>

              <TabsContent value="rise-run" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">高さ (rise)</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="例: 2.5"
                      value={rise}
                      onChange={(e) => setRise(e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">垂直方向の変化量</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">水平距離 (run)</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="例: 10"
                      value={run}
                      onChange={(e) => setRun(e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">水平方向の距離</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="coordinates" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">X₁</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={x1}
                      onChange={(e) => setX1(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Y₁</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={y1}
                      onChange={(e) => setY1(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">X₂</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="10"
                      value={x2}
                      onChange={(e) => setX2(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Y₂</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="2.5"
                      value={y2}
                      onChange={(e) => setY2(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">2点間の座標から勾配を計算します</p>
              </TabsContent>

              <TabsContent value="angle" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">角度</label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="例: 14.04"
                      value={angleInput}
                      onChange={(e) => setAngleInput(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">単位</label>
                    <Select value={angleUnit} onValueChange={(value: 'degrees' | 'radians') => setAngleUnit(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="degrees">度 (°)</SelectItem>
                        <SelectItem value="radians">ラジアン (rad)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">角度から勾配を計算します</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 結果表示 */}
        {getResultDisplay()}

        {/* 勾配の基準表 */}
        <Card>
          <CardHeader>
            <CardTitle>勾配の目安</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">建築・道路</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>車椅子対応スロープ</span>
                    <span className="font-mono text-green-600">≤ 8.33% (1:12)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>一般歩道</span>
                    <span className="font-mono text-blue-600">≤ 5% (1:20)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span>自動車道路（最大）</span>
                    <span className="font-mono text-yellow-600">≤ 6% (1:16.7)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>住宅街の坂道</span>
                    <span className="font-mono text-red-600">8-15%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">屋根・その他</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>切妻屋根（緩勾配）</span>
                    <span className="font-mono text-blue-600">30-50% (3-4.5寸)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span>切妻屋根（標準）</span>
                    <span className="font-mono text-purple-600">50-80% (5-6寸)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span>急勾配屋根</span>
                    <span className="font-mono text-orange-600">80-120% (7-10寸)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span>階段勾配</span>
                    <span className="font-mono text-red-600">130-200%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>勾配について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">勾配の表現方法</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>パーセント（%）</strong>: (高さ ÷ 水平距離) × 100</li>
                  <li><strong>角度（度）</strong>: arctan(高さ ÷ 水平距離) × 180 ÷ π</li>
                  <li><strong>比率</strong>: 1:n（水平nに対して垂直1）または n:1</li>
                  <li><strong>ラジアン</strong>: arctan(高さ ÷ 水平距離)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">計算式</h4>
                <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                  勾配（%） = (高さ ÷ 水平距離) × 100<br/>
                  角度（°） = arctan(高さ ÷ 水平距離) × 180 ÷ π<br/>
                  tan値 = 高さ ÷ 水平距離
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>建築設計（屋根勾配、スロープ設計）</li>
                  <li>土木工事（道路、排水勾配）</li>
                  <li>測量・地形調査</li>
                  <li>バリアフリー設計（車椅子対応）</li>
                  <li>登山・ハイキングルート分析</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}