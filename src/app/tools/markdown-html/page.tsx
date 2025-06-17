'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, RotateCcw, ArrowRightLeft, AlertCircle, Info, FileCode2, Eye } from 'lucide-react'
import { ToolLayout } from '@/components/layout/tool-layout'

// シンプルなMarkdownパーサー（既存のものを流用）
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
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images ![alt](src)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // Strikethrough ~~text~~
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
  }

  private parseCodeBlock(text: string): string {
    return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'plaintext'
      const escapedCode = this.escapeHtml(code.trim())
      return `<pre><code class="language-${language}">${escapedCode}</code></pre>`
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

    let table = '<table>\n'
    
    // ヘッダー
    table += '  <thead>\n    <tr>\n'
    headerRow.forEach(cell => {
      table += `      <th>${this.parseInline(cell)}</th>\n`
    })
    table += '    </tr>\n  </thead>\n'

    // ボディ
    table += '  <tbody>\n'
    bodyRows.forEach(rowStr => {
      const cells = parseRow(rowStr)
      table += '    <tr>\n'
      cells.forEach(cell => {
        table += `      <td>${this.parseInline(cell)}</td>\n`
      })
      table += '    </tr>\n'
    })
    table += '  </tbody>\n</table>'

    return table
  }

  public parse(markdown: string): string {
    if (!markdown) return ''

    let html = markdown

    // コードブロックを先に処理
    html = this.parseCodeBlock(html)

    // テーブルを処理
    html = this.parseTable(html)

    // 各行を処理
    const lines = html.split('\n')
    const processedLines = lines.map(line => {
      const trimmed = line.trim()

      // 見出し
      if (trimmed.match(/^#{1,6}\s/)) {
        const level = trimmed.match(/^(#{1,6})/)?.[1].length || 1
        const text = trimmed.replace(/^#{1,6}\s/, '')
        return `<h${level}>${this.parseInline(text)}</h${level}>`
      }

      // 水平線
      if (trimmed.match(/^(---+|===+|\*\*\*+)$/)) {
        return '<hr>'
      }

      // リスト
      if (trimmed.match(/^[\*\-\+]\s/)) {
        const text = trimmed.replace(/^[\*\-\+]\s/, '')
        return `<li>${this.parseInline(text)}</li>`
      }

      // 番号付きリスト
      if (trimmed.match(/^\d+\.\s/)) {
        const text = trimmed.replace(/^\d+\.\s/, '')
        return `<li>${this.parseInline(text)}</li>`
      }

      // 引用
      if (trimmed.match(/^>\s/)) {
        const text = trimmed.replace(/^>\s/, '')
        return `<blockquote>${this.parseInline(text)}</blockquote>`
      }

      // 空行
      if (trimmed === '') {
        return '<br>'
      }

      // 通常の段落
      return `<p>${this.parseInline(line)}</p>`
    })

    return processedLines.join('\n')
  }
}

// HTML→Markdown変換器
class HTMLToMarkdownConverter {
  public convert(html: string): string {
    if (!html) return ''

    let markdown = html

    // HTMLエンティティをデコード
    markdown = markdown.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

    // 見出し
    markdown = markdown.replace(/<h([1-6])>(.*?)<\/h[1-6]>/gi, (match, level, text) => {
      return '#'.repeat(parseInt(level)) + ' ' + text.replace(/<[^>]*>/g, '')
    })

    // 太字
    markdown = markdown.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, '**$2**')

    // 斜体
    markdown = markdown.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, '*$2*')

    // 削除線
    markdown = markdown.replace(/<del>(.*?)<\/del>/gi, '~~$1~~')

    // コード
    markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`')

    // コードブロック
    markdown = markdown.replace(/<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/gi, (match, lang, code) => {
      return '```' + (lang || '') + '\n' + code + '\n```'
    })

    // リンク
    markdown = markdown.replace(/<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

    // 画像
    markdown = markdown.replace(/<img\s+src="([^"]*)"(?:\s+alt="([^"]*)")?[^>]*>/gi, '![$2]($1)')

    // 水平線
    markdown = markdown.replace(/<hr\s*\/?>/gi, '---')

    // 引用
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1')

    // リスト
    markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1')

    // 段落
    markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n')

    // 改行
    markdown = markdown.replace(/<br\s*\/?>/gi, '\n')

    // 残りのHTMLタグを除去
    markdown = markdown.replace(/<[^>]*>/g, '')

    // 連続する改行を整理
    markdown = markdown.replace(/\n{3,}/g, '\n\n')

    return markdown.trim()
  }
}

export default function MarkdownHTMLConverterPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<'markdown-to-html' | 'html-to-markdown'>('markdown-to-html')

  const parser = useMemo(() => new SimpleMarkdownParser(), [])
  const converter = useMemo(() => new HTMLToMarkdownConverter(), [])

  // 変換処理
  const { result, error } = useMemo(() => {
    if (!input.trim()) {
      return { result: '', error: null }
    }

    try {
      if (mode === 'markdown-to-html') {
        const html = parser.parse(input)
        return { result: html, error: null }
      } else {
        const markdown = converter.convert(input)
        return { result: markdown, error: null }
      }
    } catch (error) {
      return { result: '', error: (error as Error).message }
    }
  }, [input, mode, parser, converter])

  const handleClear = () => {
    setInput('')
  }

  const handleModeToggle = () => {
    setMode(prev => prev === 'markdown-to-html' ? 'html-to-markdown' : 'markdown-to-html')
    setInput('')
  }

  const examples = {
    markdown: `# 見出し1

## 見出し2

**太字のテキスト** と *斜体のテキスト*

- リスト項目1
- リスト項目2
- リスト項目3

1. 番号付きリスト1
2. 番号付きリスト2

\`コード\` と ~~削除線~~

[リンクテキスト](https://example.com)

> これは引用文です

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\``,
    html: `<h1>見出し1</h1>
<h2>見出し2</h2>
<p><strong>太字のテキスト</strong> と <em>斜体のテキスト</em></p>
<ul>
<li>リスト項目1</li>
<li>リスト項目2</li>
<li>リスト項目3</li>
</ul>
<ol>
<li>番号付きリスト1</li>
<li>番号付きリスト2</li>
</ol>
<p><code>コード</code> と <del>削除線</del></p>
<p><a href="https://example.com">リンクテキスト</a></p>
<blockquote>これは引用文です</blockquote>
<pre><code class="language-javascript">function hello() {
  console.log("Hello, World!");
}</code></pre>`
  }

  return (
    <ToolLayout
      title="Markdown・HTML変換"
      description="MarkdownとHTMLを相互変換できる無料ツール。技術文書作成、ブログ執筆、Web開発に最適。"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileCode2 className="h-5 w-5" />
                  <span>Markdown・HTML変換ツール</span>
                </CardTitle>
                <CardDescription>
                  MarkdownとHTMLを相互変換します。技術文書作成やWeb開発に便利です。
                </CardDescription>
              </div>
              <Button
                onClick={handleModeToggle}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>変換方向切替</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* モード表示 */}
            <div className="flex items-center space-x-4">
              <Badge variant={mode === 'markdown-to-html' ? 'default' : 'secondary'}>
                {mode === 'markdown-to-html' ? 'Markdown → HTML' : 'HTML → Markdown'}
              </Badge>
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* 入力エリア */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {mode === 'markdown-to-html' ? 'Markdown入力' : 'HTML入力'}
                </label>
                <div className="space-x-2">
                  <Button
                    onClick={() => setInput(mode === 'markdown-to-html' ? examples.markdown : examples.html)}
                    variant="outline"
                    size="sm"
                  >
                    サンプル
                  </Button>
                  <Button onClick={handleClear} variant="outline" size="sm">
                    クリア
                  </Button>
                </div>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'markdown-to-html' ? 
                  'Markdownテキストを入力してください...\n例:\n# 見出し\n**太字** *斜体*\n- リスト項目' :
                  'HTMLを入力してください...\n例:\n<h1>見出し</h1>\n<p><strong>太字</strong></p>'
                }
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="flex items-center space-x-2 p-3 text-red-600 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 結果表示 */}
            {result && !error && (
              <Tabs defaultValue="preview" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>プレビュー</span>
                    </TabsTrigger>
                    <TabsTrigger value="source" className="flex items-center space-x-2">
                      <FileCode2 className="h-4 w-4" />
                      <span>ソース</span>
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    onClick={() => navigator.clipboard.writeText(result)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>コピー</span>
                  </Button>
                </div>

                <TabsContent value="preview" className="mt-4">
                  <div className="border border-gray-200 rounded-md p-4 bg-white min-h-[200px]">
                    {mode === 'markdown-to-html' ? (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: result }}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="source" className="mt-4">
                  <Textarea
                    value={result}
                    readOnly
                    rows={8}
                    className="font-mono text-sm bg-gray-50"
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        {/* 使用方法 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>対応している記法</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Markdown記法</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 見出し: # ## ### ...</li>
                  <li>• 太字: **text** __text__</li>
                  <li>• 斜体: *text* _text_</li>
                  <li>• 削除線: ~~text~~</li>
                  <li>• コード: `code`</li>
                  <li>• コードブロック: ```</li>
                  <li>• リスト: - * +</li>
                  <li>• 番号付きリスト: 1.</li>
                  <li>• リンク: [text](url)</li>
                  <li>• 画像: ![alt](url)</li>
                  <li>• 引用: {'> text'}</li>
                  <li>• 水平線: ---</li>
                  <li>• 表: | テーブル |</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">HTML要素</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 見出し: {'<h1> ~ <h6>'}</li>
                  <li>• 太字: {'<strong> <b>'}</li>
                  <li>• 斜体: {'<em> <i>'}</li>
                  <li>• 削除線: {'<del>'}</li>
                  <li>• コード: {'<code>'}</li>
                  <li>• コードブロック: {'<pre>'}</li>
                  <li>• リスト: {'<ul> <ol> <li>'}</li>
                  <li>• リンク: {'<a>'}</li>
                  <li>• 画像: {'<img>'}</li>
                  <li>• 引用: {'<blockquote>'}</li>
                  <li>• 水平線: {'<hr>'}</li>
                  <li>• 段落: {'<p>'}</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-3">
              <h4 className="font-semibold">使用例</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Markdown例</p>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{examples.markdown}</pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">HTML例</p>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">{examples.html}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}