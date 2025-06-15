'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Base64Tool() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')

  const processText = () => {
    setError('')
    
    if (!inputText.trim()) {
      setOutputText('')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)))
        setOutputText(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText)))
        setOutputText(decoded)
      }
    } catch (err) {
      setError('エラー: 入力データが正しいBase64形式ではありません')
      setOutputText('')
    }
  }

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInputText(outputText)
    setOutputText(inputText)
    setError('')
  }

  return (
    <ToolLayout
      title="Base64エンコーダーデコーダ"
      description="Base64形式のエンコード・デコードを行います"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Select value={mode} onValueChange={(value: 'encode' | 'decode') => setMode(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="encode">エンコード</SelectItem>
              <SelectItem value="decode">デコード</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={swapMode} disabled={!inputText && !outputText}>
            入出力を入れ替え
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'encode' ? '元のテキスト' : 'Base64エンコードされたテキスト'}
          </label>
          <Textarea
            placeholder={mode === 'encode' ? 'エンコードしたいテキストを入力...' : 'デコードしたいBase64テキストを入力...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px] font-mono"
          />
        </div>

        <Button onClick={processText} className="w-full" disabled={!inputText.trim()}>
          {mode === 'encode' ? 'エンコード実行' : 'デコード実行'}
        </Button>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {outputText && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {mode === 'encode' ? 'Base64エンコード結果' : 'デコード結果'}
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
            <CardTitle>Base64について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">Base64エンコーディング</h4>
                <p>
                  Base64は、バイナリデータを64種類の文字（A-Z、a-z、0-9、+、/）で表現する方式です。
                  メールやWebでバイナリデータを安全に送信するために使われます。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>画像ファイルをHTMLに埋め込む（Data URI）</li>
                  <li>メール添付ファイルの送信</li>
                  <li>API認証のトークン</li>
                  <li>設定ファイルでのバイナリデータ保存</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">変換例</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p><span className="text-blue-600">Hello World</span></p>
                  <p>↓ Base64エンコード</p>
                  <p><span className="font-mono">SGVsbG8gV29ybGQ=</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Base64エンコードすると、元のデータサイズの約1.33倍になります</li>
                  <li>日本語などのマルチバイト文字も正しく処理されます</li>
                  <li>無効なBase64データをデコードするとエラーが表示されます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                このBase64エンコード・デコードツールは<strong>エン・ＰＣサービス</strong>や<strong>トメイト</strong>、<strong>RAKKOTOOLS</strong>の代替として使える高機能ツールです。
              </p>
              <div>
                <h4 className="font-semibold mb-2">主な特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>高速・正確なBase64エンコード・デコード処理</li>
                  <li>日本語（UTF-8）完全対応</li>
                  <li>入出力の文字数表示・比較機能</li>
                  <li>エラーハンドリング・検証機能</li>
                  <li>完全無料・登録不要・オフライン対応</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Web開発でのData URI作成</li>
                  <li>API認証トークンの処理</li>
                  <li>メール添付ファイルのエンコード</li>
                  <li>設定ファイルでのバイナリデータ格納</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}