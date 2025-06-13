'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CalculationResult {
  targetWattage: number
  targetTime: string
  calculations: {
    wattage: number
    time: string
    timeInSeconds: number
  }[]
}

export default function MicrowaveCalculatorPage() {
  const [originalWattage, setOriginalWattage] = useState('600')
  const [originalMinutes, setOriginalMinutes] = useState('2')
  const [originalSeconds, setOriginalSeconds] = useState('0')
  const [targetWattage, setTargetWattage] = useState('500')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const commonWattages = [300, 400, 500, 600, 700, 800, 900, 1000, 1200]

  const calculateTime = () => {
    const origWatt = parseInt(originalWattage)
    const targWatt = parseInt(targetWattage)
    const origMin = parseInt(originalMinutes)
    const origSec = parseInt(originalSeconds)

    if (!origWatt || !targWatt || isNaN(origMin) || isNaN(origSec)) {
      alert('有効な数値を入力してください')
      return
    }

    const originalTotalSeconds = origMin * 60 + origSec
    
    // 基本的な電力と時間の逆比例計算
    const targetTotalSeconds = Math.round((originalTotalSeconds * origWatt) / targWatt)
    
    const targetMinutes = Math.floor(targetTotalSeconds / 60)
    const targetSecondsRemainder = targetTotalSeconds % 60
    const targetTimeString = `${targetMinutes}:${targetSecondsRemainder.toString().padStart(2, '0')}`

    // 各ワット数での計算結果
    const calculations = commonWattages.map(wattage => {
      const timeInSeconds = Math.round((originalTotalSeconds * origWatt) / wattage)
      const minutes = Math.floor(timeInSeconds / 60)
      const seconds = timeInSeconds % 60
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`
      
      return {
        wattage,
        time: timeString,
        timeInSeconds
      }
    })

    setResult({
      targetWattage: targWatt,
      targetTime: targetTimeString,
      calculations
    })
  }

  const formatResultText = () => {
    if (!result) return ''
    
    const originalTime = `${originalMinutes}:${originalSeconds.padStart(2, '0')}`
    let text = `電子レンジ時間計算結果\n`
    text += `===================\n`
    text += `元の設定: ${originalWattage}W × ${originalTime}\n`
    text += `目標設定: ${result.targetWattage}W × ${result.targetTime}\n\n`
    text += `各ワット数での時間:\n`
    
    result.calculations.forEach(calc => {
      text += `${calc.wattage}W: ${calc.time}\n`
    })
    
    return text
  }

  const presets = [
    { name: '冷凍食品（一般的）', wattage: '600', minutes: '3', seconds: '0' },
    { name: '弁当温め', wattage: '500', minutes: '1', seconds: '30' },
    { name: 'ご飯温め', wattage: '600', minutes: '1', seconds: '0' },
    { name: '牛乳温め', wattage: '600', minutes: '1', seconds: '20' },
    { name: '野菜蒸し', wattage: '600', minutes: '2', seconds: '30' }
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setOriginalWattage(preset.wattage)
    setOriginalMinutes(preset.minutes)
    setOriginalSeconds(preset.seconds)
  }

  return (
    <ToolLayout
      title="電子レンジ時間計算器"
      description="ワット数に応じた加熱時間を計算します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>元の設定（レシピの設定）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">ワット数</label>
                <Input
                  type="number"
                  value={originalWattage}
                  onChange={(e) => setOriginalWattage(e.target.value)}
                  placeholder="600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">分</label>
                <Input
                  type="number"
                  value={originalMinutes}
                  onChange={(e) => setOriginalMinutes(e.target.value)}
                  placeholder="2"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">秒</label>
                <Input
                  type="number"
                  value={originalSeconds}
                  onChange={(e) => setOriginalSeconds(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>目標設定（あなたの電子レンジ）</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium mb-2">ワット数</label>
              <Select value={targetWattage} onValueChange={setTargetWattage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonWattages.map(wattage => (
                    <SelectItem key={wattage} value={wattage.toString()}>
                      {wattage}W
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button onClick={calculateTime} className="w-full">
          時間を計算
        </Button>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>計算結果</CardTitle>
                <CopyButton text={formatResultText()} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {result.targetWattage}Wでの調理時間
                  </h3>
                  <p className="text-3xl font-bold text-blue-700">
                    {result.targetTime}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">各ワット数での時間一覧</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {result.calculations.map((calc, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-center ${
                          calc.wattage === result.targetWattage
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <p className="font-semibold">{calc.wattage}W</p>
                        <p className="text-lg font-mono">{calc.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>プリセット例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{preset.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                    >
                      使用
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {preset.wattage}W × {preset.minutes}:{preset.seconds.padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>電子レンジについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">ワット数と加熱時間の関係</h4>
                <p>
                  電子レンジの加熱は電力に比例します。ワット数が高いほど短時間で加熱でき、
                  低いほど長時間必要になります。基本的に電力と時間は逆比例の関係にあります。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">一般的なワット数</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>500W</strong>: 解凍、温め直し</li>
                  <li><strong>600W</strong>: 最も一般的な設定</li>
                  <li><strong>700W</strong>: やや強めの加熱</li>
                  <li><strong>800W以上</strong>: 高出力、時短調理</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>食材の量や形状によって加熱時間は変わります</li>
                  <li>容器の材質も加熱効率に影響します</li>
                  <li>計算結果は目安として、実際の仕上がりを確認してください</li>
                  <li>過加熱を避けるため、少しずつ時間を延長することをお勧めします</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">計算式</h4>
                <p className="bg-gray-50 p-3 rounded font-mono text-xs">
                  新しい時間 = 元の時間 × (元のワット数 ÷ 新しいワット数)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}