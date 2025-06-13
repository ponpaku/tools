'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function LineRemoverPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'all' | 'empty' | 'whitespace' | 'duplicate' | 'trim'>('all')

  const processText = () => {
    if (!inputText) return

    let result = inputText
    const lines = result.split('\n')

    switch (mode) {
      case 'all':
        // すべての改行を削除
        result = lines.join('')
        break
      
      case 'empty':
        // 空行のみ削除
        result = lines.filter(line => line !== '').join('\n')
        break
      
      case 'whitespace':
        // 空白のみの行を削除
        result = lines.filter(line => line.trim() !== '').join('\n')
        break
      
      case 'duplicate':
        // 重複行を削除
        const uniqueLines: string[] = []
        const seen = new Set<string>()
        
        lines.forEach(line => {
          if (!seen.has(line)) {
            seen.add(line)
            uniqueLines.push(line)
          }
        })
        
        result = uniqueLines.join('\n')
        break
      
      case 'trim':
        // 各行の前後の空白を削除
        result = lines.map(line => line.trim()).join('\n')
        break
    }

    setOutputText(result)
  }

  const getStats = () => {
    const inputLines = inputText.split('\n')
    const outputLines = outputText.split('\n')
    
    return {
      inputLines: inputLines.length,
      outputLines: outputLines.length,
      removedLines: inputLines.length - outputLines.length,
      inputChars: inputText.length,
      outputChars: outputText.length,
      removedChars: inputText.length - outputText.length
    }
  }

  const stats = outputText ? getStats() : null

  const modes = [
    { value: 'all', label: 'すべての改行を削除', description: '改行文字をすべて削除して1行にします' },
    { value: 'empty', label: '空行を削除', description: '何も入力されていない行を削除します' },
    { value: 'whitespace', label: '空白行を削除', description: '空白文字のみの行を削除します' },
    { value: 'duplicate', label: '重複行を削除', description: '同じ内容の行を削除します' },
    { value: 'trim', label: '行の前後空白を削除', description: '各行の先頭と末尾の空白を削除します' }
  ]

  return (
    <ToolLayout
      title="改行削除ツール"
      description="改行や空白行を削除してテキストを整形します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">処理モード</label>
          <Select value={mode} onValueChange={(value: any) => setMode(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modes.map(modeOption => (
                <SelectItem key={modeOption.value} value={modeOption.value}>
                  {modeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600 mt-1">
            {modes.find(m => m.value === mode)?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <Textarea
            placeholder="処理したいテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] font-mono"
          />
        </div>

        <Button onClick={processText} className="w-full" disabled={!inputText}>
          処理実行
        </Button>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>処理統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{stats.inputLines}</p>
                  <p className="text-sm text-blue-600">入力行数</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{stats.outputLines}</p>
                  <p className="text-sm text-green-600">出力行数</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{stats.removedLines}</p>
                  <p className="text-sm text-red-600">削除行数</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{stats.inputChars.toLocaleString()}</p>
                  <p className="text-sm text-purple-600">入力文字数</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">{stats.outputChars.toLocaleString()}</p>
                  <p className="text-sm text-orange-600">出力文字数</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">{stats.removedChars.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">削除文字数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {outputText && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>処理結果</CardTitle>
                <CopyButton text={outputText} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[200px] bg-gray-50 font-mono"
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>処理モードの詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              {modes.map(modeOption => (
                <div key={modeOption.value}>
                  <h4 className="font-semibold">{modeOption.label}</h4>
                  <p className="text-gray-600">{modeOption.description}</p>
                </div>
              ))}
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">使用例</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p><strong>すべての改行を削除</strong>: 長い文章を1行にまとめたい場合</p>
                  <p><strong>空行を削除</strong>: 不要な空行を取り除いてコンパクトにしたい場合</p>
                  <p><strong>重複行を削除</strong>: リストから重複項目を除去したい場合</p>
                  <p><strong>行の前後空白を削除</strong>: インデントやコピペ時の余分な空白を削除したい場合</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}