'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UnixTimePage() {
  const [currentUnixTime, setCurrentUnixTime] = useState(Math.floor(Date.now() / 1000))
  const [inputValue, setInputValue] = useState('')
  const [inputType, setInputType] = useState<'unix' | 'datetime'>('unix')
  const [result, setResult] = useState<{
    unixTime: number
    localDateTime: string
    utcDateTime: string
    iso8601: string
    relative: string
  } | null>(null)

  // 現在時刻を1秒ごとに更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUnixTime(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const convert = () => {
    try {
      let timestamp: number
      
      if (inputType === 'unix') {
        timestamp = parseInt(inputValue)
        if (isNaN(timestamp)) {
          alert('有効なUnixタイムスタンプを入力してください')
          return
        }
        
        // 秒とミリ秒の自動判定
        if (timestamp > 10000000000) {
          timestamp = Math.floor(timestamp / 1000) // ミリ秒を秒に変換
        }
      } else {
        const date = new Date(inputValue)
        if (isNaN(date.getTime())) {
          alert('有効な日時を入力してください')
          return
        }
        timestamp = Math.floor(date.getTime() / 1000)
      }
      
      const date = new Date(timestamp * 1000)
      
      // 相対時間の計算
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffMinutes = Math.floor(diffSeconds / 60)
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)
      
      let relative = ''
      if (diffMs > 0) {
        if (diffDays > 0) {
          relative = `${diffDays}日前`
        } else if (diffHours > 0) {
          relative = `${diffHours}時間前`
        } else if (diffMinutes > 0) {
          relative = `${diffMinutes}分前`
        } else {
          relative = `${diffSeconds}秒前`
        }
      } else {
        const absDiffDays = Math.abs(diffDays)
        const absDiffHours = Math.abs(diffHours)
        const absDiffMinutes = Math.abs(diffMinutes)
        const absDiffSeconds = Math.abs(diffSeconds)
        
        if (absDiffDays > 0) {
          relative = `${absDiffDays}日後`
        } else if (absDiffHours > 0) {
          relative = `${absDiffHours}時間後`
        } else if (absDiffMinutes > 0) {
          relative = `${absDiffMinutes}分後`
        } else {
          relative = `${absDiffSeconds}秒後`
        }
      }
      
      setResult({
        unixTime: timestamp,
        localDateTime: date.toLocaleString('ja-JP', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          timeZoneName: 'short'
        }),
        utcDateTime: date.toISOString().replace('T', ' ').replace('.000Z', ' UTC'),
        iso8601: date.toISOString(),
        relative
      })
    } catch (error) {
      alert('変換エラーが発生しました')
    }
  }

  const setCurrentTime = () => {
    const now = Math.floor(Date.now() / 1000)
    setInputValue(now.toString())
    setInputType('unix')
  }

  const quickTimes = [
    { name: '現在時刻', value: () => Math.floor(Date.now() / 1000) },
    { name: '1時間前', value: () => Math.floor(Date.now() / 1000) - 3600 },
    { name: '1日前', value: () => Math.floor(Date.now() / 1000) - 86400 },
    { name: '1週間前', value: () => Math.floor(Date.now() / 1000) - 604800 },
    { name: '1ヶ月前', value: () => Math.floor(Date.now() / 1000) - 2592000 },
    { name: 'Unix元年 (1970/01/01)', value: () => 0 }
  ]

  const resultText = result ? 
    `Unixタイムスタンプ: ${result.unixTime}\n` +
    `ローカル時刻: ${result.localDateTime}\n` +
    `UTC時刻: ${result.utcDateTime}\n` +
    `ISO8601: ${result.iso8601}\n` +
    `相対時間: ${result.relative}`
    : ''

  return (
    <ToolLayout
      title="Unixタイム変換"
      description="Unixタイムスタンプと日時の相互変換を行います"
    >
      <div className="space-y-6">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">現在のUnixタイムスタンプ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-mono font-bold text-blue-700">
                  {currentUnixTime.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">
                  {new Date().toLocaleString('ja-JP', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    timeZoneName: 'short'
                  })}
                </p>
              </div>
              <CopyButton text={currentUnixTime.toString()} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">入力形式</label>
            <Select value={inputType} onValueChange={(value: 'unix' | 'datetime') => setInputType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unix">Unixタイムスタンプ</SelectItem>
                <SelectItem value="datetime">日時</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              {inputType === 'unix' ? 'Unixタイムスタンプ' : '日時'}
            </label>
            <Input
              type={inputType === 'unix' ? 'number' : 'datetime-local'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === 'unix' ? '1234567890' : ''}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={convert} className="flex-1" disabled={!inputValue}>
            変換実行
          </Button>
          <Button onClick={setCurrentTime} variant="outline">
            現在時刻
          </Button>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                <CopyButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Unixタイムスタンプ</h3>
                  <p className="font-mono text-lg">{result.unixTime.toLocaleString()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">相対時間</h3>
                  <p className="text-lg">{result.relative}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">ローカル時刻:</span>
                  <span className="font-mono">{result.localDateTime}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">UTC時刻:</span>
                  <span className="font-mono">{result.utcDateTime}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">ISO8601:</span>
                  <span className="font-mono text-sm">{result.iso8601}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>クイック入力</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickTimes.map((quick, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(quick.value().toString())
                    setInputType('unix')
                  }}
                >
                  {quick.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unixタイムスタンプについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Unixタイムスタンプとは</h4>
                <p>
                  1970年1月1日 00:00:00 UTC（Unix元年）からの経過秒数を表す数値です。
                  コンピュータシステムで時刻を表現する標準的な方法として広く使用されています。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>データベースのタイムスタンプ</li>
                  <li>ログファイルの時刻記録</li>
                  <li>APIの認証トークン有効期限</li>
                  <li>キャッシュの有効期限</li>
                  <li>ファイルの作成・更新時刻</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">重要な数値</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>0</strong>: 1970年1月1日 00:00:00 UTC</li>
                  <li><strong>1000000000</strong>: 2001年9月9日（10億秒記念日）</li>
                  <li><strong>1234567890</strong>: 2009年2月13日（よく使われるテスト値）</li>
                  <li><strong>2147483647</strong>: 2038年1月19日（32bit限界、2038年問題）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>10桁は秒単位、13桁はミリ秒単位</li>
                  <li>タイムゾーンの概念はなく、常にUTC基準</li>
                  <li>うるう秒は考慮されていない</li>
                  <li>32bit環境では2038年問題が存在</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}