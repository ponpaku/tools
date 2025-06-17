'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ToolLayout } from '@/components/layout/tool-layout'
import { FileImage, Upload, Download, X, ArrowUp, ArrowDown, Image } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { jsPDF } from 'jspdf'

interface ImageFile {
  id: string
  file: File
  name: string
  url: string
  width: number
  height: number
}

type PageSize = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Custom'
type Orientation = 'portrait' | 'landscape'

export default function ImageToPDFTool() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [pageSize, setPageSize] = useState<PageSize>('A4')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new (window as any).Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    await processFiles(selectedFiles)
    event.target.value = ''
  }, [processFiles])

  const processFiles = useCallback(async (files: File[]) => {
    setError(null)

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('画像ファイルのみアップロード可能です')
        continue
      }

      try {
        const dimensions = await loadImageDimensions(file)
        const url = URL.createObjectURL(file)

        const newImage: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          url,
          width: dimensions.width,
          height: dimensions.height
        }

        setImages(prev => [...prev, newImage])
      } catch (err) {
        setError(`${file.name}の読み込みに失敗しました`)
      }
    }
  }, [loadImageDimensions])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      processFiles(files)
    }
  }, [processFiles])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.url)
      }
      return prev.filter(img => img.id !== id)
    })
  }, [])

  const moveImage = useCallback((id: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === id)
      if (index === -1) return prev

      const newImages = [...prev]
      const [image] = newImages.splice(index, 1)

      if (direction === 'up' && index > 0) {
        newImages.splice(index - 1, 0, image)
      } else if (direction === 'down' && index < prev.length - 1) {
        newImages.splice(index + 1, 0, image)
      } else {
        newImages.splice(index, 0, image)
      }

      return newImages
    })
  }, [])

  const getPageDimensions = useCallback((size: PageSize, orient: Orientation) => {
    const dimensions = {
      A4: { width: 210, height: 297 },
      A3: { width: 297, height: 420 },
      Letter: { width: 216, height: 279 },
      Legal: { width: 216, height: 356 },
      Custom: { width: 210, height: 297 }
    }

    const { width, height } = dimensions[size]
    return orient === 'landscape' ? { width: height, height: width } : { width, height }
  }, [])

  const createPDF = useCallback(async () => {
    if (images.length === 0) {
      setError('画像を追加してください')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const pageDimensions = getPageDimensions(pageSize, orientation)
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'p' : 'l',
        unit: 'mm',
        format: pageSize === 'Custom' ? [pageDimensions.width, pageDimensions.height] : pageSize.toLowerCase() as any
      })

      // 最初のページは自動で作成されているので削除
      pdf.deletePage(1)

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        
        // 新しいページを追加
        pdf.addPage()

        // 画像をCanvas経由でBase64に変換
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) continue

        const img = new (window as any).Image()
        img.src = image.url

        await new Promise<void>((resolve) => {
          img.onload = () => {
            // ページサイズに合わせて画像をリサイズ
            const pageWidth = pageDimensions.width
            const pageHeight = pageDimensions.height
            
            const imgAspect = image.width / image.height
            const pageAspect = pageWidth / pageHeight
            
            let drawWidth, drawHeight, x, y

            if (imgAspect > pageAspect) {
              // 画像が横長の場合、幅に合わせる
              drawWidth = pageWidth - 20 // マージン 10mm
              drawHeight = drawWidth / imgAspect
              x = 10
              y = (pageHeight - drawHeight) / 2
            } else {
              // 画像が縦長の場合、高さに合わせる
              drawHeight = pageHeight - 20 // マージン 10mm
              drawWidth = drawHeight * imgAspect
              x = (pageWidth - drawWidth) / 2
              y = 10
            }

            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(img, 0, 0)

            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
            pdf.addImage(dataUrl, 'JPEG', x, y, drawWidth, drawHeight)
            resolve()
          }
        })
      }

      const pdfBlob = pdf.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
    } catch (err) {
      setError('PDF作成中にエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }, [images, pageSize, orientation, getPageDimensions])

  const downloadPDF = useCallback(() => {
    if (!pdfUrl) return

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'images-converted.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [pdfUrl])

  const reset = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.url))
    setImages([])
    setPdfUrl(null)
    setError(null)
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
    }
  }, [images, pdfUrl])

  return (
    <ToolLayout
      title="画像→PDF変換ツール"
      description="複数の画像ファイルを1つのPDFファイルに変換します。"
    >
      <div className="grid gap-6">
        {/* 画像アップロード */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              画像ファイルをアップロード
            </CardTitle>
            <CardDescription>
              PDF化したい画像ファイルを選択してください（JPEG、PNG、WebP対応）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="space-y-2">
                <Upload className={`w-12 h-12 mx-auto ${
                  isDragging ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <p className={`text-sm ${
                  isDragging ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {isDragging 
                    ? '画像ファイルをここにドロップ' 
                    : 'クリックして画像を選択またはドラッグ&ドロップ'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  JPEG・PNG・WebP形式の画像をPDFに変換（複数選択可能）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* PDF設定 */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>PDF設定</CardTitle>
              <CardDescription>
                生成するPDFのページサイズと向きを設定してください
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ページサイズ</label>
                <Select value={pageSize} onValueChange={(value: PageSize) => setPageSize(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210×297mm)</SelectItem>
                    <SelectItem value="A3">A3 (297×420mm)</SelectItem>
                    <SelectItem value="Letter">Letter (216×279mm)</SelectItem>
                    <SelectItem value="Legal">Legal (216×356mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">向き</label>
                <Select value={orientation} onValueChange={(value: Orientation) => setOrientation(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">縦向き</SelectItem>
                    <SelectItem value="landscape">横向き</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 画像一覧 */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                アップロード済み画像 ({images.length}個)
              </CardTitle>
              <CardDescription>
                画像の順序を調整できます。上から順番にPDFページになります。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
                  >
                    <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded min-w-[2rem] text-center">
                      {index + 1}
                    </span>
                    <img
                      src={image.url}
                      alt={`プレビュー: ${image.name}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{image.name}</p>
                      <p className="text-xs text-gray-500">
                        {image.width} × {image.height} px
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF作成ボタン */}
        {images.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={createPDF}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'PDF作成中...' : 'PDFを作成する'}
                </Button>
                <Button variant="outline" onClick={reset}>
                  リセット
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ダウンロード */}
        {pdfUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                PDF作成完了
              </CardTitle>
              <CardDescription>
                画像からPDFファイルの作成が完了しました。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadPDF} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                PDFファイルをダウンロード
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 使用方法 */}
        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">1. 画像ファイルをアップロード</h4>
              <p className="text-sm text-gray-600">
                PDF化したい画像ファイル（JPEG、PNG、WebP）を選択してアップロードします。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. PDF設定を調整</h4>
              <p className="text-sm text-gray-600">
                ページサイズ（A4、A3など）と向き（縦・横）を選択します。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. 画像順序の調整</h4>
              <p className="text-sm text-gray-600">
                必要に応じて上下矢印ボタンで画像の順序を調整します。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. PDF作成・ダウンロード</h4>
              <p className="text-sm text-gray-600">
                「PDFを作成する」ボタンをクリックして、作成されたPDFをダウンロードします。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}