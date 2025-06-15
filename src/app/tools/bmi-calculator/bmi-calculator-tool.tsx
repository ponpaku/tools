'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type UnitSystem = 'metric' | 'imperial'

interface BMIResult {
  bmi: number
  category: string
  status: 'underweight' | 'normal' | 'overweight' | 'obese'
  idealWeightRange: { min: number; max: number }
}

export default function BMICalculatorTool() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')

  const result = useMemo((): BMIResult | null => {
    let heightInMeters: number
    let weightInKg: number

    if (unitSystem === 'metric') {
      const heightValue = parseFloat(height)
      const weightValue = parseFloat(weight)
      
      if (isNaN(heightValue) || isNaN(weightValue) || heightValue <= 0 || weightValue <= 0) {
        return null
      }
      
      heightInMeters = heightValue / 100 // cm to meters
      weightInKg = weightValue
    } else {
      const feetValue = parseFloat(feet)
      const inchesValue = parseFloat(inches) || 0
      const weightValue = parseFloat(weight)
      
      if (isNaN(feetValue) || isNaN(weightValue) || feetValue <= 0 || weightValue <= 0) {
        return null
      }
      
      heightInMeters = (feetValue * 12 + inchesValue) * 0.0254 // feet + inches to meters
      weightInKg = weightValue * 0.453592 // pounds to kg
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters)
    
    let category: string
    let status: 'underweight' | 'normal' | 'overweight' | 'obese'
    
    if (bmi < 18.5) {
      category = '低体重（やせ）'
      status = 'underweight'
    } else if (bmi < 25) {
      category = '普通体重'
      status = 'normal'
    } else if (bmi < 30) {
      category = '肥満（1度）'
      status = 'overweight'
    } else {
      category = '肥満（2度以上）'
      status = 'obese'
    }

    // 理想体重範囲 (BMI 18.5-24.9)
    const minIdealWeight = 18.5 * (heightInMeters * heightInMeters)
    const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters)
    
    const idealWeightRange = {
      min: unitSystem === 'metric' ? minIdealWeight : minIdealWeight / 0.453592,
      max: unitSystem === 'metric' ? maxIdealWeight : maxIdealWeight / 0.453592
    }

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      status,
      idealWeightRange
    }
  }, [unitSystem, height, weight, feet, inches])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'underweight': return 'text-blue-600 bg-blue-50'
      case 'normal': return 'text-green-600 bg-green-50'
      case 'overweight': return 'text-yellow-600 bg-yellow-50'
      case 'obese': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <ToolLayout
      title="BMI計算機"
      description="身長・体重からBMI（Body Mass Index）を計算"
    >
      <div className="space-y-6">
        {/* 単位系選択 */}
        <Card>
          <CardHeader>
            <CardTitle>単位系</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={unitSystem} onValueChange={(value: UnitSystem) => setUnitSystem(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">📏 メートル法（cm・kg）</SelectItem>
                <SelectItem value="imperial">📐 ヤード・ポンド法（ft・in・lb）</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* 入力フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 身長入力 */}
          <Card>
            <CardHeader>
              <CardTitle>身長</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {unitSystem === 'metric' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">センチメートル (cm)</label>
                  <Input
                    type="number"
                    placeholder="例: 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-lg"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">フィート (ft)</label>
                    <Input
                      type="number"
                      placeholder="例: 5"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">インチ (in)</label>
                    <Input
                      type="number"
                      placeholder="例: 8"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 体重入力 */}
          <Card>
            <CardHeader>
              <CardTitle>体重</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-medium mb-2">
                {unitSystem === 'metric' ? 'キログラム (kg)' : 'ポンド (lb)'}
              </label>
              <Input
                type="number"
                placeholder={unitSystem === 'metric' ? '例: 65' : '例: 143'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* 結果表示 */}
        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>計算結果</CardTitle>
                <CopyButton text={`BMI: ${result.bmi} (${result.category})`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.bmi}
                </div>
                <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getStatusColor(result.status)}`}>
                  {result.category}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">理想体重範囲</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg">
                    {result.idealWeightRange.min.toFixed(1)} - {result.idealWeightRange.max.toFixed(1)} 
                    {unitSystem === 'metric' ? ' kg' : ' lb'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    BMI 18.5-24.9 の範囲
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* BMI基準表 */}
        <Card>
          <CardHeader>
            <CardTitle>BMI判定基準</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">低体重（やせ）</span>
                <span className="text-blue-600 font-bold">18.5未満</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">普通体重</span>
                <span className="text-green-600 font-bold">18.5以上25未満</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">肥満（1度）</span>
                <span className="text-yellow-600 font-bold">25以上30未満</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium">肥満（2度以上）</span>
                <span className="text-red-600 font-bold">30以上</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>BMIについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">BMIとは</h4>
                <p>
                  BMI（Body Mass Index）は、身長と体重から算出される肥満度を表す指標です。
                  計算式：体重(kg) ÷ 身長(m)²
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>筋肉量や骨格の違いは考慮されません</li>
                  <li>妊娠中や18歳未満は適用外です</li>
                  <li>あくまで目安として参考にしてください</li>
                  <li>健康に関する具体的な相談は医師にご相談ください</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>健康管理・ダイエットの目標設定</li>
                  <li>定期健康診断の事前確認</li>
                  <li>生活習慣の見直し検討</li>
                  <li>フィットネス・トレーニング計画</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}