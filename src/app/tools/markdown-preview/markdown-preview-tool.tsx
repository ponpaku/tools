'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Code, FileText, Copy } from 'lucide-react'

// シンプルなMarkdownパーサー
class SimpleMarkdownParser {
  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  private parseInline(text: string): string {
    return text
      // Strong (太字) **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Emphasis (斜体) *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Code `code`
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>')
      // Images ![alt](src)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-image" />')
      // Strikethrough ~~text~~
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
  }

  private parseCodeBlock(text: string): string {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'plaintext'
      const escapedCode = this.escapeHtml(code.trim())
      return `<pre class="code-block"><code class="language-${language}">${escapedCode}</code></pre>`
    })
  }

  private parseTable(text: string): string {
    const lines = text.split('\n')
    const result: string[] = []
    let inTable = false
    let tableRows: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.includes('|') && line.split('|').length >= 3) {
        if (!inTable) {
          inTable = true
          tableRows = []
        }
        tableRows.push(line)
      } else {
        if (inTable) {
          // テーブル終了
          result.push(this.renderTable(tableRows))
          inTable = false
          tableRows = []
        }
        result.push(line)
      }
    }

    if (inTable && tableRows.length > 0) {
      result.push(this.renderTable(tableRows))
    }

    return result.join('\n')
  }

  private renderTable(rows: string[]): string {
    if (rows.length < 2) return rows.join('\n')

    const parseRow = (row: string) => {
      return row.split('|')
        .map(cell => cell.trim())
        .filter((cell, index, arr) => index !== 0 && index !== arr.length - 1)
    }

    const headerRow = parseRow(rows[0])
    const separatorRow = rows[1]
    const bodyRows = rows.slice(2)

    if (!separatorRow.includes('-')) return rows.join('\n')

    let table = '<table class="markdown-table">\n'
    
    // ヘッダー
    table += '  <thead>\n    <tr>\n'
    headerRow.forEach(cell => {
      table += `      <th>${this.parseInline(cell)}</th>\n`
    })
    table += '    </tr>\n  </thead>\n'

    // ボディ
    table += '  <tbody>\n'
    bodyRows.forEach(row => {
      const cells = parseRow(row)
      table += '    <tr>\n'
      cells.forEach(cell => {
        table += `      <td>${this.parseInline(cell)}</td>\n`
      })
      table += '    </tr>\n'
    })
    table += '  </tbody>\n</table>'

    return table
  }

  parse(markdown: string): string {
    if (!markdown.trim()) return ''

    // コードブロックを先に処理
    let html = this.parseCodeBlock(markdown)
    
    // テーブルを処理
    html = this.parseTable(html)
    
    const lines = html.split('\n')
    const result: string[] = []
    let inCodeBlock = false
    let inTable = false

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]

      // コードブロック内は処理しない
      if (line.includes('<pre class="code-block">')) {
        inCodeBlock = true
      } else if (line.includes('</pre>')) {
        inCodeBlock = false
      }

      // テーブル内は処理しない
      if (line.includes('<table class="markdown-table">')) {
        inTable = true
      } else if (line.includes('</table>')) {
        inTable = false
      }

      if (inCodeBlock || inTable) {
        result.push(line)
        continue
      }

      // 見出し
      if (line.match(/^#{1,6}\s/)) {
        const level = line.match(/^#+/)![0].length
        const text = line.replace(/^#+\s/, '')
        line = `<h${level} class="markdown-h${level}">${this.parseInline(text)}</h${level}>`
      }
      // 水平線
      else if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
        line = '<hr class="markdown-hr" />'
      }
      // 順序なしリスト
      else if (line.match(/^[-*+]\s/)) {
        const text = line.replace(/^[-*+]\s/, '')
        line = `<ul class="markdown-ul"><li class="markdown-li">${this.parseInline(text)}</li></ul>`
      }
      // 順序付きリスト
      else if (line.match(/^\d+\.\s/)) {
        const text = line.replace(/^\d+\.\s/, '')
        line = `<ol class="markdown-ol"><li class="markdown-li">${this.parseInline(text)}</li></ol>`
      }
      // 引用
      else if (line.match(/^>\s/)) {
        const text = line.replace(/^>\s/, '')
        line = `<blockquote class="markdown-blockquote">${this.parseInline(text)}</blockquote>`
      }
      // 段落
      else if (line.trim() !== '') {
        line = `<p class="markdown-p">${this.parseInline(line)}</p>`
      }
      // 空行
      else {
        line = '<br />'
      }

      result.push(line)
    }

    // 連続したリストをマージ
    return this.mergeConsecutiveLists(result.join('\n'))
  }

  private mergeConsecutiveLists(html: string): string {
    // 連続したulをマージ
    html = html.replace(/<\/ul>\s*<ul class="markdown-ul">/g, '')
    // 連続したolをマージ
    html = html.replace(/<\/ol>\s*<ol class="markdown-ol">/g, '')
    return html
  }
}

const sampleMarkdown = `# Markdownサンプル

これは**太字**と*斜体*と\`インラインコード\`のサンプルです。

## 見出し2

### 見出し3

## リスト

### 順序なしリスト
- アイテム1
- アイテム2
  - サブアイテム
- アイテム3

### 順序付きリスト
1. 最初の項目
2. 2番目の項目
3. 3番目の項目

## リンクと画像

[GitHubのリンク](https://github.com)

![サンプル画像](https://via.placeholder.com/300x200?text=Sample+Image)

## コードブロック

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
  return 'success';
}
\`\`\`

\`\`\`python
def greet(name):
    print(f"Hello, {name}!")
    return True
\`\`\`

## 表

| 項目 | 説明 | 価格 |
|------|------|------|
| 商品A | 高品質な商品 | ¥1,000 |
| 商品B | お得な商品 | ¥500 |
| 商品C | プレミアム商品 | ¥2,000 |

## 引用

> これは引用文です。
> 複数行にわたる引用も可能です。

## 水平線

---

## その他

~~取り消し線~~も使えます。

**Markdown**は文書作成に便利なフォーマットです。`

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState('')
  const [activeTab, setActiveTab] = useState('preview')

  const parser = useMemo(() => new SimpleMarkdownParser(), [])

  const htmlOutput = useMemo(() => {
    try {
      return parser.parse(markdown)
    } catch (error) {
      return '<p class="error">Markdownの解析中にエラーが発生しました</p>'
    }
  }, [markdown, parser])

  const loadSample = () => {
    setMarkdown(sampleMarkdown)
  }

  const clearAll = () => {
    setMarkdown('')
  }

  return (
    <ToolLayout
      title="Markdownプレビュー"
      description="Markdownテキストのリアルタイムプレビュー・変換ツール"
    >
      <div className="space-y-6">
        {/* コントロール */}
        <Card>
          <CardHeader>
            <CardTitle>ツール操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={loadSample} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                サンプル読み込み
              </Button>
              <Button onClick={clearAll} variant="outline">
                クリア
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.writeText(htmlOutput)}
                className="ml-auto"
              >
                <Code className="h-4 w-4 mr-2" />
                HTMLをコピー
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* メインエディタ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 入力エリア */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Markdown入力
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="ここにMarkdownテキストを入力してください..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[500px] font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>

          {/* プレビューエリア */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                プレビュー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[500px] border rounded-lg p-4 bg-white overflow-auto">
                <div 
                  className="markdown-preview prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HTML出力 */}
        <Card>
          <CardHeader>
            <CardTitle>HTML出力</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={htmlOutput}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Markdownガイド */}
        <Card>
          <CardHeader>
            <CardTitle>Markdown記法ガイド</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">見出し</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    # 見出し1<br />
                    ## 見出し2<br />
                    ### 見出し3
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">強調</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    **太字**<br />
                    *斜体*<br />
                    ~~取り消し線~~
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">リスト</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    - 項目1<br />
                    - 項目2<br />
                    <br />
                    1. 番号付き項目1<br />
                    2. 番号付き項目2
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">リンク・画像</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    [リンクテキスト](URL)<br />
                    ![画像の説明](画像URL)
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">コード</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    `インラインコード`<br />
                    <br />
                    ```<br />
                    コードブロック<br />
                    ```
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">表</h4>
                  <div className="bg-gray-50 p-3 rounded font-mono">
                    | 列1 | 列2 |<br />
                    |-----|-----|<br />
                    | 値1 | 値2 |
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* このツールについて */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">対応機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>見出し（H1〜H6）</li>
                  <li>太字・斜体・取り消し線</li>
                  <li>順序付き・順序なしリスト</li>
                  <li>リンク・画像</li>
                  <li>インラインコード・コードブロック</li>
                  <li>表（テーブル）</li>
                  <li>引用文</li>
                  <li>水平線</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>GitHub READMEファイルの作成・編集</li>
                  <li>技術文書・API仕様書の執筆</li>
                  <li>ブログ記事の下書き作成</li>
                  <li>プロジェクト文書の作成</li>
                  <li>Markdown記法の学習・練習</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">主な特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>リアルタイムプレビュー表示</li>
                  <li>サイドバイサイドレイアウト</li>
                  <li>HTML出力のコピー機能</li>
                  <li>サンプルMarkdownファイル提供</li>
                  <li>記法ガイド内蔵</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .markdown-preview {
          line-height: 1.6;
        }
        
        .markdown-h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          padding-bottom: 0.3rem;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .markdown-h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.25rem 0 0.75rem 0;
          padding-bottom: 0.2rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .markdown-h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }
        
        .markdown-h4, .markdown-h5, .markdown-h6 {
          font-size: 1rem;
          font-weight: bold;
          margin: 0.75rem 0 0.5rem 0;
        }
        
        .markdown-p {
          margin: 0.75rem 0;
        }
        
        .markdown-ul, .markdown-ol {
          list-style: auto;
          margin: 0.75rem 0;
          padding-left: 2rem;
        }
        
        .markdown-li {
          margin: 0.25rem 0;
        }
        
        .markdown-blockquote {
          margin: 1rem 0;
          padding: 0.5rem 1rem;
          border-left: 4px solid #e2e8f0;
          background-color: #f8fafc;
          font-style: italic;
        }
        
        .markdown-hr {
          margin: 2rem 0;
          border: none;
          border-top: 2px solid #e2e8f0;
        }
        
        .inline-code {
          background-color: #f1f5f9;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875em;
        }
        
        .code-block {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        
        .code-block code {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .markdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .markdown-table th,
        .markdown-table td {
          border: 1px solid #e2e8f0;
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        
        .markdown-table th {
          background-color: #f8fafc;
          font-weight: bold;
        }
        
        .markdown-link {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .markdown-link:hover {
          color: #1d4ed8;
        }
        
        .markdown-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .error {
          color: #dc2626;
          font-style: italic;
        }
      `}</style>
    </ToolLayout>
  )
}