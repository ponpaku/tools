'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function URLEncoderTool() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [encodingType, setEncodingType] = useState<'standard' | 'component'>('component')

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText('')
      return
    }

    try {
      if (mode === 'encode') {
        if (encodingType === 'component') {
          setOutputText(encodeURIComponent(inputText))
        } else {
          setOutputText(encodeURI(inputText))
        }
      } else {
        if (encodingType === 'component') {
          setOutputText(decodeURIComponent(inputText))
        } else {
          setOutputText(decodeURI(inputText))
        }
      }
    } catch (err) {
      setOutputText('エラー: 正しいURL形式ではありません')
    }
  }

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInputText(outputText)
    setOutputText(inputText)
  }

  const examples = [
    {
      original: 'Hello World!',
      encoded: 'Hello%20World%21',
      description: '基本的な英数字と記号'
    },
    {
      original: 'こんにちは世界',
      encoded: '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%E4%B8%96%E7%95%8C',
      description: '日本語（UTF-8）'
    },
    {
      original: 'key=value&name=田中',
      encoded: 'key%3Dvalue%26name%3D%E7%94%B0%E4%B8%AD',
      description: 'クエリパラメータ'
    }
  ]

  return (
    <ToolLayout
      title="URLエンコーダデコーダ"
      description="URLエンコード・デコードを行います"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">処理モード</label>
            <Select value={mode} onValueChange={(value: 'encode' | 'decode') => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="encode">エンコード</SelectItem>
                <SelectItem value="decode">デコード</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">エンコードタイプ</label>
            <Select value={encodingType} onValueChange={(value: 'standard' | 'component') => setEncodingType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="component">Component（推奨）</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={swapMode} disabled={!inputText && !outputText}>
            入出力を入れ替え
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'encode' ? '元のテキスト・URL' : 'URLエンコードされたテキスト'}
          </label>
          <Textarea
            placeholder={mode === 'encode' ? 'エンコードしたいテキストやURLを入力...' : 'デコードしたいURLエンコードテキストを入力...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] font-mono"
          />
        </div>

        <Button onClick={processText} className="w-full" disabled={!inputText.trim()}>
          {mode === 'encode' ? 'エンコード実行' : 'デコード実行'}
        </Button>

        {outputText && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {mode === 'encode' ? 'URLエンコード結果' : 'デコード結果'}
                </CardTitle>
                <CopyButton text={outputText} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[120px] bg-gray-50 font-mono"
              />
              <div className="mt-2 text-sm text-gray-600">
                入力: {inputText.length}文字 → 出力: {outputText.length}文字
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm text-gray-700 mb-2">{example.description}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">元:</span>
                      <span className="ml-2 font-mono bg-blue-50 px-2 py-1 rounded">{example.original}</span>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">エンコード:</span>
                      <span className="ml-2 font-mono bg-green-50 px-2 py-1 rounded break-all">{example.encoded}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URLエンコーディングについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">URLエンコーディング</h4>
                <p>
                  URLで使用できない文字（日本語、スペース、記号など）を%と16進数の組み合わせで表現する方式です。
                  WebブラウザとWebサーバー間でデータを正しく送受信するために必要です。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">エンコードタイプの違い</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Component</strong>: より多くの文字をエンコード（クエリパラメータ等に適用）</li>
                  <li><strong>Standard</strong>: URLとして有効な文字は保持（完全なURL全体に適用）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>フォームデータの送信</li>
                  <li>APIのクエリパラメータ</li>
                  <li>ファイル名やディレクトリ名にスペースや日本語が含まれる場合</li>
                  <li>検索エンジンのクエリ文字列</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>既にエンコード済みのデータを再度エンコードしないよう注意</li>
                  <li>URLの各部分（パス、クエリパラメータ等）で適切なエンコード方式を選択</li>
                  <li>日本語などのマルチバイト文字はUTF-8でエンコードされます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}