'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CronParserPage() {
  const [cronExpression, setCronExpression] = useState('')
  const [parseResult, setParseResult] = useState<{
    isValid: boolean
    description: string
    breakdown: {
      minute: string
      hour: string
      dayOfMonth: string
      month: string
      dayOfWeek: string
    } | null
    nextExecutions: string[]
    error?: string
  } | null>(null)

  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  const parseField = (field: string, min: number, max: number, type: string): string => {
    if (field === '*') {
      return `すべての${type}`
    }
    
    if (field.includes('/')) {
      const [range, step] = field.split('/')
      if (range === '*') {
        return `${step}${type}毎`
      } else {
        return `${range}の範囲で${step}${type}毎`
      }
    }
    
    if (field.includes('-')) {
      const [start, end] = field.split('-')
      if (type === '曜日') {
        return `${weekdays[parseInt(start)]}曜日〜${weekdays[parseInt(end)]}曜日`
      } else if (type === '月') {
        return `${start}月〜${end}月`
      } else {
        return `${start}${type}〜${end}${type}`
      }
    }
    
    if (field.includes(',')) {
      const values = field.split(',')
      if (type === '曜日') {
        return values.map(v => `${weekdays[parseInt(v)]}曜日`).join('、')
      } else if (type === '月') {
        return values.map(v => `${v}月`).join('、')
      } else {
        return values.map(v => `${v}${type}`).join('、')
      }
    }
    
    if (type === '曜日') {
      return `${weekdays[parseInt(field)]}曜日`
    } else if (type === '月') {
      return `${field}月`
    } else {
      return `${field}${type}`
    }
  }

  const generateDescription = (parts: string[]): string => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
    
    let description = ''
    
    // 特殊なケースの処理
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return '毎分実行'
    }
    
    if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `毎時${minute}分に実行`
    }
    
    if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `毎日${hour}時${minute}分に実行`
    }
    
    // 通常の説明生成
    const minuteDesc = parseField(minute, 0, 59, '分')
    const hourDesc = parseField(hour, 0, 23, '時')
    const dayDesc = parseField(dayOfMonth, 1, 31, '日')
    const monthDesc = parseField(month, 1, 12, '月')
    const weekdayDesc = parseField(dayOfWeek, 0, 6, '曜日')
    
    // 基本的な時刻
    if (minute !== '*' || hour !== '*') {
      if (minute === '*') {
        description += `${hourDesc}の毎分`
      } else if (hour === '*') {
        description += `毎時${minuteDesc}`
      } else {
        description += `${hourDesc}${minuteDesc}`
      }
    }
    
    // 日の指定
    if (dayOfMonth !== '*') {
      description += `の${dayDesc}`
    }
    
    // 月の指定
    if (month !== '*') {
      description += `の${monthDesc}`
    }
    
    // 曜日の指定
    if (dayOfWeek !== '*') {
      description += `の${weekdayDesc}`
    }
    
    // 頻度の表現
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      description += '毎日'
    } else if (month === '*' && dayOfWeek === '*') {
      description += '毎月'
    } else if (dayOfMonth === '*' && month === '*') {
      description += ''
    }
    
    return description + 'に実行'
  }

  const getNextExecutions = (parts: string[]): string[] => {
    // 簡単な次回実行予測（実際の実装では複雑な計算が必要）
    const now = new Date()
    const executions: string[] = []
    
    try {
      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts
      
      // 簡単なケースのみ処理
      if (minute !== '*' && hour !== '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        const targetMinute = parseInt(minute)
        const targetHour = parseInt(hour)
        
        for (let i = 0; i < 5; i++) {
          const nextDate = new Date(now)
          nextDate.setDate(nextDate.getDate() + i)
          nextDate.setHours(targetHour, targetMinute, 0, 0)
          
          if (nextDate > now) {
            executions.push(nextDate.toLocaleString('ja-JP'))
          }
        }
      } else {
        executions.push('次回実行時刻の計算は複雑なため表示できません')
      }
    } catch (error) {
      executions.push('次回実行時刻を計算できませんでした')
    }
    
    return executions.slice(0, 5)
  }

  const validateCron = (cron: string): boolean => {
    const parts = cron.trim().split(/\s+/)
    if (parts.length !== 5) return false
    
    const validators = [
      (v: string) => validateField(v, 0, 59), // minute
      (v: string) => validateField(v, 0, 23), // hour
      (v: string) => validateField(v, 1, 31), // day
      (v: string) => validateField(v, 1, 12), // month
      (v: string) => validateField(v, 0, 6),  // day of week
    ]
    
    return parts.every((part, index) => validators[index](part))
  }

  const validateField = (field: string, min: number, max: number): boolean => {
    if (field === '*') return true
    
    try {
      if (field.includes('/')) {
        const [range, step] = field.split('/')
        if (range === '*') {
          const stepNum = parseInt(step)
          return stepNum > 0 && stepNum <= max
        }
        return validateField(range, min, max) && parseInt(step) > 0
      }
      
      if (field.includes('-')) {
        const [start, end] = field.split('-')
        const startNum = parseInt(start)
        const endNum = parseInt(end)
        return startNum >= min && endNum <= max && startNum <= endNum
      }
      
      if (field.includes(',')) {
        return field.split(',').every(v => {
          const num = parseInt(v.trim())
          return num >= min && num <= max
        })
      }
      
      const num = parseInt(field)
      return num >= min && num <= max
    } catch {
      return false
    }
  }

  const parseCron = () => {
    if (!cronExpression.trim()) {
      setParseResult(null)
      return
    }
    
    const cron = cronExpression.trim()
    const parts = cron.split(/\s+/)
    
    if (parts.length !== 5) {
      setParseResult({
        isValid: false,
        description: '',
        breakdown: null,
        nextExecutions: [],
        error: 'cron式は5つの部分（分 時 日 月 曜日）で構成される必要があります'
      })
      return
    }
    
    const isValid = validateCron(cron)
    
    if (!isValid) {
      setParseResult({
        isValid: false,
        description: '',
        breakdown: null,
        nextExecutions: [],
        error: 'cron式の形式が正しくありません'
      })
      return
    }
    
    const description = generateDescription(parts)
    const nextExecutions = getNextExecutions(parts)
    
    setParseResult({
      isValid: true,
      description,
      breakdown: {
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4]
      },
      nextExecutions
    })
  }

  const examples = [
    { cron: '0 0 * * *', description: '毎日午前0時に実行' },
    { cron: '*/5 * * * *', description: '5分毎に実行' },
    { cron: '0 9-17 * * 1-5', description: '平日の9時〜17時毎時に実行' },
    { cron: '30 2 1 * *', description: '毎月1日の午前2時30分に実行' },
    { cron: '0 0 * * 0', description: '毎週日曜日の午前0時に実行' },
    { cron: '15,45 * * * *', description: '毎時15分と45分に実行' }
  ]

  return (
    <ToolLayout
      title="cron式パーサー"
      description="cron式を解析して実行スケジュールを表示します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">cron式</label>
          <Input
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="例: 0 9 * * 1-5"
            className="font-mono"
          />
          <p className="text-sm text-gray-600 mt-1">
            形式: 分 時 日 月 曜日（スペース区切り）
          </p>
        </div>

        <Button onClick={parseCron} className="w-full" disabled={!cronExpression.trim()}>
          cron式を解析
        </Button>

        {parseResult && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  解析結果 
                  <span className={`ml-2 text-sm ${parseResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {parseResult.isValid ? '✓ 有効' : '✗ 無効'}
                  </span>
                </CardTitle>
                {parseResult.isValid && (
                  <CopyButton text={parseResult.description} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {parseResult.isValid ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">実行スケジュール</h4>
                    <p className="text-blue-700 text-lg">{parseResult.description}</p>
                  </div>
                  
                  {parseResult.breakdown && (
                    <div>
                      <h4 className="font-semibold mb-3">フィールド詳細</h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600">分 (0-59)</div>
                          <div className="font-mono text-lg">{parseResult.breakdown.minute}</div>
                          <div className="text-sm">{parseField(parseResult.breakdown.minute, 0, 59, '分')}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600">時 (0-23)</div>
                          <div className="font-mono text-lg">{parseResult.breakdown.hour}</div>
                          <div className="text-sm">{parseField(parseResult.breakdown.hour, 0, 23, '時')}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600">日 (1-31)</div>
                          <div className="font-mono text-lg">{parseResult.breakdown.dayOfMonth}</div>
                          <div className="text-sm">{parseField(parseResult.breakdown.dayOfMonth, 1, 31, '日')}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600">月 (1-12)</div>
                          <div className="font-mono text-lg">{parseResult.breakdown.month}</div>
                          <div className="text-sm">{parseField(parseResult.breakdown.month, 1, 12, '月')}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-600">曜日 (0-6)</div>
                          <div className="font-mono text-lg">{parseResult.breakdown.dayOfWeek}</div>
                          <div className="text-sm">{parseField(parseResult.breakdown.dayOfWeek, 0, 6, '曜日')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {parseResult.nextExecutions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">次回実行予定</h4>
                      <div className="space-y-2">
                        {parseResult.nextExecutions.map((execution, index) => (
                          <div key={index} className="bg-green-50 p-2 rounded font-mono text-sm">
                            {execution}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700">{parseResult.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>サンプルcron式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-mono text-lg">{example.cron}</div>
                      <div className="text-sm text-gray-600">{example.description}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCronExpression(example.cron)}
                    >
                      使用
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>cron式の基本</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">フィールドの説明</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2 text-left">フィールド</th>
                        <th className="border p-2 text-left">値の範囲</th>
                        <th className="border p-2 text-left">特殊文字</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">分</td>
                        <td className="border p-2">0-59</td>
                        <td className="border p-2">* , - /</td>
                      </tr>
                      <tr>
                        <td className="border p-2">時</td>
                        <td className="border p-2">0-23</td>
                        <td className="border p-2">* , - /</td>
                      </tr>
                      <tr>
                        <td className="border p-2">日</td>
                        <td className="border p-2">1-31</td>
                        <td className="border p-2">* , - /</td>
                      </tr>
                      <tr>
                        <td className="border p-2">月</td>
                        <td className="border p-2">1-12</td>
                        <td className="border p-2">* , - /</td>
                      </tr>
                      <tr>
                        <td className="border p-2">曜日</td>
                        <td className="border p-2">0-6 (日=0)</td>
                        <td className="border p-2">* , - /</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">特殊文字の意味</h4>
                <ul className="space-y-1">
                  <li><span className="font-mono bg-gray-100 px-1 rounded">*</span> - すべての値</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">,</span> - 値のリスト（例: 1,3,5）</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">-</span> - 値の範囲（例: 1-5）</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">/</span> - ステップ値（例: */5）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">よく使用されるパターン</h4>
                <ul className="space-y-1">
                  <li><span className="font-mono bg-gray-100 px-1 rounded">0 0 * * *</span> - 毎日午前0時</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">*/15 * * * *</span> - 15分毎</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">0 9-17 * * 1-5</span> - 平日営業時間</li>
                  <li><span className="font-mono bg-gray-100 px-1 rounded">0 2 1 * *</span> - 毎月1日午前2時</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}