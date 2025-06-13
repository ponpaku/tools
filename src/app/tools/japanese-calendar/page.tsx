'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Era {
  name: string
  start: Date
  end: Date | null
}

export default function JapaneseCalendarPage() {
  const [mode, setMode] = useState<'toJapanese' | 'toWestern'>('toJapanese')
  const [westernYear, setWesternYear] = useState('')
  const [era, setEra] = useState('')
  const [japaneseYear, setJapaneseYear] = useState('')
  const [result, setResult] = useState('')

  const eras: Era[] = [
    { name: '令和', start: new Date(2019, 4, 1), end: null },
    { name: '平成', start: new Date(1989, 0, 8), end: new Date(2019, 3, 30) },
    { name: '昭和', start: new Date(1926, 11, 25), end: new Date(1989, 0, 7) },
    { name: '大正', start: new Date(1912, 6, 30), end: new Date(1926, 11, 24) },
    { name: '明治', start: new Date(1868, 9, 23), end: new Date(1912, 6, 29) }
  ]

  const getEraByYear = (year: number): Era | null => {
    for (const era of eras) {
      const startYear = era.start.getFullYear()
      const endYear = era.end ? era.end.getFullYear() : new Date().getFullYear()
      
      if (year >= startYear && year <= endYear) {
        return era
      }
    }
    return null
  }

  const convertToJapanese = () => {
    const year = parseInt(westernYear)
    if (isNaN(year)) {
      setResult('有効な西暦年を入力してください')
      return
    }

    const targetEra = getEraByYear(year)
    if (!targetEra) {
      setResult('対応する元号が見つかりません')
      return
    }

    const eraYear = year - targetEra.start.getFullYear() + 1
    let japaneseDisplay = ''
    
    if (eraYear === 1) {
      japaneseDisplay = `${targetEra.name}元年`
    } else {
      japaneseDisplay = `${targetEra.name}${eraYear}年`
    }

    setResult(`西暦${year}年 = ${japaneseDisplay}`)
  }

  const convertToWestern = () => {
    const selectedEra = eras.find(e => e.name === era)
    const year = parseInt(japaneseYear)
    
    if (!selectedEra) {
      setResult('元号を選択してください')
      return
    }
    
    if (isNaN(year) || year < 1) {
      setResult('有効な和暦年を入力してください')
      return
    }

    const westernYearResult = selectedEra.start.getFullYear() + year - 1
    
    // 元号の範囲チェック
    if (selectedEra.end && westernYearResult > selectedEra.end.getFullYear()) {
      setResult(`${selectedEra.name}${year}年は存在しません（${selectedEra.name}は${selectedEra.end.getFullYear()}年まで）`)
      return
    }

    const currentYear = new Date().getFullYear()
    if (westernYearResult > currentYear) {
      setResult(`${selectedEra.name}${year}年はまだ到来していません`)
      return
    }

    let japaneseDisplay = ''
    if (year === 1) {
      japaneseDisplay = `${selectedEra.name}元年`
    } else {
      japaneseDisplay = `${selectedEra.name}${year}年`
    }

    setResult(`${japaneseDisplay} = 西暦${westernYearResult}年`)
  }

  const convert = () => {
    if (mode === 'toJapanese') {
      convertToJapanese()
    } else {
      convertToWestern()
    }
  }

  const currentYear = new Date().getFullYear()
  const currentEra = getEraByYear(currentYear)
  const currentEraYear = currentEra ? currentYear - currentEra.start.getFullYear() + 1 : 0

  const examples = [
    { western: 2024, japanese: '令和6年' },
    { western: 2019, japanese: '令和元年' },
    { western: 2018, japanese: '平成30年' },
    { western: 1989, japanese: '平成元年' },
    { western: 1988, japanese: '昭和63年' },
    { western: 1926, japanese: '昭和元年' }
  ]

  return (
    <ToolLayout
      title="和暦西暦変換"
      description="和暦と西暦の相互変換を行います"
    >
      <div className="space-y-6">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">現在の年</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-700">
                西暦{currentYear}年
              </p>
              {currentEra && (
                <p className="text-xl text-blue-600 mt-2">
                  {currentEraYear === 1 ? `${currentEra.name}元年` : `${currentEra.name}${currentEraYear}年`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <label className="block text-sm font-medium mb-2">変換方向</label>
          <Select value={mode} onValueChange={(value: any) => setMode(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toJapanese">西暦 → 和暦</SelectItem>
              <SelectItem value="toWestern">和暦 → 西暦</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === 'toJapanese' ? (
          <div>
            <label className="block text-sm font-medium mb-2">西暦年</label>
            <Input
              type="number"
              value={westernYear}
              onChange={(e) => setWesternYear(e.target.value)}
              placeholder="例: 2024"
              min="1868"
              max={currentYear.toString()}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">元号</label>
              <Select value={era} onValueChange={setEra}>
                <SelectTrigger>
                  <SelectValue placeholder="元号を選択" />
                </SelectTrigger>
                <SelectContent>
                  {eras.map(eraItem => (
                    <SelectItem key={eraItem.name} value={eraItem.name}>
                      {eraItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">和暦年</label>
              <Input
                type="number"
                value={japaneseYear}
                onChange={(e) => setJapaneseYear(e.target.value)}
                placeholder="例: 6"
                min="1"
              />
            </div>
          </div>
        )}

        <Button onClick={convert} className="w-full">
          変換実行
        </Button>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                <CopyButton text={result} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-mono bg-gray-50 p-4 rounded-lg">
                {result}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>元号一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eras.map((eraItem, index) => {
                const startYear = eraItem.start.getFullYear()
                const endYear = eraItem.end ? eraItem.end.getFullYear() : '現在'
                const duration = eraItem.end 
                  ? eraItem.end.getFullYear() - startYear + 1
                  : currentYear - startYear + 1
                
                return (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-lg">{eraItem.name}</h4>
                      <p className="text-sm text-gray-600">
                        {startYear}年 - {endYear} ({duration}年間)
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEra(eraItem.name)
                        setMode('toWestern')
                      }}
                    >
                      使用
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.map((example, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-center">
                    <p className="font-mono text-blue-700">西暦{example.western}年</p>
                    <p className="text-gray-500">↕</p>
                    <p className="font-bold text-green-700">{example.japanese}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setWesternYear(example.western.toString())
                        setMode('toJapanese')
                      }}
                    >
                      西暦で使用
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>和暦について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">元号制度</h4>
                <p>
                  日本の元号制度は、中国から伝来した年号制度を基にしており、
                  天皇の即位や重要な出来事に合わせて改元が行われてきました。
                  現在は一世一元の制が採用されています。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">近代の元号</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>明治</strong> (1868-1912): 明治維新から大正天皇即位まで</li>
                  <li><strong>大正</strong> (1912-1926): 大正天皇の治世</li>
                  <li><strong>昭和</strong> (1926-1989): 昭和天皇の治世、戦前戦後を通じて</li>
                  <li><strong>平成</strong> (1989-2019): 上皇陛下の治世</li>
                  <li><strong>令和</strong> (2019-現在): 現在の天皇陛下の治世</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>公的文書や行政手続き</li>
                  <li>学校や会社の入学・入社年</li>
                  <li>免許証や各種証明書</li>
                  <li>日本の歴史や文化的文脈</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">変換の注意点</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>元年は1年目を表します（例：令和元年 = 令和1年）</li>
                  <li>改元日は年の途中で変わることがあります</li>
                  <li>このツールは年単位での変換を行います</li>
                  <li>明治以前の元号は含まれていません</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}