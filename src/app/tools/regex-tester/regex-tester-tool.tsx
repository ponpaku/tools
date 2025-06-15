'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'

interface MatchResult {
  match: string
  index: number
  length: number
  groups?: string[]
}

interface RegexResult {
  isValid: boolean
  error?: string
  matches: MatchResult[]
  totalMatches: number
}

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('')
  const [testString, setTestString] = useState('')
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  })

  const result = useMemo((): RegexResult => {
    if (!pattern) {
      return { isValid: true, matches: [], totalMatches: 0 }
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag, _]) => {
          switch (flag) {
            case 'global': return 'g'
            case 'ignoreCase': return 'i'
            case 'multiline': return 'm'
            case 'dotAll': return 's'
            case 'unicode': return 'u'
            case 'sticky': return 'y'
            default: return ''
          }
        })
        .join('')

      const regex = new RegExp(pattern, flagString)
      const matches: MatchResult[] = []

      if (flags.global) {
        let match
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            match: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1)
          })
          
          // 無限ループ防止
          if (match[0].length === 0) {
            regex.lastIndex++
          }
        }
      } else {
        const match = regex.exec(testString)
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1)
          })
        }
      }

      return {
        isValid: true,
        matches,
        totalMatches: matches.length
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        matches: [],
        totalMatches: 0
      }
    }
  }, [pattern, testString, flags])

  const highlightedText = useMemo(() => {
    if (!testString || result.matches.length === 0) {
      return testString
    }

    let highlighted = ''
    let lastIndex = 0

    result.matches.forEach((match, index) => {
      // マッチ前のテキスト
      highlighted += testString.slice(lastIndex, match.index)
      
      // マッチしたテキスト（ハイライト）
      highlighted += `<span class="bg-yellow-300 text-yellow-900 px-1 rounded font-semibold" title="Match ${index + 1}: ${match.match}">${testString.slice(match.index, match.index + match.length)}</span>`
      
      lastIndex = match.index + match.length
    })

    // 残りのテキスト
    highlighted += testString.slice(lastIndex)

    return highlighted
  }, [testString, result.matches])

  const commonPatterns = [
    {
      name: 'メールアドレス',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      description: '一般的なメールアドレス形式'
    },
    {
      name: 'URL',
      pattern: 'https?://[^\\s]+',
      description: 'HTTP/HTTPSのURL'
    },
    {
      name: '日本の電話番号',
      pattern: '0\\d{1,4}-\\d{1,4}-\\d{3,4}',
      description: 'ハイフンありの日本の電話番号'
    },
    {
      name: '郵便番号',
      pattern: '\\d{3}-\\d{4}',
      description: '日本の郵便番号（123-4567形式）'
    },
    {
      name: 'IPv4アドレス',
      pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
      description: 'IPv4アドレス'
    },
    {
      name: '日付（YYYY-MM-DD）',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      description: 'ISO8601形式の日付'
    },
    {
      name: '英数字のみ',
      pattern: '^[a-zA-Z0-9]+$',
      description: '英数字のみの文字列'
    },
    {
      name: '数字のみ',
      pattern: '^\\d+$',
      description: '数字のみの文字列'
    }
  ]

  const sampleTexts = [
    {
      name: 'メール・電話混合',
      text: `連絡先情報：
メール: taro@example.com, hanako@test.co.jp
電話: 03-1234-5678, 090-9876-5432
ウェブサイト: https://example.com, http://test.jp`
    },
    {
      name: 'ログサンプル',
      text: `2024-01-15 10:30:45 [INFO] User login: user@example.com from 192.168.1.100
2024-01-15 10:31:02 [ERROR] Failed login attempt from 10.0.0.1
2024-01-15 10:31:15 [INFO] Data backup completed successfully`
    },
    {
      name: 'HTML/CSS',
      text: `<div class="container">
  <h1 id="title">Hello World</h1>
  <p style="color: #ff6600;">This is a paragraph.</p>
  <a href="https://example.com">Link</a>
</div>`
    }
  ]

  return (
    <ToolLayout
      title="正規表現テスター"
      description="正規表現のテスト・検証ツール（カラーハイライト付き）"
    >
      <div className="space-y-6">
        {/* 正規表現入力 */}
        <Card>
          <CardHeader>
            <CardTitle>正規表現パターン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="正規表現を入力（例: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}）"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="font-mono text-lg"
              />
              {!result.isValid && (
                <div className="text-red-600 text-sm font-medium">
                  エラー: {result.error}
                </div>
              )}
            </div>

            {/* フラグ設定 */}
            <div>
              <h4 className="font-semibold mb-3">フラグ設定</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  global: 'グローバル (g) - 全てのマッチを検索',
                  ignoreCase: '大文字小文字無視 (i)',
                  multiline: '複数行 (m) - ^と$が行の開始・終了にマッチ',
                  dotAll: 'dotAll (s) - .が改行文字にもマッチ',
                  unicode: 'Unicode (u)',
                  sticky: 'Sticky (y) - lastIndexから開始'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={flags[key as keyof typeof flags]}
                      onCheckedChange={(checked) => 
                        setFlags(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                    <label htmlFor={key} className="text-sm cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* テスト文字列入力 */}
        <Card>
          <CardHeader>
            <CardTitle>テスト文字列</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="テストする文字列を入力してください..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="min-h-32 font-mono"
            />
          </CardContent>
        </Card>

        {/* 結果表示 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>マッチ結果</CardTitle>
              <Badge variant={result.totalMatches > 0 ? "default" : "secondary"}>
                {result.totalMatches} 件のマッチ
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ハイライト表示 */}
            <div>
              <h4 className="font-semibold mb-2">ハイライト表示</h4>
              <div 
                className="p-4 bg-gray-50 rounded-lg font-mono whitespace-pre-wrap text-sm min-h-20 border"
                dangerouslySetInnerHTML={{ __html: highlightedText || "（マッチなし）" }}
              />
            </div>

            {/* マッチ詳細 */}
            {result.matches.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">マッチ詳細</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.matches.map((match, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-mono font-bold text-yellow-800">
                            &quot;{match.match}&quot;
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            位置: {match.index} ～ {match.index + match.length - 1} ({match.length}文字)
                          </div>
                          {match.groups && match.groups.length > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
                              グループ: {match.groups.map((group, i) => `$${i + 1}=&quot;${group}&quot;`).join(', ')}
                            </div>
                          )}
                        </div>
                        <CopyButton text={match.match} className="ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="patterns">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patterns">よく使うパターン</TabsTrigger>
            <TabsTrigger value="samples">サンプルテキスト</TabsTrigger>
          </TabsList>

          {/* よく使うパターン */}
          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>よく使う正規表現パターン</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonPatterns.map((item, index) => (
                    <div 
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setPattern(item.pattern)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="font-mono text-sm text-blue-600 my-1">{item.pattern}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <CopyButton text={item.pattern} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* サンプルテキスト */}
          <TabsContent value="samples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>サンプルテキスト</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleTexts.map((item, index) => (
                    <div 
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setTestString(item.text)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="font-mono text-sm text-gray-600 mt-1 line-clamp-3 whitespace-pre-line">
                            {item.text}
                          </div>
                        </div>
                        <CopyButton text={item.text} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>正規表現パターンの検証とテスト</li>
                  <li>マッチした部分のカラーハイライト表示</li>
                  <li>マッチ詳細情報（位置、グループなど）</li>
                  <li>フラグ設定（グローバル、大文字小文字無視など）</li>
                  <li>よく使うパターン集</li>
                  <li>サンプルテキスト集</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>プログラミング・開発時の正規表現テスト</li>
                  <li>データ検証・バリデーション処理の作成</li>
                  <li>ログファイルの解析・パターン抽出</li>
                  <li>テキスト処理・置換処理の設計</li>
                  <li>入力フォームの検証ルール作成</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">正規表現の基本</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>.</code> - 任意の1文字</li>
                  <li><code>*</code> - 直前の文字が0回以上</li>
                  <li><code>+</code> - 直前の文字が1回以上</li>
                  <li><code>?</code> - 直前の文字が0回または1回</li>
                  <li><code>[abc]</code> - a、b、cのいずれか</li>
                  <li><code>\\d</code> - 数字（0-9）</li>
                  <li><code>\\w</code> - 英数字とアンダースコア</li>
                  <li><code>\\s</code> - 空白文字</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}