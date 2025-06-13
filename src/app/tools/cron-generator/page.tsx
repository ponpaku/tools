'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function CronGeneratorPage() {
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('0')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('*')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  const [preset, setPreset] = useState('')

  const weekdays = [
    { value: 0, name: '日曜日', short: '日' },
    { value: 1, name: '月曜日', short: '月' },
    { value: 2, name: '火曜日', short: '火' },
    { value: 3, name: '水曜日', short: '水' },
    { value: 4, name: '木曜日', short: '木' },
    { value: 5, name: '金曜日', short: '金' },
    { value: 6, name: '土曜日', short: '土' }
  ]

  const months = [
    { value: 1, name: '1月' },
    { value: 2, name: '2月' },
    { value: 3, name: '3月' },
    { value: 4, name: '4月' },
    { value: 5, name: '5月' },
    { value: 6, name: '6月' },
    { value: 7, name: '7月' },
    { value: 8, name: '8月' },
    { value: 9, name: '9月' },
    { value: 10, name: '10月' },
    { value: 11, name: '11月' },
    { value: 12, name: '12月' }
  ]

  const presets = [
    { name: '毎分', value: '* * * * *', description: '毎分実行' },
    { name: '毎時', value: '0 * * * *', description: '毎時0分に実行' },
    { name: '毎日', value: '0 0 * * *', description: '毎日午前0時に実行' },
    { name: '毎週', value: '0 0 * * 0', description: '毎週日曜日午前0時に実行' },
    { name: '毎月', value: '0 0 1 * *', description: '毎月1日午前0時に実行' },
    { name: '平日のみ', value: '0 9 * * 1-5', description: '平日午前9時に実行' },
    { name: '営業時間', value: '0 9-17 * * 1-5', description: '平日9時〜17時の毎時に実行' }
  ]

  const generateCron = (): string => {
    let cronMinute = minute
    let cronHour = hour
    let cronDayOfMonth = dayOfMonth
    let cronMonth = month
    let cronDayOfWeek = dayOfWeek

    // 選択された曜日を反映
    if (selectedDays.length > 0) {
      cronDayOfWeek = selectedDays.join(',')
    }

    // 選択された月を反映
    if (selectedMonths.length > 0) {
      cronMonth = selectedMonths.join(',')
    }

    return `${cronMinute} ${cronHour} ${cronDayOfMonth} ${cronMonth} ${cronDayOfWeek}`
  }

  const getDescription = (): string => {
    const cron = generateCron()
    const parts = cron.split(' ')
    
    try {
      let description = ''
      
      // 分の説明
      if (parts[0] === '*') {
        description += '毎分'
      } else if (parts[0].includes('/')) {
        const interval = parts[0].split('/')[1]
        description += `${interval}分毎`
      } else if (parts[0].includes(',')) {
        description += `${parts[0]}分`
      } else {
        description += `${parts[0]}分`
      }
      
      // 時間の説明
      if (parts[1] === '*') {
        if (parts[0] !== '*') description += 'の毎時'
      } else if (parts[1].includes('-')) {
        const range = parts[1].split('-')
        description += `の${range[0]}時〜${range[1]}時`
      } else if (parts[1].includes(',')) {
        description += `の${parts[1]}時`
      } else {
        description += `の${parts[1]}時`
      }
      
      // 日の説明
      if (parts[2] === '*') {
        description += '毎日'
      } else {
        description += `の${parts[2]}日`
      }
      
      // 月の説明
      if (parts[3] !== '*') {
        if (parts[3].includes(',')) {
          const monthNames = parts[3].split(',').map(m => `${m}月`).join('、')
          description += `の${monthNames}`
        } else {
          description += `の${parts[3]}月`
        }
      }
      
      // 曜日の説明
      if (parts[4] !== '*') {
        if (parts[4].includes(',')) {
          const dayNames = parts[4].split(',').map(d => {
            const day = weekdays.find(w => w.value === parseInt(d))
            return day ? day.short : d
          }).join('、')
          description += `の${dayNames}曜日`
        } else if (parts[4].includes('-')) {
          const range = parts[4].split('-')
          const startDay = weekdays.find(w => w.value === parseInt(range[0]))
          const endDay = weekdays.find(w => w.value === parseInt(range[1]))
          description += `の${startDay?.short}〜${endDay?.short}曜日`
        } else {
          const day = weekdays.find(w => w.value === parseInt(parts[4]))
          description += `の${day?.short}曜日`
        }
      }
      
      return description + 'に実行'
    } catch (error) {
      return 'cron式の説明を生成できませんでした'
    }
  }

  const applyPreset = (presetValue: string) => {
    const parts = presetValue.split(' ')
    setMinute(parts[0])
    setHour(parts[1])
    setDayOfMonth(parts[2])
    setMonth(parts[3])
    setDayOfWeek(parts[4])
    setSelectedDays([])
    setSelectedMonths([])
  }

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month].sort()
    )
  }

  const cronExpression = generateCron()
  const description = getDescription()

  return (
    <ToolLayout
      title="cron式ジェネレータ"
      description="スケジュール実行用のcron式を生成します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>プリセット</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => applyPreset(preset.value)}
                  className="justify-start text-left h-auto p-3"
                >
                  <div>
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-xs text-gray-600">{preset.description}</div>
                    <div className="text-xs font-mono text-blue-600">{preset.value}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">分 (0-59)</label>
            <Input
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">例: 0, 15, */5, 0-30</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">時 (0-23)</label>
            <Input
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">例: 0, 9, */2, 9-17</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">日 (1-31)</label>
            <Input
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              placeholder="*"
            />
            <p className="text-xs text-gray-500 mt-1">例: 1, 15, *, */2</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">月 (1-12)</label>
            <Input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="*"
            />
            <p className="text-xs text-gray-500 mt-1">例: 1, 6, *, 1-6</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">曜日 (0-6)</label>
            <Input
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              placeholder="*"
            />
            <p className="text-xs text-gray-500 mt-1">例: 0, 1-5, *, 1,3,5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>曜日選択</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weekdays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={() => handleDayToggle(day.value)}
                    />
                    <label className="text-sm">{day.name}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>月選択</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                  <div key={month.value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedMonths.includes(month.value)}
                      onCheckedChange={() => handleMonthToggle(month.value)}
                    />
                    <label className="text-sm">{month.name}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>生成されたcron式</CardTitle>
              <CopyButton text={cronExpression} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-mono text-lg font-bold text-center">{cronExpression}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-center text-blue-800 font-semibold">{description}</p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="font-semibold mb-2">cron式の構造:</p>
                <div className="grid grid-cols-5 gap-2 font-mono text-xs">
                  <div className="text-center bg-gray-100 p-2 rounded">分<br/>(0-59)</div>
                  <div className="text-center bg-gray-100 p-2 rounded">時<br/>(0-23)</div>
                  <div className="text-center bg-gray-100 p-2 rounded">日<br/>(1-31)</div>
                  <div className="text-center bg-gray-100 p-2 rounded">月<br/>(1-12)</div>
                  <div className="text-center bg-gray-100 p-2 rounded">曜日<br/>(0-6)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>特殊文字の説明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">基本的な記号</h4>
                  <ul className="space-y-1">
                    <li><span className="font-mono bg-gray-100 px-1 rounded">*</span> - すべての値（任意）</li>
                    <li><span className="font-mono bg-gray-100 px-1 rounded">?</span> - 指定なし（日と曜日のみ）</li>
                    <li><span className="font-mono bg-gray-100 px-1 rounded">-</span> - 範囲指定 (例: 1-5)</li>
                    <li><span className="font-mono bg-gray-100 px-1 rounded">,</span> - リスト指定 (例: 1,3,5)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">間隔指定</h4>
                  <ul className="space-y-1">
                    <li><span className="font-mono bg-gray-100 px-1 rounded">/</span> - 間隔指定 (例: */5 = 5分毎)</li>
                    <li><span className="font-mono bg-gray-100 px-1 rounded">*/n</span> - n間隔で実行</li>
                    <li><span className="font-mono bg-gray-100 px-1 rounded">n-m/x</span> - n〜mの範囲でx間隔</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用例</h4>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-mono">0 */2 * * *</span> - 2時間毎に実行
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-mono">30 9-17 * * 1-5</span> - 平日9時〜17時の30分に実行
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-mono">0 0 1,15 * *</span> - 毎月1日と15日の午前0時に実行
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="font-mono">*/15 * * * *</span> - 15分毎に実行
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>曜日は日曜日=0、月曜日=1...土曜日=6</li>
                  <li>日と曜日を同時に指定する場合は注意が必要</li>
                  <li>システムによって秒の指定が必要な場合があります</li>
                  <li>タイムゾーンの設定を確認してください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}