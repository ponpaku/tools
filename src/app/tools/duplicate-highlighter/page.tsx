'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DuplicateInfo {
  line: string
  originalIndex: number
  count: number
  isDuplicate: boolean
}

export default function DuplicateHighlighterPage() {
  const [inputText, setInputText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false)

  const processedLines = useMemo(() => {
    if (!inputText) return []

    let lines = inputText.split('\n')
    
    // 空行を除去する場合
    if (removeEmptyLines) {
      lines = lines.filter(line => line.trim() !== '')
    }

    const processedLines: DuplicateInfo[] = []
    const lineCount = new Map<string, number>()
    
    // 各行を処理して重複をカウント
    lines.forEach((line, index) => {
      let processedLine = line
      
      // 前後の空白を削除する場合
      if (trimWhitespace) {
        processedLine = line.trim()
      }
      
      // 大文字小文字を区別しない場合
      const keyLine = caseSensitive ? processedLine : processedLine.toLowerCase()
      
      const currentCount = lineCount.get(keyLine) || 0
      lineCount.set(keyLine, currentCount + 1)
    })
    
    // 結果を生成
    lines.forEach((line, index) => {
      let processedLine = line
      
      if (trimWhitespace) {
        processedLine = line.trim()
      }
      
      const keyLine = caseSensitive ? processedLine : processedLine.toLowerCase()
      const count = lineCount.get(keyLine) || 1
      
      processedLines.push({
        line,
        originalIndex: index + 1,
        count,
        isDuplicate: count > 1
      })
    })
    
    return processedLines
  }, [inputText, caseSensitive, trimWhitespace, removeEmptyLines])

  const stats = useMemo(() => {
    const totalLines = processedLines.length
    const duplicateLines = processedLines.filter(item => item.isDuplicate).length
    const uniqueLines = new Set(
      processedLines.map(item => {
        let line = trimWhitespace ? item.line.trim() : item.line
        return caseSensitive ? line : line.toLowerCase()
      })
    ).size
    
    return {
      totalLines,
      duplicateLines,
      uniqueLines,
      duplicatePercentage: totalLines > 0 ? Math.round((duplicateLines / totalLines) * 100) : 0
    }
  }, [processedLines, caseSensitive, trimWhitespace])

  const getUniqueLines = () => {
    const uniqueSet = new Set<string>()
    const uniqueLines: string[] = []
    
    processedLines.forEach(item => {
      let line = trimWhitespace ? item.line.trim() : item.line
      const keyLine = caseSensitive ? line : line.toLowerCase()
      
      if (!uniqueSet.has(keyLine)) {
        uniqueSet.add(keyLine)
        uniqueLines.push(item.line)
      }
    })
    
    return uniqueLines
  }

  const getDuplicateLines = () => {
    return processedLines.filter(item => item.isDuplicate)
  }

  const uniqueLines = getUniqueLines()
  const duplicateLines = getDuplicateLines()

  const copyUniqueLines = () => {
    navigator.clipboard.writeText(uniqueLines.join('\n'))
  }

  const copyDuplicateLines = () => {
    const duplicates = duplicateLines.map(item => `${item.line} (${item.count}回)`).join('\n')
    navigator.clipboard.writeText(duplicates)
  }

  return (
    <ToolLayout
      title="重複行ハイライトツール"
      description="重複した行をハイライト表示し、統計情報を提供します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">大文字小文字の区別</label>
            <Select value={caseSensitive ? 'true' : 'false'} onValueChange={(value) => setCaseSensitive(value === 'true')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">区別する</SelectItem>
                <SelectItem value="false">区別しない</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">前後の空白</label>
            <Select value={trimWhitespace ? 'true' : 'false'} onValueChange={(value) => setTrimWhitespace(value === 'true')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">無視する</SelectItem>
                <SelectItem value="false">考慮する</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">空行の処理</label>
            <Select value={removeEmptyLines ? 'true' : 'false'} onValueChange={(value) => setRemoveEmptyLines(value === 'true')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">保持する</SelectItem>
                <SelectItem value="true">除去する</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">テキスト入力</label>
          <Textarea
            placeholder="重複をチェックしたいテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] font-mono"
          />
        </div>

        {stats.totalLines > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{stats.totalLines}</p>
                  <p className="text-sm text-blue-600">総行数</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{stats.uniqueLines}</p>
                  <p className="text-sm text-green-600">ユニーク行数</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{stats.duplicateLines}</p>
                  <p className="text-sm text-red-600">重複行数</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{stats.duplicatePercentage}%</p>
                  <p className="text-sm text-purple-600">重複率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {processedLines.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>重複ハイライト結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {processedLines.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center mb-1 p-2 rounded text-sm font-mono ${
                      item.isDuplicate 
                        ? 'bg-red-100 border-l-4 border-red-500' 
                        : 'bg-transparent'
                    }`}
                  >
                    <span className="w-12 text-gray-500 text-xs mr-2 flex-shrink-0">
                      {item.originalIndex}:
                    </span>
                    <span className="flex-1 break-all">
                      {item.line || '(空行)'}
                    </span>
                    {item.isDuplicate && (
                      <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex-shrink-0">
                        {item.count}回
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {uniqueLines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>ユニーク行のみ</CardTitle>
                  <Button variant="outline" size="sm" onClick={copyUniqueLines}>
                    コピー
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={uniqueLines.join('\n')}
                  readOnly
                  className="min-h-[150px] bg-gray-50 font-mono text-sm"
                />
              </CardContent>
            </Card>

            {duplicateLines.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>重複行のみ</CardTitle>
                    <Button variant="outline" size="sm" onClick={copyDuplicateLines}>
                      コピー
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded max-h-[150px] overflow-y-auto">
                    {duplicateLines.map((item, index) => (
                      <div key={index} className="text-sm font-mono mb-1">
                        <span className="text-gray-500">{item.originalIndex}:</span>{' '}
                        {item.line} <span className="text-red-600">({item.count}回)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">設定オプション</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>大文字小文字の区別</strong>: 「Hello」と「hello」を別行として扱うかどうか</li>
                  <li><strong>前後の空白</strong>: 行の先頭・末尾の空白文字を無視するかどうか</li>
                  <li><strong>空行の処理</strong>: 何も入力されていない行を除外するかどうか</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">活用例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>メールアドレスリストの重複チェック</li>
                  <li>データベースのデータクレンジング</li>
                  <li>ログファイルの重複エントリ検出</li>
                  <li>コードの重複行発見</li>
                  <li>リストの整理・統合</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">結果の見方</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>赤色でハイライトされた行が重複行です</li>
                  <li>右端の数字は重複回数を示します</li>
                  <li>「ユニーク行のみ」で重複を除いた結果を取得できます</li>
                  <li>統計情報で全体の重複状況を把握できます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}