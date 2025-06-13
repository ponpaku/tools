'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function JSONFormatterPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'format' | 'minify'>('format')
  const [indentSize, setIndentSize] = useState('2')
  const [error, setError] = useState('')

  const processJSON = () => {
    setError('')
    
    if (!inputText.trim()) {
      setOutputText('')
      return
    }

    try {
      const parsed = JSON.parse(inputText)
      
      if (mode === 'format') {
        const formatted = JSON.stringify(parsed, null, parseInt(indentSize))
        setOutputText(formatted)
      } else {
        const minified = JSON.stringify(parsed)
        setOutputText(minified)
      }
    } catch (err) {
      setError(`JSONパースエラー: ${(err as Error).message}`)
      setOutputText('')
    }
  }

  const validateJSON = () => {
    if (!inputText.trim()) {
      setError('JSONを入力してください')
      return
    }

    try {
      JSON.parse(inputText)
      setError('')
      alert('有効なJSONです')
    } catch (err) {
      setError(`JSONパースエラー: ${(err as Error).message}`)
    }
  }

  const getJSONStats = () => {
    if (!outputText) return null

    try {
      const parsed = JSON.parse(outputText)
      
      const countItems = (obj: any): { objects: number, arrays: number, properties: number } => {
        let objects = 0
        let arrays = 0
        let properties = 0

        if (Array.isArray(obj)) {
          arrays++
          obj.forEach(item => {
            const counts = countItems(item)
            objects += counts.objects
            arrays += counts.arrays
            properties += counts.properties
          })
        } else if (obj !== null && typeof obj === 'object') {
          objects++
          Object.keys(obj).forEach(key => {
            properties++
            const counts = countItems(obj[key])
            objects += counts.objects
            arrays += counts.arrays
            properties += counts.properties
          })
        }

        return { objects, arrays, properties }
      }

      return countItems(parsed)
    } catch {
      return null
    }
  }

  const stats = getJSONStats()

  const examples = [
    {
      name: '基本的なオブジェクト',
      json: '{"name":"田中太郎","age":30,"city":"東京"}'
    },
    {
      name: '配列を含むオブジェクト',
      json: '{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2}'
    },
    {
      name: 'ネストしたオブジェクト',
      json: '{"user":{"profile":{"name":"山田花子","contact":{"email":"hanako@example.com","phone":"090-1234-5678"}},"settings":{"theme":"dark","notifications":true}}}'
    }
  ]

  return (
    <ToolLayout
      title="JSONフォーマッター"
      description="JSONの整形・縮小・検証を行います"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">処理モード</label>
            <Select value={mode} onValueChange={(value: 'format' | 'minify') => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="format">整形（フォーマット）</SelectItem>
                <SelectItem value="minify">縮小（ミニファイ）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {mode === 'format' && (
            <div>
              <label className="block text-sm font-medium mb-2">インデントサイズ</label>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2スペース</SelectItem>
                  <SelectItem value="4">4スペース</SelectItem>
                  <SelectItem value="8">8スペース</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">JSONテキスト</label>
          <Textarea
            placeholder="JSONテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={processJSON} className="flex-1" disabled={!inputText.trim()}>
            {mode === 'format' ? '整形実行' : '縮小実行'}
          </Button>
          <Button onClick={validateJSON} variant="outline" disabled={!inputText.trim()}>
            JSON検証
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {outputText && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{mode === 'format' ? '整形結果' : '縮小結果'}</CardTitle>
                <CopyButton text={outputText} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[200px] bg-gray-50 font-mono text-sm"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>入力: {inputText.length.toLocaleString()}文字</span>
                <span>出力: {outputText.length.toLocaleString()}文字</span>
                <span>
                  {mode === 'format' 
                    ? `+${(outputText.length - inputText.length).toLocaleString()}文字`
                    : `${(inputText.length - outputText.length).toLocaleString()}文字削減`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>JSON統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{stats.objects}</p>
                  <p className="text-sm text-blue-600">オブジェクト</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{stats.arrays}</p>
                  <p className="text-sm text-green-600">配列</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{stats.properties}</p>
                  <p className="text-sm text-purple-600">プロパティ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>サンプルJSON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{example.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputText(example.json)}
                    >
                      使用
                    </Button>
                  </div>
                  <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                    <code>{example.json}</code>
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">整形（フォーマット）</h4>
                <p>
                  縮小されたJSONを読みやすい形式に整形します。
                  開発時のデバッグやAPIレスポンスの確認に便利です。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">縮小（ミニファイ）</h4>
                <p>
                  不要な空白や改行を削除してJSONのサイズを最小化します。
                  本番環境でのデータ送信やストレージ節約に使用します。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">JSON検証</h4>
                <p>
                  入力されたテキストが有効なJSON形式かどうかを確認します。
                  エラーがある場合は詳細なエラーメッセージを表示します。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}