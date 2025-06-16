'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

interface TaxResult {
  grossIncome: number
  basicDeduction: number
  socialInsurance: number
  taxableIncome: number
  incomeTax: number
  residentTax: number
  totalTax: number
  netIncome: number
  takeHomeRatio: number
}

export default function TaxCalculatorTool() {
  const [income, setIncome] = useState('4000000')
  const [age, setAge] = useState<'under65' | 'over65'>('under65')
  const [socialInsuranceRate, setSocialInsuranceRate] = useState('15')
  const [hasSpouse, setHasSpouse] = useState(false)
  const [dependents, setDependents] = useState('0')
  const [prefecture, setPrefecture] = useState('tokyo')

  const result = useMemo(() => {
    const grossIncome = parseFloat(income) || 0
    const dependentCount = parseInt(dependents) || 0
    const socialRate = parseFloat(socialInsuranceRate) / 100

    if (grossIncome <= 0) return null

    // 社会保険料
    const socialInsurance = grossIncome * socialRate

    // 給与所得控除（2020年分以降）
    let salaryDeduction = 0
    if (grossIncome <= 1625000) {
      salaryDeduction = 550000
    } else if (grossIncome <= 1800000) {
      salaryDeduction = grossIncome * 0.4 - 100000
    } else if (grossIncome <= 3600000) {
      salaryDeduction = grossIncome * 0.3 + 80000
    } else if (grossIncome <= 6600000) {
      salaryDeduction = grossIncome * 0.2 + 440000
    } else if (grossIncome <= 8500000) {
      salaryDeduction = grossIncome * 0.1 + 1100000
    } else {
      salaryDeduction = 1950000
    }

    // 基礎控除
    let basicDeduction = 0
    if (grossIncome <= 24000000) {
      if (grossIncome <= 22000000) {
        basicDeduction = 480000
      } else if (grossIncome <= 24500000) {
        basicDeduction = 320000
      } else {
        basicDeduction = 160000
      }
    }

    // 配偶者控除
    const spouseDeduction = hasSpouse ? 380000 : 0

    // 扶養控除
    const dependentDeduction = dependentCount * 380000

    // 社会保険料控除
    const socialInsuranceDeduction = socialInsurance

    // 合計控除額
    const totalDeductions = salaryDeduction + basicDeduction + spouseDeduction + dependentDeduction + socialInsuranceDeduction

    // 課税所得
    const taxableIncome = Math.max(0, grossIncome - totalDeductions)

    // 所得税（2020年分以降の税率）
    let incomeTax = 0
    if (taxableIncome <= 1950000) {
      incomeTax = taxableIncome * 0.05
    } else if (taxableIncome <= 3300000) {
      incomeTax = taxableIncome * 0.1 - 97500
    } else if (taxableIncome <= 6950000) {
      incomeTax = taxableIncome * 0.2 - 427500
    } else if (taxableIncome <= 9000000) {
      incomeTax = taxableIncome * 0.23 - 636000
    } else if (taxableIncome <= 18000000) {
      incomeTax = taxableIncome * 0.33 - 1536000
    } else if (taxableIncome <= 40000000) {
      incomeTax = taxableIncome * 0.4 - 2796000
    } else {
      incomeTax = taxableIncome * 0.45 - 4796000
    }

    // 復興特別所得税
    incomeTax *= 1.021

    // 住民税（所得割10% + 均等割5000円）
    const residentTax = taxableIncome * 0.1 + 5000

    const totalTax = incomeTax + residentTax + socialInsurance
    const netIncome = grossIncome - totalTax
    const takeHomeRatio = (netIncome / grossIncome) * 100

    return {
      grossIncome,
      basicDeduction: totalDeductions,
      socialInsurance,
      taxableIncome,
      incomeTax,
      residentTax,
      totalTax,
      netIncome,
      takeHomeRatio
    }
  }, [income, age, socialInsuranceRate, hasSpouse, dependents, prefecture])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const generateSummaryText = () => {
    if (!result) return ''
    
    return `【税金計算結果】
年収: ${formatCurrency(result.grossIncome)}
課税所得: ${formatCurrency(result.taxableIncome)}

所得税: ${formatCurrency(result.incomeTax)}
住民税: ${formatCurrency(result.residentTax)}
社会保険料: ${formatCurrency(result.socialInsurance)}
合計税負担: ${formatCurrency(result.totalTax)}

手取り収入: ${formatCurrency(result.netIncome)}
手取り率: ${result.takeHomeRatio.toFixed(1)}%
`
  }

  return (
    <ToolLayout
      title="税金計算機"
      description="所得税・住民税・社会保険料を計算して手取り収入を算出します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>収入・控除情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="income">年収（円）</label>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="4000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="age">年齢</label>
                <Select value={age} onValueChange={(value: 'under65' | 'over65') => setAge(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under65">65歳未満</SelectItem>
                    <SelectItem value="over65">65歳以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="socialInsuranceRate">社会保険料率（%）</label>
                <Input
                  id="socialInsuranceRate"
                  type="number"
                  step="0.1"
                  value={socialInsuranceRate}
                  onChange={(e) => setSocialInsuranceRate(e.target.value)}
                  placeholder="15"
                />
                <p className="text-xs text-gray-500 mt-1">
                  健康保険・厚生年金・雇用保険等の合計率（目安: 15%前後）
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spouse"
                  checked={hasSpouse}
                  onCheckedChange={(checked) => setHasSpouse(checked as boolean)}
                />
                <label htmlFor="spouse" className="text-sm font-medium">配偶者あり（配偶者控除適用）</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="dependents">扶養家族数（人）</label>
                <Input
                  id="dependents"
                  type="number"
                  min="0"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>計算結果</CardTitle>
                  <CopyButton text={generateSummaryText()} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">年収:</span>
                    <span className="font-semibold">{formatCurrency(result.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">課税所得:</span>
                    <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
                  </div>
                </div>

                <div className="border-t pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">所得税:</span>
                    <span className="text-red-600">{formatCurrency(result.incomeTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">住民税:</span>
                    <span className="text-red-600">{formatCurrency(result.residentTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">社会保険料:</span>
                    <span className="text-red-600">{formatCurrency(result.socialInsurance)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span className="text-sm">税負担合計:</span>
                    <span className="text-red-600">{formatCurrency(result.totalTax)}</span>
                  </div>
                </div>

                <div className="border-t pt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">手取り収入:</span>
                    <span className="font-semibold text-blue-600 text-lg">{formatCurrency(result.netIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">手取り率:</span>
                    <span className="font-semibold text-blue-600">{result.takeHomeRatio.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>詳細内訳</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">所得・控除</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>年収:</span>
                      <span>{formatCurrency(result.grossIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>各種控除合計:</span>
                      <span>-{formatCurrency(result.basicDeduction)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>課税所得:</span>
                      <span>{formatCurrency(result.taxableIncome)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-red-700">税負担</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>所得税:</span>
                      <span>{formatCurrency(result.incomeTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>住民税:</span>
                      <span>{formatCurrency(result.residentTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>社会保険料:</span>
                      <span>{formatCurrency(result.socialInsurance)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>合計:</span>
                      <span>{formatCurrency(result.totalTax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>税金計算について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">計算の仕組み</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">所得税:</span> 累進課税方式で、所得が高いほど税率が上がります（5%〜45%）</p>
                  <p><span className="font-medium">住民税:</span> 都道府県民税と市町村民税の合計（一律10% + 均等割）</p>
                  <p><span className="font-medium">社会保険料:</span> 健康保険・厚生年金・雇用保険・介護保険の合計</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">主な控除項目</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>基礎控除: 48万円（所得によって減額・消失）</li>
                  <li>給与所得控除: 給与額に応じて自動適用</li>
                  <li>配偶者控除: 38万円（配偶者の所得要件あり）</li>
                  <li>扶養控除: 38万円/人（扶養親族1人につき）</li>
                  <li>社会保険料控除: 支払った社会保険料の全額</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>この計算は簡易版です。実際の税額とは異なる場合があります</li>
                  <li>医療費控除、住宅ローン控除などは考慮されていません</li>
                  <li>社会保険料率は職種や会社によって異なります</li>
                  <li>住民税の均等割額は自治体により異なります</li>
                  <li>正確な税額は税務署や税理士にご相談ください</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">活用シーン</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>転職時の手取り収入比較</li>
                  <li>副業収入がある場合の税負担計算</li>
                  <li>年収交渉の参考資料作成</li>
                  <li>家計管理・資金計画の立案</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}