'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Server, Shield, Clock, Info, AlertCircle, CheckCircle, Copy } from 'lucide-react'

interface HeaderInfo {
  name: string
  value: string
  description?: string
  type: 'security' | 'cache' | 'server' | 'content' | 'other'
}

interface HeaderResponse {
  url: string
  status: number
  statusText: string
  headers: HeaderInfo[]
  timestamp: string
  responseTime?: number
}

export default function HttpHeaderViewerTool() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HeaderResponse | null>(null)
  const [error, setError] = useState('')
  const [clientHeaders, setClientHeaders] = useState<HeaderInfo[]>([])

  // クライアント側のヘッダー情報を取得
  useEffect(() => {
    const headers: HeaderInfo[] = [
      {
        name: 'User-Agent',
        value: navigator.userAgent,
        description: 'ブラウザの識別情報',
        type: 'other'
      },
      {
        name: 'Accept-Language',
        value: navigator.language || 'ja-JP',
        description: '言語設定',
        type: 'content'
      },
      {
        name: 'Platform',
        value: navigator.platform,
        description: 'プラットフォーム情報',
        type: 'other'
      },
      {
        name: 'Cookie Enabled',
        value: navigator.cookieEnabled ? 'true' : 'false',
        description: 'Cookie有効状態',
        type: 'other'
      },
      {
        name: 'Online Status',
        value: navigator.onLine ? 'online' : 'offline',
        description: 'オンライン状態',
        type: 'other'
      }
    ]

    // 画面サイズ情報を追加
    if (typeof window !== 'undefined') {
      headers.push(
        {
          name: 'Screen Resolution',
          value: `${screen.width}x${screen.height}`,
          description: '画面解像度',
          type: 'other'
        },
        {
          name: 'Viewport Size',
          value: `${window.innerWidth}x${window.innerHeight}`,
          description: 'ビューポートサイズ',
          type: 'other'
        },
        {
          name: 'Color Depth',
          value: `${screen.colorDepth}bit`,
          description: '色深度',
          type: 'other'
        }
      )
    }

    setClientHeaders(headers)
  }, [])

  const analyzeUrl = async () => {
    if (!url.trim()) {
      setError('URLを入力してください')
      return
    }

    // URL形式チェック
    try {
      new URL(url)
    } catch {
      setError('有効なURLを入力してください')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const startTime = Date.now()
      
      // CORS制限により、直接のヘッダー取得は制限される場合があります
      // ここでは代替手段として利用可能な情報を表示
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors'
      }).catch(() => {
        // CORS エラーの場合は GET リクエストを試行
        return fetch(url, {
          method: 'GET',
          mode: 'no-cors'
        })
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime

      const headers: HeaderInfo[] = []

      // レスポンスヘッダーを解析
      if (response.headers) {
        response.headers.forEach((value, name) => {
          headers.push({
            name,
            value,
            description: getHeaderDescription(name),
            type: getHeaderType(name)
          })
        })
      }

      // ヘッダーが取得できない場合のメッセージ用ヘッダー
      if (headers.length === 0) {
        headers.push({
          name: 'CORS制限',
          value: 'ブラウザのCORS制限により、一部のヘッダー情報が取得できません',
          description: 'サーバー側でCORSが許可されていない場合、ヘッダー情報の取得が制限されます',
          type: 'other'
        })
      }

      setResult({
        url,
        status: response.status || 0,
        statusText: response.statusText || 'Unknown',
        headers,
        timestamp: new Date().toISOString(),
        responseTime
      })

    } catch (err) {
      setError(`リクエストエラー: ${err instanceof Error ? err.message : '不明なエラー'}`)
    } finally {
      setLoading(false)
    }
  }

  const getHeaderDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      'server': 'Webサーバーの種類とバージョン',
      'content-type': 'コンテンツのMIMEタイプ',
      'content-length': 'コンテンツのサイズ（バイト）',
      'cache-control': 'キャッシュ制御指示',
      'expires': 'コンテンツの有効期限',
      'last-modified': '最終更新日時',
      'etag': 'エンティティタグ（キャッシュ検証用）',
      'set-cookie': 'クッキー設定',
      'x-powered-by': 'サーバー技術スタック',
      'strict-transport-security': 'HTTPS強制設定',
      'x-frame-options': 'フレーム埋め込み制御',
      'x-content-type-options': 'MIMEタイプ推測防止',
      'content-security-policy': 'コンテンツセキュリティポリシー',
      'x-xss-protection': 'XSS攻撃防止',
      'access-control-allow-origin': 'CORS許可オリジン',
      'location': 'リダイレクト先URL',
      'date': 'レスポンス生成日時',
      'connection': 'コネクション管理方式'
    }
    return descriptions[name.toLowerCase()] || 'HTTPヘッダー'
  }

  const getHeaderType = (name: string): HeaderInfo['type'] => {
    const securityHeaders = [
      'strict-transport-security', 'x-frame-options', 'x-content-type-options', 
      'content-security-policy', 'x-xss-protection', 'referrer-policy'
    ]
    const cacheHeaders = [
      'cache-control', 'expires', 'last-modified', 'etag', 'pragma'
    ]
    const serverHeaders = [
      'server', 'x-powered-by', 'x-aspnet-version'
    ]
    const contentHeaders = [
      'content-type', 'content-length', 'content-encoding', 'content-disposition'
    ]

    const lowerName = name.toLowerCase()
    if (securityHeaders.includes(lowerName)) return 'security'
    if (cacheHeaders.includes(lowerName)) return 'cache'
    if (serverHeaders.includes(lowerName)) return 'server'
    if (contentHeaders.includes(lowerName)) return 'content'
    return 'other'
  }

  const getTypeColor = (type: HeaderInfo['type']) => {
    const colors = {
      security: 'bg-red-100 text-red-800',
      cache: 'bg-blue-100 text-blue-800',
      server: 'bg-green-100 text-green-800',
      content: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[type]
  }

  const getTypeIcon = (type: HeaderInfo['type']) => {
    const icons = {
      security: Shield,
      cache: Clock,
      server: Server,
      content: Info,
      other: Globe
    }
    return icons[type]
  }

  const exampleUrls = [
    'https://www.google.com',
    'https://github.com',
    'https://developer.mozilla.org',
    'https://httpbin.org/headers'
  ]

  const formatHeaders = (headers: HeaderInfo[]) => {
    return headers.map(h => `${h.name}: ${h.value}`).join('\n')
  }

  return (
    <ToolLayout
      title="HTTPヘッダービューアー"
      description="WebサイトのHTTPレスポンスヘッダーとクライアント情報を分析・表示"
    >
      <div className="space-y-6">
        {/* URL入力 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              URL解析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeUrl()}
              />
              <Button onClick={analyzeUrl} disabled={loading}>
                {loading ? '解析中...' : '解析'}
              </Button>
            </div>

            {/* サンプルURL */}
            <div>
              <div className="text-sm font-medium mb-2">サンプルURL</div>
              <div className="flex flex-wrap gap-2">
                {exampleUrls.map((exampleUrl, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setUrl(exampleUrl)}
                  >
                    {exampleUrl.replace('https://', '')}
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="response" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="response">レスポンスヘッダー</TabsTrigger>
            <TabsTrigger value="client">クライアント情報</TabsTrigger>
          </TabsList>

          {/* レスポンスヘッダー */}
          <TabsContent value="response" className="space-y-6">
            {result && (
              <>
                {/* ステータス情報 */}
                <Card>
                  <CardHeader>
                    <CardTitle>レスポンス情報</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">URL</div>
                        <div className="font-mono text-sm break-all">{result.url}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">ステータス</div>
                        <div className="font-bold">
                          {result.status} {result.statusText}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">解析日時</div>
                        <div className="text-sm">
                          {new Date(result.timestamp).toLocaleString('ja-JP')}
                        </div>
                      </div>
                      {result.responseTime && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">応答時間</div>
                          <div className="font-bold">{result.responseTime}ms</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* ヘッダー一覧 */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>HTTPヘッダー ({result.headers.length}個)</CardTitle>
                      <CopyButton text={formatHeaders(result.headers)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.headers.map((header, index) => {
                        const Icon = getTypeIcon(header.type)
                        return (
                          <div
                            key={index}
                            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="h-4 w-4 mt-1 text-gray-500" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono font-bold">{header.name}</span>
                                  <Badge className={getTypeColor(header.type)}>
                                    {header.type}
                                  </Badge>
                                  <CopyButton 
                                    text={`${header.name}: ${header.value}`}
                                  />
                                </div>
                                <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                                  {header.value}
                                </div>
                                {header.description && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    {header.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {result.headers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        ヘッダー情報が取得できませんでした
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {!result && !loading && (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  URLを入力して「解析」ボタンをクリックしてください
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* クライアント情報 */}
          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>あなたのブラウザ情報</CardTitle>
                  <CopyButton text={formatHeaders(clientHeaders)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientHeaders.map((header, index) => {
                    const Icon = getTypeIcon(header.type)
                    return (
                      <div
                        key={index}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-4 w-4 mt-1 text-gray-500" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold">{header.name}</span>
                              <CopyButton 
                                text={header.value}
                              />
                            </div>
                            <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                              {header.value}
                            </div>
                            {header.description && (
                              <div className="text-xs text-gray-600 mt-1">
                                {header.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
                  <li>WebサイトのHTTPレスポンスヘッダー解析</li>
                  <li>セキュリティヘッダーの確認</li>
                  <li>キャッシュ制御設定の確認</li>
                  <li>サーバー情報の表示</li>
                  <li>クライアント（ブラウザ）情報の表示</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Webサイトのセキュリティ設定確認</li>
                  <li>パフォーマンス最適化の調査</li>
                  <li>API応答の確認</li>
                  <li>CORS設定の確認</li>
                  <li>Web開発・運用でのデバッグ</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>CORS制限により、一部のヘッダー情報が取得できない場合があります</li>
                  <li>ブラウザのセキュリティ設定により制限される場合があります</li>
                  <li>すべてのWebサイトが解析できるとは限りません</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}