'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, RotateCcw, ArrowRightLeft, AlertCircle, Info } from 'lucide-react'
import { ToolLayout } from '@/components/layout/tool-layout'

export default function CSVJSONConverterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [jsonFormat, setJsonFormat] = useState<'array' | 'object'>('array')

  // CSV解析関数
  const parseCSV = (csvText: string, delimiter: string, hasHeader: boolean) => {
    try {
      const lines = csvText.trim().split('\n')
      if (lines.length === 0) return []

      const parseRow = (row: string) => {
        const result = []
        let current = ''
        let inQuotes = false
        let i = 0

        while (i < row.length) {
          const char = row[i]
          
          if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
              current += '"'
              i += 2
            } else {
              inQuotes = !inQuotes
              i++
            }
          } else if (char === delimiter && !inQuotes) {
            result.push(current.trim())
            current = ''
            i++
          } else {
            current += char
            i++
          }
        }
        
        result.push(current.trim())
        return result
      }

      const rows = lines.map(parseRow)
      
      if (hasHeader && rows.length > 0) {
        const headers = rows[0]
        const dataRows = rows.slice(1)
        return dataRows.map(row => {
          const obj: Record<string, string> = {}
          headers.forEach((header, index) => {
            obj[header] = row[index] || ''
          })
          return obj
        })
      } else {
        return rows
      }
    } catch (error) {
      throw new Error('CSV解析エラー: ' + (error as Error).message)
    }
  }

  // JSON→CSV変換関数
  const jsonToCSV = (jsonData: any[], delimiter: string, hasHeader: boolean) => {
    try {
      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('JSONは配列形式で、少なくとも1つの要素が必要です')
      }

      const isObjectArray = jsonData.every(item => typeof item === 'object' && !Array.isArray(item))
      
      if (isObjectArray) {
        // オブジェクト配列の場合
        const allKeys = new Set<string>()
        jsonData.forEach(obj => {
          Object.keys(obj).forEach(key => allKeys.add(key))
        })
        const headers = Array.from(allKeys)

        const escapeCSVField = (field: string) => {
          if (field.includes(delimiter) || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`
          }
          return field
        }

        let csvContent = ''
        
        if (hasHeader) {
          csvContent += headers.map(escapeCSVField).join(delimiter) + '\n'
        }

        jsonData.forEach(obj => {
          const row = headers.map(key => {
            const value = obj[key]
            return escapeCSVField(value ? String(value) : '')
          })
          csvContent += row.join(delimiter) + '\n'
        })

        return csvContent.trim()
      } else {
        // 配列の配列の場合
        const escapeCSVField = (field: string) => {
          if (field.includes(delimiter) || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`
          }
          return field
        }

        return jsonData.map(row => {
          if (Array.isArray(row)) {
            return row.map(cell => escapeCSVField(String(cell))).join(delimiter)
          } else {
            return escapeCSVField(String(row))
          }
        }).join('\n')
      }
    } catch (error) {
      throw new Error('CSV変換エラー: ' + (error as Error).message)
    }
  }

  // 変換処理
  const { result, error } = useMemo(() => {
    if (!input.trim()) {
      return { result: '', error: null }
    }

    try {
      if (mode === 'csv-to-json') {
        const parsed = parseCSV(input, delimiter, hasHeader)
        const formatted = jsonFormat === 'array' ? 
          JSON.stringify(parsed, null, 2) :
          JSON.stringify({ data: parsed }, null, 2)
        return { result: formatted, error: null }
      } else {
        const jsonData = JSON.parse(input)
        const csvResult = jsonToCSV(jsonData, delimiter, hasHeader)
        return { result: csvResult, error: null }
      }
    } catch (error) {
      return { result: '', error: (error as Error).message }
    }
  }, [input, mode, delimiter, hasHeader, jsonFormat])

  const handleClear = () => {
    setInput('')
  }

  const handleModeToggle = () => {
    setMode(prev => prev === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')
    setInput('')
  }

  const examples = {
    csv: `名前,年齢,職業
田中太郎,25,エンジニア
佐藤花子,30,デザイナー
鈴木次郎,28,営業`,
    json: `[
  {
    "名前": "田中太郎",
    "年齢": "25",
    "職業": "エンジニア"
  },
  {
    "名前": "佐藤花子",
    "年齢": "30",
    "職業": "デザイナー"
  }
]`
  }

  return (
    <ToolLayout
      title="CSV・JSON変換"
      description="CSVとJSONを相互変換できる無料ツール。データフォーマット変換、API連携、データ分析に最適。"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>CSV・JSON変換ツール</span>
                </CardTitle>
                <CardDescription>
                  CSVとJSONを相互変換します。データのインポート・エクスポートに便利です。
                </CardDescription>
              </div>
              <Button
                onClick={handleModeToggle}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>変換方向切替</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* モード表示 */}
            <div className="flex items-center space-x-4">
              <Badge variant={mode === 'csv-to-json' ? 'default' : 'secondary'}>
                {mode === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'}
              </Badge>
            </div>

            {/* 設定オプション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">区切り文字</label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">カンマ (,)</SelectItem>
                    <SelectItem value=";">セミコロン (;)</SelectItem>
                    <SelectItem value="\t">タブ</SelectItem>
                    <SelectItem value="|">パイプ (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ヘッダー行</label>
                <Select value={hasHeader.toString()} onValueChange={(value) => setHasHeader(value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">あり</SelectItem>
                    <SelectItem value="false">なし</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {mode === 'csv-to-json' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">JSON形式</label>
                  <Select value={jsonFormat} onValueChange={(value) => setJsonFormat(value as 'array' | 'object')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="array">配列</SelectItem>
                      <SelectItem value="object">オブジェクト</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* 入力エリア */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === 'csv-to-json' ? 'CSV入力' : 'JSON入力'}
                </label>
                <div className="space-x-2">
                  <Button
                    onClick={() => setInput(mode === 'csv-to-json' ? examples.csv : examples.json)}
                    variant="outline"
                    size="sm"
                  >
                    サンプル
                  </Button>
                  <Button onClick={handleClear} variant="outline" size="sm">
                    クリア
                  </Button>
                </div>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'csv-to-json' ? 
                  'CSVデータを入力してください...\n例:\n名前,年齢,職業\n田中太郎,25,エンジニア' :
                  'JSONデータを入力してください...\n例:\n[{"名前": "田中太郎", "年齢": 25}]'
                }
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="flex items-center space-x-2 p-3 text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 結果表示 */}
            {result && !error && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {mode === 'csv-to-json' ? 'JSON出力' : 'CSV出力'}
                  </label>
                  <Button
                    onClick={() => navigator.clipboard.writeText(result)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>コピー</span>
                  </Button>
                </div>
                <Textarea
                  value={result}
                  readOnly
                  rows={8}
                  className="font-mono text-sm bg-gray-50"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 使用方法 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>使用方法とコツ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">CSV → JSON変換</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 1行目をヘッダーとして使用可能</li>
                  <li>• カンマ、セミコロン、タブ区切りに対応</li>
                  <li>• ダブルクォートでの値の囲い込みに対応</li>
                  <li>• 配列形式またはオブジェクト形式で出力</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">JSON → CSV変換</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• オブジェクト配列形式のJSONに対応</li>
                  <li>• 配列の配列形式のJSONに対応</li>
                  <li>• 自動的にCSVエスケープ処理を実行</li>
                  <li>• ヘッダー行の有無を選択可能</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-3">
              <h4 className="font-semibold">対応フォーマット例</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">CSV例</p>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{examples.csv}</pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">JSON例</p>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{examples.json}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}