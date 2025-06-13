'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface MemorialDate {
  name: string
  date: string
  days: number
  description: string
}

export default function MemorialCalculatorPage() {
  const [deathDate, setDeathDate] = useState('')
  const [results, setResults] = useState<MemorialDate[]>([])

  const memorialDays = [
    { name: '初七日', days: 7, description: '逝去から7日目' },
    { name: '二七日', days: 14, description: '逝去から14日目' },
    { name: '三七日', days: 21, description: '逝去から21日目' },
    { name: '四七日', days: 28, description: '逝去から28日目' },
    { name: '五七日', days: 35, description: '逝去から35日目（三十五日忌）' },
    { name: '六七日', days: 42, description: '逝去から42日目' },
    { name: '七七日', days: 49, description: '逝去から49日目（四十九日忌）' },
    { name: '百箇日', days: 100, description: '逝去から100日目' },
    { name: '一周忌', days: 365, description: '逝去から1年後' },
    { name: '三回忌', days: 730, description: '逝去から2年後' },
    { name: '七回忌', days: 2190, description: '逝去から6年後' },
    { name: '十三回忌', days: 4380, description: '逝去から12年後' },
    { name: '十七回忌', days: 5840, description: '逝去から16年後' },
    { name: '二十三回忌', days: 8030, description: '逝去から22年後' },
    { name: '二十七回忌', days: 9490, description: '逝去から26年後' },
    { name: '三十三回忌', days: 11680, description: '逝去から32年後' },
    { name: '三十七回忌', days: 13140, description: '逝去から36年後' },
    { name: '四十三回忌', days: 15330, description: '逝去から42年後' },
    { name: '四十七回忌', days: 16790, description: '逝去から46年後' },
    { name: '五十回忌', days: 17885, description: '逝去から49年後' }
  ]

  const calculateMemorials = () => {
    if (!deathDate) return

    const death = new Date(deathDate)
    const memorialDates: MemorialDate[] = []

    memorialDays.forEach(memorial => {
      const memorialDate = new Date(death)
      memorialDate.setDate(memorialDate.getDate() + memorial.days)
      
      memorialDates.push({
        name: memorial.name,
        date: memorialDate.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short'
        }),
        days: memorial.days,
        description: memorial.description
      })
    })

    setResults(memorialDates)
  }

  const today = new Date()
  const upcomingMemorials = results.filter(memorial => {
    const memorialDate = new Date(memorial.date.replace(/年|月|日/g, '').replace(/\(.+\)/, '').split(' ').join('/'))
    return memorialDate >= today
  }).slice(0, 3)

  const resultText = results.map(memorial => 
    `${memorial.name}: ${memorial.date} (${memorial.description})`
  ).join('\n')

  return (
    <ToolLayout
      title="法要計算機"
      description="命日から各法要の日程を計算します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">命日</label>
          <Input
            type="date"
            value={deathDate}
            onChange={(e) => setDeathDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Button onClick={calculateMemorials} className="w-full" disabled={!deathDate}>
          法要日程を計算
        </Button>

        {results.length > 0 && (
          <>
            {upcomingMemorials.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">直近の法要</CardTitle>
                  <CardDescription>今後予定されている法要です</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingMemorials.map((memorial, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold text-orange-900">{memorial.name}</p>
                          <p className="text-sm text-orange-700">{memorial.description}</p>
                        </div>
                        <p className="font-bold text-orange-800">{memorial.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>全法要日程</CardTitle>
                  <CopyButton text={resultText} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((memorial, index) => {
                    const memorialDate = new Date(memorial.date.replace(/年|月|日/g, '').replace(/\(.+\)/, '').split(' ').join('/'))
                    const isPast = memorialDate < today
                    
                    return (
                      <div 
                        key={index} 
                        className={`flex justify-between items-center p-3 rounded-lg ${
                          isPast ? 'bg-gray-100' : 'bg-blue-50'
                        }`}
                      >
                        <div>
                          <p className={`font-semibold ${isPast ? 'text-gray-600' : 'text-blue-900'}`}>
                            {memorial.name}
                          </p>
                          <p className={`text-sm ${isPast ? 'text-gray-500' : 'text-blue-700'}`}>
                            {memorial.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${isPast ? 'text-gray-600' : 'text-blue-800'}`}>
                            {memorial.date}
                          </p>
                          {isPast && (
                            <p className="text-xs text-gray-500">済</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>法要について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">忌日法要（きにちほうよう）</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>初七日〜七七日</strong>: 7日ごとに行う法要</li>
                  <li><strong>四十九日</strong>: 最も重要な忌日法要</li>
                  <li><strong>百箇日</strong>: 忌明け後の重要な法要</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">年忌法要（ねんきほうよう）</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>一周忌</strong>: 満1年目の法要</li>
                  <li><strong>三回忌以降</strong>: 数え年で計算（2年目が三回忌）</li>
                  <li><strong>三十三回忌・五十回忌</strong>: 弔い上げとして行うことが多い</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}