'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ToolLayout } from '@/components/layout/tool-layout'
import { FileImage, Upload, Download, X, ArrowUp, ArrowDown } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface PDFFile {
  id: string
  file: File
  name: string
  pages: number
}

export default function PDFMergeTool() {
  const [files, setFiles] = useState<PDFFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    await processFiles(selectedFiles)
    event.target.value = ''
  }, [processFiles])

  const processFiles = useCallback(async (selectedFiles: File[]) => {
    setError(null)

    for (const file of selectedFiles) {
      if (file.type !== 'application/pdf') {
        setError('PDFファイルのみアップロード可能です')
        continue
      }

      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pageCount = pdfDoc.getPageCount()

        const newFile: PDFFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          pages: pageCount
        }

        setFiles(prev => [...prev, newFile])
      } catch (err) {
        setError(`${file.name}の読み込みに失敗しました`)
      }
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(event.dataTransfer.files)
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
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

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }, [])

  const moveFile = useCallback((id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(file => file.id === id)
      if (index === -1) return prev

      const newFiles = [...prev]
      const [file] = newFiles.splice(index, 1)

      if (direction === 'up' && index > 0) {
        newFiles.splice(index - 1, 0, file)
      } else if (direction === 'down' && index < prev.length - 1) {
        newFiles.splice(index + 1, 0, file)
      } else {
        newFiles.splice(index, 0, file)
      }

      return newFiles
    })
  }, [])

  const mergePDFs = useCallback(async () => {
    if (files.length < 2) {
      setError('結合するには2つ以上のPDFファイルが必要です')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const mergedPdf = await PDFDocument.create()

      for (const fileData of files) {
        const arrayBuffer = await fileData.file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setMergedUrl(url)
    } catch (err) {
      setError('PDF結合中にエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }, [files])

  const downloadMergedPDF = useCallback(() => {
    if (!mergedUrl) return

    const link = document.createElement('a')
    link.href = mergedUrl
    link.download = 'merged-document.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [mergedUrl])

  const reset = useCallback(() => {
    setFiles([])
    setMergedUrl(null)
    setError(null)
    if (mergedUrl) {
      URL.revokeObjectURL(mergedUrl)
    }
  }, [mergedUrl])

  return (
    <ToolLayout
      title="PDFマージ・結合ツール"
      description="複数のPDFファイルを1つに結合します。ページ順序の調整も可能です。"
    >
      <div className="grid gap-6">
        {/* ファイルアップロード */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              PDFファイルをアップロード
            </CardTitle>
            <CardDescription>
              結合したいPDFファイルを選択してください（複数選択可能）
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
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
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
                    ? 'PDFファイルをここにドロップ' 
                    : 'クリックしてPDFを選択またはドラッグ&ドロップ'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  結合したいPDFファイルを選択してください（複数選択可能）
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

        {/* ファイル一覧 */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                アップロードされたファイル ({files.length}個)
              </CardTitle>
              <CardDescription>
                ドラッグで順序を変更できます。上から順番に結合されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.pages}ページ</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFile(file.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFile(file.id, 'down')}
                        disabled={index === files.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
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

        {/* 結合ボタン */}
        {files.length >= 2 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={mergePDFs}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'PDF結合中...' : 'PDFを結合する'}
                </Button>
                <Button variant="outline" onClick={reset}>
                  リセット
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ダウンロード */}
        {mergedUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                結合完了
              </CardTitle>
              <CardDescription>
                PDFファイルの結合が完了しました。ダウンロードできます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadMergedPDF} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                結合されたPDFをダウンロード
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
              <h4 className="font-semibold">1. PDFファイルをアップロード</h4>
              <p className="text-sm text-gray-600">
                結合したいPDFファイルを選択してアップロードします。複数ファイルの同時選択が可能です。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. ファイル順序の調整</h4>
              <p className="text-sm text-gray-600">
                上下矢印ボタンでファイルの順序を変更できます。上から順番に結合されます。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. PDF結合・ダウンロード</h4>
              <p className="text-sm text-gray-600">
                「PDFを結合する」ボタンをクリックして、結合されたPDFをダウンロードします。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}