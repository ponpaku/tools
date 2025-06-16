'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
  
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LoanResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  paymentSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
}

export default function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState('3000000')
  const [interestRate, setInterestRate] = useState('1.5')
  const [loanTerm, setLoanTerm] = useState('35')
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years')
  const [paymentType, setPaymentType] = useState<'equal-payment' | 'equal-principal'>('equal-payment')

  const result = useMemo(() => {
    const p = parseFloat(principal) || 0
    const r = parseFloat(interestRate) / 100 / 12 // 月利
    const n = termUnit === 'years' ? parseInt(loanTerm) * 12 : parseInt(loanTerm) // 総支払回数

    if (p <= 0 || r < 0 || n <= 0) {
      return null
    }

    if (paymentType === 'equal-payment') {
      // 元利均等返済
      const monthlyPayment = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalPayment = monthlyPayment * n
      const totalInterest = totalPayment - p

      const paymentSchedule = []
      let balance = p

      for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r
        const principalPayment = monthlyPayment - interestPayment
        balance -= principalPayment

        paymentSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        })

        if (balance <= 0) break
      }

      return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        paymentSchedule
      }
    } else {
      // 元金均等返済
      const principalPayment = p / n
      let totalPayment = 0
      let totalInterest = 0
      const paymentSchedule = []
      let balance = p

      for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r
        const monthlyPayment = principalPayment + interestPayment
        balance -= principalPayment
        totalPayment += monthlyPayment
        totalInterest += interestPayment

        paymentSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        })

        if (balance <= 0) break
      }

      return {
        monthlyPayment: paymentSchedule[0]?.payment || 0, // 初回支払額
        totalPayment,
        totalInterest,
        paymentSchedule
      }
    }
  }, [principal, interestRate, loanTerm, termUnit, paymentType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP').format(Math.round(num))
  }

  const generateSummaryText = () => {
    if (!result) return ''
    
    const termText = termUnit === 'years' ? `${loanTerm}年` : `${loanTerm}ヶ月`
    const paymentTypeText = paymentType === 'equal-payment' ? '元利均等返済' : '元金均等返済'
    
    return `【ローン返済計算結果】
借入金額: ${formatCurrency(parseFloat(principal))}
金利: ${interestRate}%（年利）
返済期間: ${termText}
返済方式: ${paymentTypeText}

月々の返済額: ${formatCurrency(result.monthlyPayment)}${paymentType === 'equal-principal' ? '（初回）' : ''}
総返済額: ${formatCurrency(result.totalPayment)}
利息総額: ${formatCurrency(result.totalInterest)}
`
  }

  return (
    <ToolLayout
      title="ローン返済・利息計算機"
      description="住宅ローン・自動車ローンなどの返済計画と利息を計算します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ローン条件設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="principal">借入金額（円）</label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="3000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="interestRate">年利率（%）</label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="loanTerm">返済期間</label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="termUnit">単位</label>
                  <Select value={termUnit} onValueChange={(value: 'years' | 'months') => setTermUnit(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="years">年</SelectItem>
                      <SelectItem value="months">ヶ月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="paymentType">返済方式</label>
                <Select value={paymentType} onValueChange={(value: 'equal-payment' | 'equal-principal') => setPaymentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal-payment">元利均等返済</SelectItem>
                    <SelectItem value="equal-principal">元金均等返済</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">月々の返済額:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(result.monthlyPayment)}
                      {paymentType === 'equal-principal' && <span className="text-xs text-gray-500">（初回）</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">総返済額:</span>
                    <span className="font-semibold">{formatCurrency(result.totalPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">利息総額:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(result.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">借入金額に対する利息割合:</span>
                    <span className="font-semibold">
                      {((result.totalInterest / parseFloat(principal)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">返済概要</TabsTrigger>
              <TabsTrigger value="schedule">返済予定表</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>返済概要・比較</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-blue-800">元利均等返済の場合</h4>
                        <div className="text-sm space-y-1">
                          <p>月々の返済額が一定</p>
                          <p>返済開始時は利息の割合が高い</p>
                          <p>返済計画が立てやすい</p>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-green-800">元金均等返済の場合</h4>
                        <div className="text-sm space-y-1">
                          <p>元金の返済額が一定</p>
                          <p>返済開始時の負担が大きい</p>
                          <p>総利息額を抑えられる</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">現在の設定での詳細</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">借入金額:</span>
                          <p className="font-semibold">{formatCurrency(parseFloat(principal))}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">年利率:</span>
                          <p className="font-semibold">{interestRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">返済期間:</span>
                          <p className="font-semibold">{termUnit === 'years' ? `${loanTerm}年` : `${loanTerm}ヶ月`}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">返済方式:</span>
                          <p className="font-semibold">{paymentType === 'equal-payment' ? '元利均等' : '元金均等'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>返済予定表（最初の12回分）</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">回数</th>
                          <th className="text-right p-2">返済額</th>
                          <th className="text-right p-2">元金</th>
                          <th className="text-right p-2">利息</th>
                          <th className="text-right p-2">残高</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.paymentSchedule.slice(0, 12).map((payment) => (
                          <tr key={payment.month} className="border-b">
                            <td className="p-2">{payment.month}</td>
                            <td className="text-right p-2">{formatNumber(payment.payment)}</td>
                            <td className="text-right p-2">{formatNumber(payment.principal)}</td>
                            <td className="text-right p-2">{formatNumber(payment.interest)}</td>
                            <td className="text-right p-2">{formatNumber(payment.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.paymentSchedule.length > 12 && (
                      <p className="text-xs text-gray-500 mt-2">
                        ※最初の12回分のみ表示。全{result.paymentSchedule.length}回の返済予定
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <Card>
          <CardHeader>
            <CardTitle>ローン返済について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">返済方式の違い</h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">元利均等返済:</span>
                    <p>毎月の返済額（元金+利息）が一定の方式。返済計画が立てやすく、多くの住宅ローンで採用されています。</p>
                  </div>
                  <div>
                    <span className="font-medium">元金均等返済:</span>
                    <p>毎月の元金返済額が一定で、利息は残高に応じて減少する方式。総利息額は元利均等より少なくなります。</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用シーン</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>住宅ローンの返済計画検討</li>
                  <li>自動車ローンの比較検討</li>
                  <li>教育ローンの返済シミュレーション</li>
                  <li>リフォームローンの計算</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>実際のローンには保証料や手数料などの諸費用が別途必要です</li>
                  <li>変動金利の場合、金利変更により返済額が変わる可能性があります</li>
                  <li>繰上返済により、返済期間短縮や返済額軽減が可能です</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}