'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function WeekdayListPage() {
  const [targetWeekday, setTargetWeekday] = useState('0') // 0=日曜日
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [months, setMonths] = useState('6')
  const [results, setResults] = useState<string[]>([])
  const [outputFormat, setOutputFormat] = useState<'japanese' | 'slash' | 'hyphen' | 'iso'>('japanese')

  const weekdays = [
    { value: '0', name: '日曜日', short: '日' },
    { value: '1', name: '月曜日', short: '月' },
    { value: '2', name: '火曜日', short: '火' },
    { value: '3', name: '水曜日', short: '水' },
    { value: '4', name: '木曜日', short: '木' },
    { value: '5', name: '金曜日', short: '金' },
    { value: '6', name: '土曜日', short: '土' }
  ]

  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]

    switch (format) {
      case 'japanese':
        return `${year}年${month}月${day}日(${weekday.short})`
      case 'slash':
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
      case 'hyphen':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      case 'iso':
        return date.toISOString().split('T')[0]
      default:
        return date.toLocaleDateString('ja-JP')
    }
  }

  const generateWeekdayList = () => {
    const start = new Date(startDate)
    const monthsNum = parseInt(months)
    const targetDay = parseInt(targetWeekday)
    
    if (isNaN(monthsNum) || monthsNum <= 0) {
      alert('有効な月数を入力してください')
      return
    }

    const endDate = new Date(start)
    endDate.setMonth(endDate.getMonth() + monthsNum)
    
    const dates: Date[] = []
    const current = new Date(start)
    
    // 最初の指定曜日を探す
    while (current.getDay() !== targetDay) {
      current.setDate(current.getDate() + 1)
    }
    
    // 指定期間内の該当曜日をすべて収集
    while (current <= endDate) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 7) // 1週間後
    }
    
    const formattedDates = dates.map(date => formatDate(date, outputFormat))
    setResults(formattedDates)
  }

  const copyAllDates = () => {
    const allDates = results.join('\n')
    navigator.clipboard.writeText(allDates)
  }

  const getWeekdayName = () => {
    return weekdays.find(w => w.value === targetWeekday)?.name || ''
  }

  const presets = [
    { name: '今日から6ヶ月', months: '6', startDate: new Date().toISOString().split('T')[0] },
    { name: '来月から3ヶ月', months: '3', startDate: (() => {
      const date = new Date()
      date.setMonth(date.getMonth() + 1, 1)
      return date.toISOString().split('T')[0]
    })() },
    { name: '来年1月から12ヶ月', months: '12', startDate: `${new Date().getFullYear() + 1}-01-01` },
    { name: '今年度 (4月から12ヶ月)', months: '12', startDate: (() => {
      const year = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1
      return `${year}-04-01`
    })() }
  ]

  const applyPreset = (preset: typeof presets[0]) => {
    setStartDate(preset.startDate)
    setMonths(preset.months)
  }

  return (
    <ToolLayout
      title="曜日リスト化ツール"
      description="指定された曜日の日付リストを生成します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">対象曜日</label>
            <Select value={targetWeekday} onValueChange={setTargetWeekday}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map(day => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">出力形式</label>
            <Select value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="japanese">2024年12月25日(水)</SelectItem>
                <SelectItem value="slash">2024/12/25</SelectItem>
                <SelectItem value="hyphen">2024-12-25</SelectItem>
                <SelectItem value="iso">ISO形式</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">開始日</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">対象期間（月数）</label>
            <Input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              min="1"
              max="60"
              placeholder="6"
            />
          </div>
        </div>

        <Button onClick={generateWeekdayList} className="w-full">
          {getWeekdayName()}のリストを生成
        </Button>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {getWeekdayName()}の日付リスト ({results.length}件)
                </CardTitle>
                <div className="flex gap-2">
                  <CopyButton text={results.join('\n')} />
                  <Button variant="outline" size="sm" onClick={() => setResults([])}>
                    クリア
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {results.map((date, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <span className="font-mono text-sm">{date}</span>
                      <CopyButton text={date} className="opacity-50 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                {startDate} から {months}ヶ月間の{getWeekdayName()}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>プリセット期間</CardTitle>
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
                      適用
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {preset.startDate} から {preset.months}ヶ月間
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">イベント・会議の企画</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>毎週定例会議の日程作成</li>
                  <li>月1回のイベント候補日リスト</li>
                  <li>習い事やレッスンのスケジュール</li>
                  <li>定期メンテナンスの実施日計画</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">ビジネス活用</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>営業日や休業日の一覧作成</li>
                  <li>プロジェクトの週次進捗会議日程</li>
                  <li>システムバックアップの実行日</li>
                  <li>給与支払日や請求書発行日</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">個人利用</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ゴミ出し日のリマインダー</li>
                  <li>通院やジムの予定</li>
                  <li>家族の習い事送迎日</li>
                  <li>趣味活動の参加日程</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">出力形式の使い分け</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>日本語形式</strong>: 読みやすさ重視、印刷物や掲示用</li>
                  <li><strong>スラッシュ形式</strong>: 一般的な日付表記</li>
                  <li><strong>ハイフン形式</strong>: システム入力やデータベース用</li>
                  <li><strong>ISO形式</strong>: 国際標準、プログラミング用</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}