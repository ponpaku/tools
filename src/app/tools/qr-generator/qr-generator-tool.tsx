'use client'

import { useState, useRef } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function QRGeneratorTool() {
  const [inputText, setInputText] = useState('')
  const [qrDataURL, setQrDataURL] = useState('')
  const [size, setSize] = useState('256')
  const [errorLevel, setErrorLevel] = useState('M')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    if (!inputText.trim()) {
      setError('テキストを入力してください')
      return
    }

    setIsGenerating(true)
    setError('')
    setQrDataURL('')

    try {
      console.log('QRコード生成開始:', inputText)
      
      // QRコード生成ライブラリを動的にインポート
      const QRCode = (await import('qrcode')).default
      console.log('QRCodeライブラリ読み込み完了')
      
      const options = {
        width: parseInt(size),
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H'
      }

      console.log('QRコード生成オプション:', options)

      // Canvas要素の確認
      if (!canvasRef.current) {
        throw new Error('Canvas要素が見つかりません')
      }

      console.log('Canvas要素確認完了')

      // Canvas に描画
      await QRCode.toCanvas(canvasRef.current, inputText, options)
      console.log('Canvas描画完了')
      
      // Data URL を取得
      const dataURL = canvasRef.current.toDataURL('image/png')
      setQrDataURL(dataURL)
      console.log('QRコード生成完了')
    } catch (error) {
      console.error('QRコード生成エラー:', error)
      const errorMessage = error instanceof Error ? error.message : 'QRコード生成中にエラーが発生しました'
      setError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQR = () => {
    if (!qrDataURL) return

    const link = document.createElement('a')
    link.href = qrDataURL
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    if (!qrDataURL) return

    try {
      const response = await fetch(qrDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('QRコードをクリップボードにコピーしました')
    } catch (error) {
      console.error('コピーエラー:', error)
      alert('クリップボードへのコピーに失敗しました')
    }
  }

  const presets = [
    { name: 'URL', example: 'https://example.com' },
    { name: 'メール', example: 'mailto:someone@example.com' },
    { name: '電話', example: 'tel:+81-90-1234-5678' },
    { name: 'SMS', example: 'sms:+81-90-1234-5678' },
    { name: 'WiFi', example: 'WIFI:T:WPA;S:NetworkName;P:password;;' },
    { name: 'テキスト', example: 'こんにちは、世界！' }
  ]

  return (
    <ToolLayout
      title="QRコード生成"
      description="テキストからQRコードを生成します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">テキスト入力</label>
          <Textarea
            placeholder="QRコードにしたいテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">サイズ</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128px</SelectItem>
                <SelectItem value="256">256px</SelectItem>
                <SelectItem value="512">512px</SelectItem>
                <SelectItem value="1024">1024px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">エラー訂正レベル</label>
            <Select value={errorLevel} onValueChange={setErrorLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">L（低）</SelectItem>
                <SelectItem value="M">M（中）</SelectItem>
                <SelectItem value="Q">Q（高）</SelectItem>
                <SelectItem value="H">H（最高）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">前景色</label>
            <Input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">背景色</label>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={generateQR} className="w-full" disabled={!inputText.trim() || isGenerating}>
          {isGenerating ? 'QRコード生成中...' : 'QRコード生成'}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>エラー:</strong> {error}
          </div>
        )}

        {/* Canvas要素は常にDOMに存在させる（非表示） */}
        <canvas ref={canvasRef} className="hidden" />

        {qrDataURL && (
          <Card>
            <CardHeader>
              <CardTitle>生成されたQRコード</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
                <img src={qrDataURL} alt="Generated QR Code" className="border" />
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={downloadQR} variant="outline">
                  ダウンロード
                </Button>
                <Button onClick={copyToClipboard} variant="outline">
                  クリップボードにコピー
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                サイズ: {size}px × {size}px | エラー訂正: {errorLevel}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>プリセット例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{preset.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputText(preset.example)}
                    >
                      使用
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {preset.example}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QRコードについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">エラー訂正レベル</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>L（低）</strong>: 約7%のエラーを訂正可能</li>
                  <li><strong>M（中）</strong>: 約15%のエラーを訂正可能（推奨）</li>
                  <li><strong>Q（高）</strong>: 約25%のエラーを訂正可能</li>
                  <li><strong>H（最高）</strong>: 約30%のエラーを訂正可能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">特殊フォーマット</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>WiFi</strong>: WIFI:T:WPA;S:ネットワーク名;P:パスワード;;</li>
                  <li><strong>メール</strong>: mailto:アドレス?subject=件名&amp;body=本文</li>
                  <li><strong>電話</strong>: tel:電話番号</li>
                  <li><strong>SMS</strong>: sms:電話番号?body=メッセージ</li>
                  <li><strong>位置情報</strong>: geo:緯度,経度</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用上の注意</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>データ量が多いほどQRコードが複雑になり、読み取りが困難になります</li>
                  <li>印刷時は十分なコントラストを保ってください</li>
                  <li>エラー訂正レベルが高いほど、汚れや破損に強くなります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}