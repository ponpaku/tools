'use client'

import { useState, useRef } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Download, Image, FileText } from 'lucide-react'

export default function Base64Tool() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [fileBase64, setFileBase64] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [activeTab, setActiveTab] = useState('text')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const processFile = (file: File) => {
    setError('')
    setFileName(file.name)
    setFileType(file.type)
    setFileSize(file.size)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        const base64 = result.split(',')[1] || result
        setFileBase64(base64)
      }
    }
    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました')
    }
    reader.readAsDataURL(file)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const downloadFile = () => {
    if (!fileBase64 || !fileName) return

    try {
      const mimeType = fileType || 'application/octet-stream'
      const dataUrl = `data:${mimeType};base64,${fileBase64}`
      
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError('ファイルのダウンロードに失敗しました')
    }
  }

  const clearFile = () => {
    setFileBase64('')
    setFileName('')
    setFileType('')
    setFileSize(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (type: string) => {
    return type.startsWith('image/')
  }

  return (
    <ToolLayout
      title="Base64エンコーダーデコーダ"
      description="テキスト・画像・ファイルのBase64エンコード・デコードを行います"
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              テキスト
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              ファイル
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ファイルアップロード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className={`w-12 h-12 mx-auto ${
                          isDragging ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <p className={`text-sm ${
                          isDragging ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {isDragging 
                            ? 'ファイルをここにドロップ' 
                            : 'クリックしてファイルを選択またはドラッグ&ドロップ'
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          画像、文書、その他のファイルをBase64に変換
                        </p>
                      </div>
                    </label>
                  </div>

                  {fileName && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{fileName}</p>
                            <p className="text-sm text-gray-600">
                              {fileType || '不明'} • {formatFileSize(fileSize)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadFile}
                              disabled={!fileBase64}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              ダウンロード
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearFile}
                            >
                              クリア
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {fileBase64 && isImage(fileType) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>画像プレビュー</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <img
                            src={`data:${fileType};base64,${fileBase64}`}
                            alt={fileName}
                            className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {fileBase64 && (
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Base64データ</CardTitle>
                          <CopyButton text={fileBase64} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={fileBase64}
                          readOnly
                          className="min-h-[120px] bg-gray-50 font-mono text-xs"
                        />
                        <div className="mt-2 text-sm text-gray-600">
                          Base64データ長: {fileBase64.length}文字
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  )
}