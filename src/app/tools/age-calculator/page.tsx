'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('')
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState<{
    years: number
    months: number
    days: number
    totalDays: number
    nextBirthday: string
    daysUntilBirthday: number
  } | null>(null)

  const calculateAge = () => {
    if (!birthDate) return

    const birth = new Date(birthDate)
    const target = new Date(targetDate)
    
    if (birth > target) {
      alert('生年月日は対象日より前の日付を入力してください')
      return
    }

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += prevMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

    // 次の誕生日を計算
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate())
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday: nextBirthday.toLocaleDateString('ja-JP'),
      daysUntilBirthday
    })
  }

  const resultText = result ? 
    `満年齢: ${result.years}歳 ${result.months}ヶ月 ${result.days}日\n` +
    `総日数: ${result.totalDays}日\n` +
    `次の誕生日: ${result.nextBirthday}\n` +
    `誕生日まで: ${result.daysUntilBirthday}日`
    : ''

  return (
    <ToolLayout
      title="満年齢計算機"
      description="生年月日から満年齢を詳細に計算します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">生年月日</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">計算基準日</label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateAge} className="w-full" disabled={!birthDate}>
          年齢を計算
        </Button>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>計算結果</CardTitle>
                <CopyButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">満年齢</h3>
                  <p className="text-2xl font-bold text-blue-700">
                    {result.years}歳 {result.months}ヶ月 {result.days}日
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">総日数</h3>
                  <p className="text-2xl font-bold text-green-700">
                    {result.totalDays.toLocaleString()}日
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">次の誕生日</h3>
                  <p className="text-lg font-bold text-purple-700">
                    {result.nextBirthday}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">誕生日まで</h3>
                  <p className="text-2xl font-bold text-orange-700">
                    {result.daysUntilBirthday}日
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>生年月日を入力してください</li>
              <li>計算基準日を設定できます（デフォルトは今日）</li>
              <li>満年齢、総日数、次の誕生日までの日数を表示します</li>
              <li>結果をコピーボタンでクリップボードにコピーできます</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}