'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import * as Diff from 'diff'

interface DiffChange {
  value: string
  added?: boolean
  removed?: boolean
  count?: number
}

interface DiffStats {
  additions: number
  deletions: number
  changes: number
  unchanged: number
  total: number
  addedChars: number
  removedChars: number
  addedLines: number
  removedLines: number
}

export default function DiffToolPage() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [compareMode, setCompareMode] = useState<'chars' | 'words' | 'wordsWithSpace' | 'lines' | 'sentences' | 'json'>('lines')
  const [viewMode, setViewMode] = useState<'unified' | 'sideBySide'>('unified')
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [newlineIsToken, setNewlineIsToken] = useState(false)

  const diffOptions = {
    ignoreCase,
    ignoreWhitespace: ignoreWhitespace,
    newlineIsToken: newlineIsToken,
  }

  const diffResults = useMemo(() => {
    if (!text1 && !text2) return []

    let processedText1 = text1
    let processedText2 = text2

    // 前処理
    if (ignoreCase) {
      processedText1 = processedText1.toLowerCase()
      processedText2 = processedText2.toLowerCase()
    }

    try {
      switch (compareMode) {
        case 'chars':
          return Diff.diffChars(processedText1, processedText2, diffOptions)
        case 'words':
          return Diff.diffWords(processedText1, processedText2, diffOptions)
        case 'wordsWithSpace':
          return Diff.diffWordsWithSpace(processedText1, processedText2, diffOptions)
        case 'lines':
          return Diff.diffLines(processedText1, processedText2, diffOptions)
        case 'sentences':
          return Diff.diffSentences(processedText1, processedText2)
        case 'json':
          try {
            const json1 = JSON.parse(processedText1)
            const json2 = JSON.parse(processedText2)
            return Diff.diffJson(json1, json2)
          } catch {
            return Diff.diffLines(processedText1, processedText2, diffOptions)
          }
        default:
          return Diff.diffLines(processedText1, processedText2, diffOptions)
      }
    } catch (error) {
      console.error('Diff error:', error)
      return []
    }
  }, [text1, text2, compareMode, ignoreCase, ignoreWhitespace, newlineIsToken])

  const stats = useMemo((): DiffStats => {
    const additions = diffResults.filter(part => part.added).length
    const deletions = diffResults.filter(part => part.removed).length
    const unchanged = diffResults.filter(part => !part.added && !part.removed).length
    const changes = additions + deletions
    const total = diffResults.length

    const addedChars = diffResults
      .filter(part => part.added)
      .reduce((sum, part) => sum + part.value.length, 0)
    
    const removedChars = diffResults
      .filter(part => part.removed)
      .reduce((sum, part) => sum + part.value.length, 0)

    const addedLines = diffResults
      .filter(part => part.added)
      .reduce((sum, part) => sum + (part.value.match(/\n/g) || []).length + (part.value ? 1 : 0), 0)
    
    const removedLines = diffResults
      .filter(part => part.removed)
      .reduce((sum, part) => sum + (part.value.match(/\n/g) || []).length + (part.value ? 1 : 0), 0)

    return {
      additions,
      deletions,
      changes,
      unchanged,
      total,
      addedChars,
      removedChars,
      addedLines,
      removedLines
    }
  }, [diffResults])

  const generateUnifiedDiff = (): string => {
    const unified = Diff.createPatch('file', text1, text2, 'Original', 'Modified')
    return unified
  }

  const generateDetailedReport = (): string => {
    let report = `詳細Diff比較レポート\n`
    report += `=====================\n`
    report += `比較日時: ${new Date().toLocaleString('ja-JP')}\n`
    report += `比較モード: ${getModeName(compareMode)}\n`
    report += `オプション:\n`
    report += `  - 大文字小文字を無視: ${ignoreCase ? 'はい' : 'いいえ'}\n`
    report += `  - 空白を無視: ${ignoreWhitespace ? 'はい' : 'いいえ'}\n`
    report += `  - 改行をトークンとして扱う: ${newlineIsToken ? 'はい' : 'いいえ'}\n\n`
    
    report += `統計情報:\n`
    report += `=========\n`
    report += `追加セクション: ${stats.additions}\n`
    report += `削除セクション: ${stats.deletions}\n`
    report += `変更セクション: ${stats.changes}\n`
    report += `未変更セクション: ${stats.unchanged}\n`
    report += `総セクション数: ${stats.total}\n`
    report += `追加文字数: ${stats.addedChars}\n`
    report += `削除文字数: ${stats.removedChars}\n`
    report += `追加行数: ${stats.addedLines}\n`
    report += `削除行数: ${stats.removedLines}\n\n`

    report += `Unified Diff形式:\n`
    report += `================\n`
    report += generateUnifiedDiff()

    return report
  }

  const getModeName = (mode: string): string => {
    const modeNames = {
      chars: '文字単位',
      words: '単語単位',
      wordsWithSpace: '単語単位（空白保持）',
      lines: '行単位',
      sentences: '文単位',
      json: 'JSON構造'
    }
    return modeNames[mode as keyof typeof modeNames] || mode
  }

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
  }

  const clearTexts = () => {
    setText1('')
    setText2('')
  }

  const examples = [
    {
      name: 'プログラムコードの変更',
      text1: `function calculateSum(a, b) {
  let result = a + b;
  console.log("Result: " + result);
  return result;
}

const numbers = [1, 2, 3];
console.log(calculateSum(10, 20));`,
      text2: `function calculateSum(a, b, c = 0) {
  const result = a + b + c;
  console.log(\`Result: \${result}\`);
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const sum = calculateSum(10, 20, 5);
console.log(sum);`
    },
    {
      name: 'JSON設定ファイルの変更',
      text1: `{
  "name": "myapp",
  "version": "1.0.0",
  "dependencies": {
    "react": "^17.0.0",
    "express": "^4.17.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}`,
      text2: `{
  "name": "myapp",
  "version": "1.1.0",
  "dependencies": {
    "react": "^18.0.0",
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}`
    },
    {
      name: '文書の校正',
      text1: `人工知能の発展により、私たちの生活は大きく変化しています。
機械学習やディープラーニングの技術は、様々な分野で活用されており、
今後ますます重要性が高まると予想されます。

しかし、AI技術の急速な発展には課題もあります。
プライバシーの保護や雇用への影響など、
慎重に検討すべき問題があります。`,
      text2: `人工知能（AI）の急速な発展により、私たちの日常生活は劇的に変化しています。
機械学習、ディープラーニング、自然言語処理などの先進技術は、
医療、金融、教育、エンターテインメントなど、様々な分野で実用化されており、
今後ますますその重要性と影響力が拡大すると予想されます。

一方で、AI技術の急速な普及には重要な課題も伴います。
個人情報の保護、労働市場への影響、アルゴリズムの透明性、
そして倫理的な使用について、社会全体で慎重に議論し、
適切なガイドラインを策定する必要があります。`
    }
  ]

  return (
    <ToolLayout
      title="高機能diffツール"
      description="jsdiffライブラリを使用した高精度なテキスト差分比較ツール"
    >
      <div className="space-y-6">
        {/* 設定パネル */}
        <Card>
          <CardHeader>
            <CardTitle>比較設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">比較モード</label>
                <Select value={compareMode} onValueChange={(value: any) => setCompareMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chars">文字単位</SelectItem>
                    <SelectItem value="words">単語単位</SelectItem>
                    <SelectItem value="wordsWithSpace">単語単位（空白保持）</SelectItem>
                    <SelectItem value="lines">行単位</SelectItem>
                    <SelectItem value="sentences">文単位</SelectItem>
                    <SelectItem value="json">JSON構造</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">表示モード</label>
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unified">ユニファイド表示</SelectItem>
                    <SelectItem value="sideBySide">サイドバイサイド表示</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ignoreCase" 
                    checked={ignoreCase} 
                    onCheckedChange={(checked) => setIgnoreCase(checked as boolean)}
                  />
                  <label htmlFor="ignoreCase" className="text-sm">大文字小文字を無視</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ignoreWhitespace" 
                    checked={ignoreWhitespace} 
                    onCheckedChange={(checked) => setIgnoreWhitespace(checked as boolean)}
                  />
                  <label htmlFor="ignoreWhitespace" className="text-sm">空白を無視</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="newlineIsToken" 
                    checked={newlineIsToken} 
                    onCheckedChange={(checked) => setNewlineIsToken(checked as boolean)}
                  />
                  <label htmlFor="newlineIsToken" className="text-sm">改行を独立トークン化</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作ボタン */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={swapTexts} variant="outline" disabled={!text1 && !text2}>
            テキストを入れ替え
          </Button>
          <Button onClick={clearTexts} variant="outline" disabled={!text1 && !text2}>
            すべてクリア
          </Button>
        </div>

        {/* テキスト入力エリア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              テキスト1 (比較元) - {text1.length} 文字
            </label>
            <Textarea
              placeholder="比較元のテキストを入力..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              テキスト2 (比較先) - {text2.length} 文字
            </label>
            <Textarea
              placeholder="比較先のテキストを入力..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
        </div>

        {/* 統計情報 */}
        {stats.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>比較統計</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{stats.additions}</p>
                  <p className="text-xs text-green-600">追加セクション</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{stats.deletions}</p>
                  <p className="text-xs text-red-600">削除セクション</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{stats.changes}</p>
                  <p className="text-xs text-blue-600">変更セクション</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">{stats.unchanged}</p>
                  <p className="text-xs text-gray-600">未変更</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-lg font-bold text-green-800">{stats.addedChars}</p>
                  <p className="text-xs text-green-700">追加文字</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-lg font-bold text-red-800">{stats.removedChars}</p>
                  <p className="text-xs text-red-700">削除文字</p>
                </div>
                <div className="bg-green-200 p-3 rounded-lg">
                  <p className="text-lg font-bold text-green-900">{stats.addedLines}</p>
                  <p className="text-xs text-green-800">追加行</p>
                </div>
                <div className="bg-red-200 p-3 rounded-lg">
                  <p className="text-lg font-bold text-red-900">{stats.removedLines}</p>
                  <p className="text-xs text-red-800">削除行</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 差分表示 */}
        {diffResults.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>差分表示 ({getModeName(compareMode)})</CardTitle>
                <CopyButton text={generateDetailedReport()} />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <TabsList>
                  <TabsTrigger value="unified">ユニファイド表示</TabsTrigger>
                  <TabsTrigger value="sideBySide">サイドバイサイド表示</TabsTrigger>
                </TabsList>
                
                <TabsContent value="unified" className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="font-mono text-sm space-y-1">
                      {diffResults.map((part, index) => {
                        if (part.added) {
                          return (
                            <div key={index} className="bg-green-100 border-l-4 border-green-500 px-2 py-1">
                              <span className="text-green-700">+ {part.value}</span>
                            </div>
                          )
                        } else if (part.removed) {
                          return (
                            <div key={index} className="bg-red-100 border-l-4 border-red-500 px-2 py-1">
                              <span className="text-red-700">- {part.value}</span>
                            </div>
                          )
                        } else {
                          return (
                            <div key={index} className="px-2 py-1 text-gray-600">
                              <span>  {part.value}</span>
                            </div>
                          )
                        }
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sideBySide" className="mt-4">
                  <div className="bg-gray-50 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-px bg-gray-300">
                      <div className="bg-white p-2 font-semibold text-sm border-b">削除 / 変更前</div>
                      <div className="bg-white p-2 font-semibold text-sm border-b">追加 / 変更後</div>
                      
                      {(() => {
                        const leftSide: React.ReactNode[] = []
                        const rightSide: React.ReactNode[] = []
                        
                        diffResults.forEach((part, index) => {
                          if (part.removed) {
                            leftSide.push(
                              <div key={`left-${index}`} className="bg-red-50 p-2 font-mono text-sm text-red-700 border-l-4 border-red-400">
                                {part.value}
                              </div>
                            )
                          } else if (part.added) {
                            rightSide.push(
                              <div key={`right-${index}`} className="bg-green-50 p-2 font-mono text-sm text-green-700 border-l-4 border-green-400">
                                {part.value}
                              </div>
                            )
                          } else {
                            leftSide.push(
                              <div key={`left-${index}`} className="bg-white p-2 font-mono text-sm text-gray-600">
                                {part.value}
                              </div>
                            )
                            rightSide.push(
                              <div key={`right-${index}`} className="bg-white p-2 font-mono text-sm text-gray-600">
                                {part.value}
                              </div>
                            )
                          }
                        })
                        
                        const maxLength = Math.max(leftSide.length, rightSide.length)
                        const result: React.ReactNode[] = []
                        
                        for (let i = 0; i < maxLength; i++) {
                          result.push(
                            <div key={`left-cell-${i}`} className="bg-white">
                              {leftSide[i] || <div className="p-2"></div>}
                            </div>
                          )
                          result.push(
                            <div key={`right-cell-${i}`} className="bg-white">
                              {rightSide[i] || <div className="p-2"></div>}
                            </div>
                          )
                        }
                        
                        return result
                      })()}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* 使用例 */}
        <Card>
          <CardHeader>
            <CardTitle>使用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{example.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setText1(example.text1)
                        setText2(example.text2)
                      }}
                    >
                      使用
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">変更前:</p>
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto max-h-32">
                        {example.text1}
                      </pre>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">変更後:</p>
                      <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto max-h-32">
                        {example.text2}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ヘルプ情報 */}
        <Card>
          <CardHeader>
            <CardTitle>高機能diffツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">jsdiffライブラリ採用の利点</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>高精度アルゴリズム</strong>: 最長共通部分列（LCS）とMyersのO(ND)アルゴリズムを使用</li>
                  <li><strong>Unicode完全対応</strong>: 日本語、絵文字、特殊文字の正確な処理</li>
                  <li><strong>多様な比較モード</strong>: 文字・単語・行・文・JSON構造レベルでの比較</li>
                  <li><strong>詳細な差分情報</strong>: 追加・削除・変更の正確な検出と統計</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">比較モードの詳細</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>文字単位</strong>: 1文字ずつ比較（タイポの検出に最適）</li>
                  <li><strong>単語単位</strong>: 空白区切りで単語として比較</li>
                  <li><strong>単語単位（空白保持）</strong>: 空白も含めて単語として処理</li>
                  <li><strong>行単位</strong>: 改行区切りで行として比較（最も一般的）</li>
                  <li><strong>文単位</strong>: 句読点で区切って文として比較</li>
                  <li><strong>JSON構造</strong>: JSONオブジェクトの構造的な比較</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">表示モード</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>ユニファイド表示</strong>: Git風の+/-記号で変更を表示</li>
                  <li><strong>サイドバイサイド表示</strong>: 左右並列で変更前後を比較</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">高度なオプション</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>大文字小文字を無視</strong>: 大文字・小文字の違いを無視</li>
                  <li><strong>空白を無視</strong>: スペース、タブ、改行の違いを無視</li>
                  <li><strong>改行を独立トークン化</strong>: 改行文字を独立したトークンとして扱う</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">エクスポート機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>詳細レポート</strong>: 統計情報とUnified Diff形式を含む包括的レポート</li>
                  <li><strong>Unified Diff形式</strong>: 標準的なパッチファイル形式</li>
                  <li><strong>コピー機能</strong>: ワンクリックでクリップボードにコピー</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}