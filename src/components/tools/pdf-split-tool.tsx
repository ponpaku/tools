'use client'

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Scissors, Upload, Download, FileText } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

interface SplitOption {
  type: 'single' | 'range' | 'custom'
  pageNumbers?: number[]
  ranges?: { start: number; end: number }[]
}

interface SplitResult {
  id: string
  name: string
  url: string
  pages: number[]
}

export default function PDFSplitTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [splitOption, setSplitOption] = useState<SplitOption>({ type: 'single' })
  const [customPages, setCustomPages] = useState<string>('')
  const [rangeStart, setRangeStart] = useState<string>('')
  const [rangeEnd, setRangeEnd] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SplitResult[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('PDFファイルを選択してください')
      return
    }

    setError(null)
    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPageCount()
      
      setFile(selectedFile)
      setPageCount(pages)
      setResults([])
    } catch (err) {
      setError('PDFファイルの読み込みに失敗しました')
    }
  }, [])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    processFile(selectedFile)
    event.target.value = ''
  }, [processFile])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [processFile])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const parsePageNumbers = useCallback((input: string): number[] => {
    const pages: number[] = []
    const parts = input.split(',')
    
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))
        if (start && end && start <= end && start >= 1 && end <= pageCount) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i)
          }
        }
      } else {
        const page = parseInt(trimmed)
        if (page >= 1 && page <= pageCount && !pages.includes(page)) {
          pages.push(page)
        }
      }
    }
    
    return pages.sort((a, b) => a - b)
  }, [pageCount])

  const splitPDF = useCallback(async () => {
    if (!file) {
      setError('PDFファイルを選択してください')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResults([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const originalPdf = await PDFDocument.load(arrayBuffer)
      const newResults: SplitResult[] = []

      if (splitOption.type === 'single') {
        // 各ページを個別のPDFに分割
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(originalPdf, [i])
          newPdf.addPage(page)
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          
          newResults.push({
            id: `page-${i + 1}`,
            name: `ページ${i + 1}.pdf`,
            url,
            pages: [i + 1]
          })
        }
      } else if (splitOption.type === 'range') {
        // 範囲指定で分割
        const start = parseInt(rangeStart)
        const end = parseInt(rangeEnd)
        
        if (!start || !end || start < 1 || end > pageCount || start > end) {
          setError('有効な範囲を指定してください')
          setIsProcessing(false)
          return
        }

        const newPdf = await PDFDocument.create()
        const pageIndices = []
        for (let i = start - 1; i < end; i++) {
          pageIndices.push(i)
        }
        
        const pages = await newPdf.copyPages(originalPdf, pageIndices)
        pages.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        
        newResults.push({
          id: `range-${start}-${end}`,
          name: `ページ${start}-${end}.pdf`,
          url,
          pages: Array.from({ length: end - start + 1 }, (_, i) => start + i)
        })
      } else if (splitOption.type === 'custom') {
        // カスタムページで分割
        const pages = parsePageNumbers(customPages)
        
        if (pages.length === 0) {
          setError('有効なページ番号を指定してください（例: 1,3,5-7）')
          setIsProcessing(false)
          return
        }

        const newPdf = await PDFDocument.create()
        const pageIndices = pages.map(p => p - 1)
        
        const copiedPages = await newPdf.copyPages(originalPdf, pageIndices)
        copiedPages.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        
        newResults.push({
          id: `custom-${pages.join('-')}`,
          name: `選択ページ.pdf`,
          url,
          pages
        })
      }

      setResults(newResults)
    } catch (err) {
      setError('PDF分割中にエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }, [file, splitOption, pageCount, customPages, rangeStart, rangeEnd, parsePageNumbers])

  const downloadFile = useCallback((result: SplitResult) => {
    const link = document.createElement('a')
    link.href = result.url
    link.download = result.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const downloadAll = useCallback(() => {
    results.forEach((result, index) => {
      setTimeout(() => downloadFile(result), index * 500)
    })
  }, [results, downloadFile])

  const reset = useCallback(() => {
    setFile(null)
    setPageCount(0)
    setResults([])
    setError(null)
    setCustomPages('')
    setRangeStart('')
    setRangeEnd('')
    results.forEach(result => URL.revokeObjectURL(result.url))
  }, [results])

  return (
    <ToolLayout
      title="PDF分割ツール"
      description="PDFファイルを指定したページや範囲で分割します。"
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
              分割したいPDFファイルを選択してください
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
                  分割したいPDFファイルを選択してください
                </p>
              </div>
            </div>
            
            {file && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">総ページ数: {pageCount}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* エラー表示 */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* 分割オプション */}
        {file && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                分割オプション
              </CardTitle>
              <CardDescription>
                分割方法を選択してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="splitOption"
                    checked={splitOption.type === 'single'}
                    onChange={() => setSplitOption({ type: 'single' })}
                  />
                  <span>各ページを個別のPDFに分割</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="splitOption"
                    checked={splitOption.type === 'range'}
                    onChange={() => setSplitOption({ type: 'range' })}
                  />
                  <span>ページ範囲を指定</span>
                </label>
                
                {splitOption.type === 'range' && (
                  <div className="ml-6 flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="開始ページ"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      min="1"
                      max={pageCount}
                      className="w-24"
                    />
                    <span>〜</span>
                    <Input
                      type="number"
                      placeholder="終了ページ"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      min="1"
                      max={pageCount}
                      className="w-24"
                    />
                  </div>
                )}
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="splitOption"
                    checked={splitOption.type === 'custom'}
                    onChange={() => setSplitOption({ type: 'custom' })}
                  />
                  <span>カスタムページを指定</span>
                </label>
                
                {splitOption.type === 'custom' && (
                  <div className="ml-6">
                    <Input
                      placeholder="例: 1,3,5-7,10"
                      value={customPages}
                      onChange={(e) => setCustomPages(e.target.value)}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      コンマ区切りでページ番号を指定。範囲指定にはハイフンを使用（例: 5-7）
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 分割実行 */}
        {file && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={splitPDF}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'PDF分割中...' : 'PDFを分割する'}
                </Button>
                <Button variant="outline" onClick={reset}>
                  リセット
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 結果表示 */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                分割結果 ({results.length}個のファイル)
              </CardTitle>
              <CardDescription>
                分割されたPDFファイルをダウンロードできます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.length > 1 && (
                  <Button onClick={downloadAll} className="w-full mb-4">
                    <Download className="mr-2 h-4 w-4" />
                    すべてダウンロード
                  </Button>
                )}
                
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-sm text-gray-600">
                          ページ: {result.pages.join(', ')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFile(result)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
                分割したいPDFファイルを選択してアップロードします。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. 分割方法を選択</h4>
              <p className="text-sm text-gray-600">
                各ページ個別・ページ範囲・カスタムページから分割方法を選択します。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. PDF分割・ダウンロード</h4>
              <p className="text-sm text-gray-600">
                「PDFを分割する」ボタンをクリックして、分割されたPDFをダウンロードします。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}