'use client'

import { useState, useRef } from 'react'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OutputFormat = 'png' | 'jpeg' | 'webp'
type InputMethod = 'file' | 'text'

export default function SvgToImageTool() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('file')
  const [svgContent, setSvgContent] = useState('')
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png')
  const [width, setWidth] = useState('800')
  const [height, setHeight] = useState('600')
  const [quality, setQuality] = useState('0.9')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [transparent, setTransparent] = useState(true)
  const [isConverting, setIsConverting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('svg')) {
      setError('SVGファイルを選択してください')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgContent(content)
      setError('')
    }
    reader.readAsText(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return

    if (!file.type.includes('svg')) {
      setError('SVGファイルを選択してください')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setSvgContent(content)
      setError('')
    }
    reader.readAsText(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const validateSvg = (svgText: string): boolean => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgText, 'image/svg+xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        throw new Error('SVG構文エラー')
      }
      return true
    } catch (err) {
      setError(`SVG検証エラー: ${(err as Error).message}`)
      return false
    }
  }

  const convertSvgToImage = async () => {
    if (!svgContent.trim()) {
      setError('SVGコンテンツを入力してください')
      return
    }

    if (!validateSvg(svgContent)) {
      return
    }

    setIsConverting(true)
    setError('')

    try {
      // SVGをData URLに変換
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Imageオブジェクトを作成してSVGを読み込み
      const img = new Image()
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = svgUrl
      })

      // Canvas上に描画
      const canvas = canvasRef.current
      if (!canvas) throw new Error('Canvas要素が見つかりません')
      
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context取得エラー')

      const outputWidth = parseInt(width)
      const outputHeight = parseInt(height)
      
      canvas.width = outputWidth
      canvas.height = outputHeight

      // 背景色設定
      if (!transparent || outputFormat === 'jpeg') {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, outputWidth, outputHeight)
      } else {
        ctx.clearRect(0, 0, outputWidth, outputHeight)
      }

      // SVGの縦横比を保持して描画
      const imgAspect = img.width / img.height
      const canvasAspect = outputWidth / outputHeight
      
      let drawWidth = outputWidth
      let drawHeight = outputHeight
      let drawX = 0
      let drawY = 0

      if (imgAspect > canvasAspect) {
        drawHeight = outputWidth / imgAspect
        drawY = (outputHeight - drawHeight) / 2
      } else {
        drawWidth = outputHeight * imgAspect
        drawX = (outputWidth - drawWidth) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      // 画像データを取得
      const mimeType = outputFormat === 'png' ? 'image/png' : 
                      outputFormat === 'jpeg' ? 'image/jpeg' : 'image/webp'
      
      const qualityValue = outputFormat === 'png' ? undefined : parseFloat(quality)
      const dataUrl = canvas.toDataURL(mimeType, qualityValue)
      
      setPreviewUrl(dataUrl)
      
      // リソースクリーンアップ
      URL.revokeObjectURL(svgUrl)
      
    } catch (err) {
      setError(`変換エラー: ${(err as Error).message}`)
    } finally {
      setIsConverting(false)
    }
  }

  const downloadImage = () => {
    if (!previewUrl) return

    const link = document.createElement('a')
    link.download = `svg-converted.${outputFormat}`
    link.href = previewUrl
    link.click()
  }

  const clearAll = () => {
    setSvgContent('')
    setPreviewUrl('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sampleSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#ff6b6b" stroke="#333" stroke-width="2"/>
  <text x="100" y="110" text-anchor="middle" font-family="Arial" font-size="16" fill="white">SVG Sample</text>
</svg>`

  return (
    <ToolLayout
      title="SVG画像変換"
      description="SVGファイルをPNG・JPEG・WebP形式に変換します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>SVG入力方法</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as InputMethod)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">ファイルアップロード</TabsTrigger>
                <TabsTrigger value="text">SVGコード入力</TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="space-y-4 mt-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-3">
                    <div className="text-5xl group-hover:scale-110 transition-transform">📄</div>
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-gray-700 group-hover:text-blue-600">
                        SVGファイルをドラッグ&ドロップ
                      </p>
                      <p className="text-sm text-gray-500">
                        またはクリックしてファイルを選択
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      SVG ファイル対応
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept=".svg,image/svg+xml"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    ファイルを選択
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    クリア
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>対応形式: SVG (.svg)</p>
                  <p>注意: このツールはブラウザ内で処理し、ファイルをサーバーに送信しません</p>
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SVGコード</label>
                  <Textarea
                    placeholder="SVGコードを入力してください..."
                    value={svgContent}
                    onChange={(e) => setSvgContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button
                    onClick={() => setSvgContent(sampleSvg)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    サンプルSVG使用
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">出力形式</label>
            <Select value={outputFormat} onValueChange={(value: OutputFormat) => setOutputFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG（透明度対応）</SelectItem>
                <SelectItem value="jpeg">JPEG（高圧縮）</SelectItem>
                <SelectItem value="webp">WebP（最新形式）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">幅 (px)</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="1"
              max="4096"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">高さ (px)</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="1"
              max="4096"
            />
          </div>

          {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
            <div>
              <label className="block text-sm font-medium mb-2">品質 (0.1-1.0)</label>
              <Input
                type="number"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                min="0.1"
                max="1.0"
                step="0.1"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="transparent"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              disabled={outputFormat === 'jpeg'}
              className="rounded"
            />
            <label htmlFor="transparent" className="text-sm">
              透明背景 {outputFormat === 'jpeg' && '(JPEG非対応)'}
            </label>
          </div>

          {(!transparent || outputFormat === 'jpeg') && (
            <div>
              <label className="block text-sm font-medium mb-2">背景色</label>
              <Input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={convertSvgToImage} 
            className="flex-1" 
            disabled={!svgContent.trim() || isConverting}
          >
            {isConverting ? '変換中...' : '画像変換'}
          </Button>
          <Button onClick={clearAll} variant="outline">
            クリア
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {previewUrl && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                <Button onClick={downloadImage} size="sm">
                  ダウンロード
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <img 
                  src={previewUrl} 
                  alt="変換された画像" 
                  className="max-w-full max-h-96 object-contain border rounded"
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>形式: {outputFormat.toUpperCase()}</p>
                <p>サイズ: {width} × {height} px</p>
                {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                  <p>品質: {Math.round(parseFloat(quality) * 100)}%</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">対応形式</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>PNG - 透明度対応、ロスレス圧縮</li>
                  <li>JPEG - 高圧縮、写真に適している</li>
                  <li>WebP - 最新形式、高圧縮・高品質</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">品質設定</h4>
                <p>
                  JPEG・WebP形式では品質を0.1〜1.0で調整可能。
                  1.0が最高品質、0.1が最高圧縮となります。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">縦横比保持</h4>
                <p>
                  変換時は元のSVGの縦横比を保持し、
                  指定サイズ内に収まるよう自動調整されます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}