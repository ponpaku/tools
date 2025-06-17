'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function ExcelToHtmlTool() {
  const [excelData, setExcelData] = useState<string>('')
  const [htmlOutput, setHtmlOutput] = useState<string>('')
  const [hasHeader, setHasHeader] = useState<boolean>(true)
  const [addBorder, setAddBorder] = useState<boolean>(true)
  const [addStripes, setAddStripes] = useState<boolean>(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')

  const parseExcelData = (data: string): string[][] => {
    if (!data.trim()) return []
    
    const lines = data.trim().split('\n')
    return lines.map(line => {
      // タブ区切りでセルを分割
      return line.split('\t').map(cell => cell.trim())
    })
  }

  const generateHtmlTable = (rows: string[][]): string => {
    if (rows.length === 0) return ''

    let html = '<table'
    
    // スタイル追加
    const styles: string[] = []
    if (addBorder) {
      styles.push('border-collapse: collapse')
      styles.push('border: 1px solid #ddd')
    }
    if (styles.length > 0) {
      html += ` style="${styles.join('; ')}"`
    }
    html += '>\n'

    // ヘッダー行の処理
    if (hasHeader && rows.length > 0) {
      html += '  <thead>\n    <tr'
      if (addStripes) {
        html += ' style="background-color: #f2f2f2"'
      }
      html += '>\n'
      
      rows[0].forEach(cell => {
        html += '      <th'
        if (addBorder) {
          html += ' style="border: 1px solid #ddd; padding: 8px"'
        }
        html += `>${escapeHtml(cell)}</th>\n`
      })
      html += '    </tr>\n  </thead>\n'
    }

    // ボディ行の処理
    html += '  <tbody>\n'
    const dataRows = hasHeader ? rows.slice(1) : rows
    
    dataRows.forEach((row, index) => {
      html += '    <tr'
      if (addStripes && index % 2 === 1) {
        html += ' style="background-color: #f9f9f9"'
      }
      html += '>\n'
      
      row.forEach(cell => {
        const tag = hasHeader ? 'td' : 'td'
        html += `      <${tag}`
        if (addBorder) {
          html += ' style="border: 1px solid #ddd; padding: 8px"'
        }
        html += `>${escapeHtml(cell)}</${tag}>\n`
      })
      html += '    </tr>\n'
    })
    
    html += '  </tbody>\n'
    html += '</table>'
    
    return html
  }

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  const generatePreviewHtml = (htmlTable: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        table { margin: 20px; }
        ${addBorder ? `
        table, th, td {
            border: 1px solid #ddd;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        ` : ''}
        ${addStripes ? `
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        th {
            background-color: #f2f2f2;
        }
        ` : ''}
    </style>
</head>
<body>
    ${htmlTable}
</body>
</html>
    `.trim()
  }

  useEffect(() => {
    const rows = parseExcelData(excelData)
    const html = generateHtmlTable(rows)
    setHtmlOutput(html)
    setPreviewHtml(generatePreviewHtml(html))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excelData, hasHeader, addBorder, addStripes])

  const handleClear = () => {
    setExcelData('')
    setHtmlOutput('')
    setPreviewHtml('')
  }

  const handleSampleData = () => {
    const sampleData = `名前\t年齢\t職業\t住所
田中太郎\t30\tエンジニア\t東京都
佐藤花子\t25\tデザイナー\t大阪府
山田次郎\t35\tマネージャー\t神奈川県`
    setExcelData(sampleData)
  }

  return (
    <ToolLayout
      title="Excel to HTML変換"
      description="Excelデータをコピーして瞬時にHTMLテーブルに変換"
    >
      <div className="space-y-6">
        {/* 入力エリア */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Excelデータを貼り付け</CardTitle>
              <Button onClick={handleSampleData} variant="outline" size="sm">
                📋 サンプルデータ
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Excelからコピーしたデータをここに貼り付けてください..."
              value={excelData}
              onChange={(e) => setExcelData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <div className="mt-2 text-sm text-gray-600">
              💡 Excelで範囲選択してCtrl+Cでコピー、ここにCtrl+Vで貼り付け
            </div>
          </CardContent>
        </Card>

        {/* オプション設定 */}
        <Card>
          <CardHeader>
            <CardTitle>オプション設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasHeader"
                  checked={hasHeader}
                  onCheckedChange={(checked) => setHasHeader(!!checked)}
                />
                <label htmlFor="hasHeader" className="text-sm font-medium">
                  1行目をヘッダーとする
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addBorder"
                  checked={addBorder}
                  onCheckedChange={(checked) => setAddBorder(!!checked)}
                />
                <label htmlFor="addBorder" className="text-sm font-medium">
                  枠線を追加
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addStripes"
                  checked={addStripes}
                  onCheckedChange={(checked) => setAddStripes(!!checked)}
                />
                <label htmlFor="addStripes" className="text-sm font-medium">
                  縞模様（ストライプ）
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* プレビュー */}
        {previewHtml && (
          <Card>
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border rounded-lg p-4 bg-white overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </CardContent>
          </Card>
        )}

        {/* HTML出力 */}
        {htmlOutput && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成されたHTMLコード</CardTitle>
                <CopyButton text={htmlOutput} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={htmlOutput}
                readOnly
                rows={12}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        {/* 完全なHTMLファイル */}
        {previewHtml && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>完全なHTMLファイル</CardTitle>
                <CopyButton text={previewHtml} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={previewHtml}
                readOnly
                rows={8}
                className="font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                💡 このコードを.htmlファイルとして保存すると、ブラウザで表示できます
              </div>
            </CardContent>
          </Card>
        )}

        {/* クリアボタン */}
        {excelData && (
          <div className="flex justify-center">
            <Button onClick={handleClear} variant="outline">
              🗑️ すべてクリア
            </Button>
          </div>
        )}

        {/* 使用方法 */}
        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">📋 Excelからのコピー手順</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Excelで変換したいセル範囲を選択</li>
                  <li>Ctrl+C（Macは⌘+C）でコピー</li>
                  <li>上の入力欄にCtrl+V（Macは⌘+V）で貼り付け</li>
                  <li>オプションを調整してHTMLコードを生成</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">⚙️ オプション説明</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>ヘッダー行：</strong> 1行目を&lt;th&gt;タグで囲みます</li>
                  <li><strong>枠線：</strong> border属性とCSSで表に枠線を追加</li>
                  <li><strong>縞模様：</strong> 偶数行に背景色を付けて読みやすくします</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">💡 活用例</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>ブログやWebサイトでの表作成</li>
                  <li>メールでのデータ共有</li>
                  <li>HTML/CSS学習での表練習</li>
                  <li>レポートでの表組み作成</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 対応データ形式 */}
        <Card>
          <CardHeader>
            <CardTitle>対応データ形式</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✅ 対応ソフトウェア</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Microsoft Excel（全バージョン）</li>
                  <li>Google スプレッドシート</li>
                  <li>LibreOffice Calc</li>
                  <li>Apple Numbers</li>
                  <li>その他のタブ区切りデータ</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📝 データ形式の注意点</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>セル内の改行は削除されます</li>
                  <li>特殊文字は自動的にエスケープされます</li>
                  <li>空のセルは空の&lt;td&gt;として出力されます</li>
                  <li>数式は計算結果の値が使用されます</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}