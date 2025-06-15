'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, ArrowRight } from 'lucide-react'

interface LineBreakStats {
  crlf: number // Windows: \r\n
  lf: number   // Unix/Linux: \n
  cr: number   // Old Mac: \r
  total: number
}

interface ConversionResult {
  windows: string
  unix: string
  mac: string
  stats: LineBreakStats
}

// 改行コードの統計を取得
function getLineBreakStats(text: string): LineBreakStats {
  const crlf = (text.match(/\r\n/g) || []).length
  const lf = (text.replace(/\r\n/g, '').match(/\n/g) || []).length
  const cr = (text.replace(/\r\n/g, '').replace(/\n/g, '').match(/\r/g) || []).length
  
  return {
    crlf,
    lf,
    cr,
    total: crlf + lf + cr
  }
}

// テキストの改行コードを変換
function convertLineBreaks(text: string): ConversionResult {
  const stats = getLineBreakStats(text)
  
  // まず全ての改行コードを統一（LFに）
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  
  return {
    windows: normalized.replace(/\n/g, '\r\n'), // CRLF
    unix: normalized,                           // LF
    mac: normalized.replace(/\n/g, '\r'),       // CR
    stats
  }
}

// 改行コードの種類を判定
function detectLineBreakType(stats: LineBreakStats): string {
  if (stats.total === 0) return '改行なし'
  
  const types = []
  if (stats.crlf > 0) types.push('Windows (CRLF)')
  if (stats.lf > 0) types.push('Unix/Linux (LF)')
  if (stats.cr > 0) types.push('Mac (CR)')
  
  return types.join(' + ')
}

export default function LineBreakConverterTool() {
  const [inputText, setInputText] = useState('')

  const conversionResult = useMemo((): ConversionResult | null => {
    if (!inputText) return null
    return convertLineBreaks(inputText)
  }, [inputText])

  const handleExampleClick = (text: string) => {
    setInputText(text)
  }

  const examples = [
    {
      name: 'Windows形式',
      text: 'Line 1\r\nLine 2\r\nLine 3',
      description: 'CRLF (\\r\\n)'
    },
    {
      name: 'Unix/Linux形式',
      text: 'Line 1\nLine 2\nLine 3',
      description: 'LF (\\n)'
    },
    {
      name: 'Mac形式',
      text: 'Line 1\rLine 2\rLine 3',
      description: 'CR (\\r)'
    },
    {
      name: '混在形式',
      text: 'Line 1\r\nLine 2\nLine 3\rLine 4',
      description: '複数の改行コードが混在'
    }
  ]

  return (
    <ToolLayout
      title="改行コード変換"
      description="テキストの改行コードをWindows・Unix・Mac間で変換"
    >
      <div className="space-y-6">
        {/* 入力エリア */}
        <Card>
          <CardHeader>
            <CardTitle>テキストを入力</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="変換したいテキストを入力してください..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            
            {conversionResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">検出された改行コード</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {detectLineBreakType(conversionResult.stats)}
                  </Badge>
                  {conversionResult.stats.crlf > 0 && (
                    <Badge variant="secondary">CRLF: {conversionResult.stats.crlf}</Badge>
                  )}
                  {conversionResult.stats.lf > 0 && (
                    <Badge variant="secondary">LF: {conversionResult.stats.lf}</Badge>
                  )}
                  {conversionResult.stats.cr > 0 && (
                    <Badge variant="secondary">CR: {conversionResult.stats.cr}</Badge>
                  )}
                  <Badge variant="outline">総改行数: {conversionResult.stats.total}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 変換結果 */}
        {conversionResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Windows形式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Windows形式</span>
                  <Badge variant="outline">CRLF</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">改行コード: \\r\\n</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={conversionResult.windows}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
                <CopyButton text={conversionResult.windows} className="mt-2 w-full" />
              </CardContent>
            </Card>

            {/* Unix/Linux形式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Unix/Linux形式</span>
                  <Badge variant="outline">LF</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">改行コード: \\n</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={conversionResult.unix}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
                <CopyButton text={conversionResult.unix} className="mt-2 w-full" />
              </CardContent>
            </Card>

            {/* Mac形式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Mac形式</span>
                  <Badge variant="outline">CR</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">改行コード: \\r</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={conversionResult.mac}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
                <CopyButton text={conversionResult.mac} className="mt-2 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* サンプルテキスト */}
        <Card>
          <CardHeader>
            <CardTitle>サンプルテキスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleExampleClick(example.text)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{example.name}</h4>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>改行コードについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">改行コードの種類</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">CRLF</Badge>
                    <div>
                      <div className="font-medium">Windows (\\r\\n)</div>
                      <div className="text-gray-600">Windows系OSで一般的に使用される改行コード</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">LF</Badge>
                    <div>
                      <div className="font-medium">Unix/Linux (\\n)</div>
                      <div className="text-gray-600">Unix、Linux、macOS、WebブラウザなどでCMN的に使用</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">CR</Badge>
                    <div>
                      <div className="font-medium">Classic Mac (\\r)</div>
                      <div className="text-gray-600">Mac OS 9以前で使用されていた改行コード（現在は稀）</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">主な用途</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>プログラムファイルのクロスプラットフォーム対応</li>
                  <li>CSVファイルの互換性確保</li>
                  <li>テキストファイルの文字化け対策</li>
                  <li>Webアプリケーションでのデータ処理</li>
                  <li>メール、FTP転送時の文字コード統一</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意点</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>テキストエディタによっては改行コードが表示されない場合があります</li>
                  <li>バイナリファイルには使用しないでください</li>
                  <li>プログラムファイルの改行コード変更時はバックアップを取ることをお勧めします</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}