'use client'

import { useState, useEffect, useCallback } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TimeCalculatorTool() {
  // 時間加算・減算
  const [time1Hours, setTime1Hours] = useState<string>('')
  const [time1Minutes, setTime1Minutes] = useState<string>('')
  const [time1Seconds, setTime1Seconds] = useState<string>('')
  const [time2Hours, setTime2Hours] = useState<string>('')
  const [time2Minutes, setTime2Minutes] = useState<string>('')
  const [time2Seconds, setTime2Seconds] = useState<string>('')
  const [additionResult, setAdditionResult] = useState<string>('')
  const [subtractionResult, setSubtractionResult] = useState<string>('')

  // 時間差計算
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [timeDifference, setTimeDifference] = useState<string>('')

  const parseTimeInput = (hours: string, minutes: string, seconds: string) => {
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const s = parseInt(seconds) || 0
    return h * 3600 + m * 60 + s
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(Math.abs(totalSeconds) / 3600)
    const minutes = Math.floor((Math.abs(totalSeconds) % 3600) / 60)
    const seconds = Math.abs(totalSeconds) % 60
    const sign = totalSeconds < 0 ? '-' : ''
    
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const calculateAddition = useCallback(() => {
    const total1 = parseTimeInput(time1Hours, time1Minutes, time1Seconds)
    const total2 = parseTimeInput(time2Hours, time2Minutes, time2Seconds)
    const result = total1 + total2
    setAdditionResult(formatTime(result))
  }, [time1Hours, time1Minutes, time1Seconds, time2Hours, time2Minutes, time2Seconds])

  const calculateSubtraction = useCallback(() => {
    const total1 = parseTimeInput(time1Hours, time1Minutes, time1Seconds)
    const total2 = parseTimeInput(time2Hours, time2Minutes, time2Seconds)
    const result = total1 - total2
    setSubtractionResult(formatTime(result))
  }, [time1Hours, time1Minutes, time1Seconds, time2Hours, time2Minutes, time2Seconds])

  const calculateTimeDifference = useCallback(() => {
    if (!startTime || !endTime) return

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    
    let diffMs = end.getTime() - start.getTime()
    
    // 終了時刻が開始時刻より小さい場合（翌日をまたぐ）
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000
    }
    
    const diffSeconds = Math.floor(diffMs / 1000)
    setTimeDifference(formatTime(diffSeconds))
  }, [startTime, endTime])

  useEffect(() => {
    if (time1Hours || time1Minutes || time1Seconds || time2Hours || time2Minutes || time2Seconds) {
      calculateAddition()
      calculateSubtraction()
    }
  }, [time1Hours, time1Minutes, time1Seconds, time2Hours, time2Minutes, time2Seconds, calculateAddition, calculateSubtraction])

  useEffect(() => {
    if (startTime && endTime) {
      calculateTimeDifference()
    }
  }, [startTime, endTime, calculateTimeDifference])

  const clearAll = () => {
    setTime1Hours('')
    setTime1Minutes('')
    setTime1Seconds('')
    setTime2Hours('')
    setTime2Minutes('')
    setTime2Seconds('')
    setAdditionResult('')
    setSubtractionResult('')
    setStartTime('')
    setEndTime('')
    setTimeDifference('')
  }

  return (
    <ToolLayout
      title="時間計算ツール"
      description="時間の加算・減算・時間差計算"
    >
      <div className="space-y-6">
        <Tabs defaultValue="arithmetic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="arithmetic">時間の加算・減算</TabsTrigger>
            <TabsTrigger value="difference">時間差計算</TabsTrigger>
          </TabsList>

          <TabsContent value="arithmetic" className="space-y-6">
            {/* 時間入力 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 時間1 */}
              <Card>
                <CardHeader>
                  <CardTitle>時間1</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm font-medium">時</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time1Hours}
                        onChange={(e) => setTime1Hours(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">分</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time1Minutes}
                        onChange={(e) => setTime1Minutes(e.target.value)}
                        min="0"
                        max="59"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">秒</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time1Seconds}
                        onChange={(e) => setTime1Seconds(e.target.value)}
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 時間2 */}
              <Card>
                <CardHeader>
                  <CardTitle>時間2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm font-medium">時</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time2Hours}
                        onChange={(e) => setTime2Hours(e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">分</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time2Minutes}
                        onChange={(e) => setTime2Minutes(e.target.value)}
                        min="0"
                        max="59"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">秒</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={time2Seconds}
                        onChange={(e) => setTime2Seconds(e.target.value)}
                        min="0"
                        max="59"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 計算結果 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 加算結果 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>時間1 + 時間2</CardTitle>
                    {additionResult && <CopyButton text={additionResult} />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl p-4 bg-green-50 rounded-lg font-mono text-center">
                    {additionResult || '00:00:00'}
                  </div>
                </CardContent>
              </Card>

              {/* 減算結果 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>時間1 - 時間2</CardTitle>
                    {subtractionResult && <CopyButton text={subtractionResult} />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl p-4 bg-blue-50 rounded-lg font-mono text-center">
                    {subtractionResult || '00:00:00'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="difference" className="space-y-6">
            {/* 時刻入力 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 開始時刻 */}
              <Card>
                <CardHeader>
                  <CardTitle>開始時刻</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    step="1"
                  />
                </CardContent>
              </Card>

              {/* 終了時刻 */}
              <Card>
                <CardHeader>
                  <CardTitle>終了時刻</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    step="1"
                  />
                </CardContent>
              </Card>
            </div>

            {/* 時間差結果 */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>経過時間</CardTitle>
                  {timeDifference && <CopyButton text={timeDifference} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl p-6 bg-purple-50 rounded-lg font-mono text-center">
                  {timeDifference || '00:00:00'}
                </div>
                {timeDifference && (
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    ※終了時刻が開始時刻より小さい場合、翌日をまたぐとして計算されます
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* クリアボタン */}
        <div className="flex justify-center">
          <Button onClick={clearAll} variant="outline">
            🗑️ すべてクリア
          </Button>
        </div>

        {/* 使用例 */}
        <Card>
          <CardHeader>
            <CardTitle>使用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">⏰ 時間の加算・減算</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 作業時間の合計計算</li>
                  <li>• 動画の総再生時間</li>
                  <li>• レシピの調理時間計算</li>
                  <li>• プロジェクトの工数管理</li>
                  <li>• 残業時間の計算</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📅 時間差計算</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• 勤務時間の計算</li>
                  <li>• 会議の所要時間</li>
                  <li>• イベントの開催時間</li>
                  <li>• 移動にかかる時間</li>
                  <li>• 夜勤の労働時間計算</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>時間の加算・減算計算</li>
                  <li>時刻間の時間差計算</li>
                  <li>リアルタイム計算</li>
                  <li>翌日をまたぐ時間差の自動計算</li>
                  <li>結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">入力形式</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>加算・減算：時・分・秒を個別入力</li>
                  <li>時間差：24時間形式（HH:MM:SS）</li>
                  <li>負の値は「-」付きで表示</li>
                  <li>自動的な桁上がり・桁下がり計算</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>労働時間・勤務時間の管理</li>
                  <li>プロジェクト・タスクの工数計算</li>
                  <li>動画・音楽の再生時間管理</li>
                  <li>スポーツのタイム計測</li>
                  <li>料理の調理時間計算</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}