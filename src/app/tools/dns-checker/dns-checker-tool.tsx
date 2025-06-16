'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Server, Shield, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react'

interface DnsRecord {
  name: string
  type: string
  value: string
  ttl?: number
  priority?: number
}

interface DnsResult {
  domain: string
  recordType: string
  records: DnsRecord[]
  timestamp: string
  status: 'success' | 'error' | 'no-records'
  message?: string
}

const DNS_RECORD_TYPES = [
  { value: 'A', label: 'A - IPv4アドレス' },
  { value: 'AAAA', label: 'AAAA - IPv6アドレス' },
  { value: 'CNAME', label: 'CNAME - 正規名' },
  { value: 'MX', label: 'MX - メール交換' },
  { value: 'TXT', label: 'TXT - テキスト' },
  { value: 'NS', label: 'NS - ネームサーバー' },
  { value: 'PTR', label: 'PTR - 逆引き' },
  { value: 'SOA', label: 'SOA - 権威開始' },
  { value: 'SRV', label: 'SRV - サービス' }
]

export default function DnsCheckerTool() {
  const [domain, setDomain] = useState('')
  const [recordType, setRecordType] = useState('A')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DnsResult[]>([])
  const [error, setError] = useState('')

  const checkDns = async () => {
    if (!domain.trim()) {
      setError('ドメイン名を入力してください')
      return
    }

    // ドメイン名の簡単な検証
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(domain)) {
      setError('有効なドメイン名を入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      // ブラウザ環境では直接DNSクエリを実行できないため、
      // 代替手段として公開DNSサービスのAPIを使用します
      const result = await queryDnsUsingDoH(domain, recordType)
      
      const newResult: DnsResult = {
        domain,
        recordType,
        records: result.records,
        timestamp: new Date().toISOString(),
        status: result.records.length > 0 ? 'success' : 'no-records',
        message: result.message
      }

      setResults(prev => [newResult, ...prev.slice(0, 4)]) // 最新5件を保持

    } catch (err) {
      setError(`DNS検索エラー: ${err instanceof Error ? err.message : '不明なエラー'}`)
    } finally {
      setLoading(false)
    }
  }

  // DNS over HTTPS (DoH) を使用したDNSクエリ
  const queryDnsUsingDoH = async (domain: string, type: string) => {
    try {
      // Cloudflare DNS over HTTPS を使用
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        {
          headers: {
            'Accept': 'application/dns-json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`DNS query failed: ${response.status}`)
      }

      const data = await response.json()
      
      const records: DnsRecord[] = []
      
      if (data.Answer && data.Answer.length > 0) {
        data.Answer.forEach((answer: any) => {
          records.push({
            name: answer.name || domain,
            type: getRecordTypeName(answer.type),
            value: answer.data,
            ttl: answer.TTL
          })
        })
      }

      return {
        records,
        message: records.length === 0 ? 'レコードが見つかりませんでした' : undefined
      }

    } catch (error) {
      // フォールバック: シンプルな検証のみ
      return {
        records: [],
        message: 'DNS検索に失敗しました。ネットワーク接続を確認してください。'
      }
    }
  }

  const getRecordTypeName = (typeNum: number): string => {
    const types: Record<number, string> = {
      1: 'A',
      28: 'AAAA',
      5: 'CNAME',
      15: 'MX',
      16: 'TXT',
      2: 'NS',
      12: 'PTR',
      6: 'SOA',
      33: 'SRV'
    }
    return types[typeNum] || 'OTHER'
  }

  const getRecordIcon = (type: string) => {
    const icons: Record<string, any> = {
      'A': Globe,
      'AAAA': Globe,
      'CNAME': Server,
      'MX': Shield,
      'TXT': AlertCircle,
      'NS': Server,
      'PTR': Search,
      'SOA': CheckCircle,
      'SRV': Server
    }
    return icons[type] || Globe
  }

  const getRecordColor = (type: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-100 text-blue-800',
      'AAAA': 'bg-indigo-100 text-indigo-800',
      'CNAME': 'bg-green-100 text-green-800',
      'MX': 'bg-purple-100 text-purple-800',
      'TXT': 'bg-yellow-100 text-yellow-800',
      'NS': 'bg-red-100 text-red-800',
      'PTR': 'bg-gray-100 text-gray-800',
      'SOA': 'bg-orange-100 text-orange-800',
      'SRV': 'bg-pink-100 text-pink-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const commonDomains = [
    'google.com',
    'github.com',
    'cloudflare.com',
    'example.com'
  ]

  const formatRecords = (records: DnsRecord[]) => {
    return records.map(r => `${r.name} ${r.type} ${r.value}${r.ttl ? ` (TTL: ${r.ttl})` : ''}`).join('\n')
  }

  const checkAllRecords = async () => {
    if (!domain.trim()) {
      setError('ドメイン名を入力してください')
      return
    }

    setLoading(true)
    setError('')

    const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']
    const allResults: DnsResult[] = []

    for (const type of recordTypes) {
      try {
        const result = await queryDnsUsingDoH(domain, type)
        if (result.records.length > 0) {
          allResults.push({
            domain,
            recordType: type,
            records: result.records,
            timestamp: new Date().toISOString(),
            status: 'success'
          })
        }
      } catch (err) {
        // エラーは無視して次のレコードタイプを試行
      }
    }

    if (allResults.length > 0) {
      setResults(prev => [...allResults, ...prev.slice(0, 10)])
    } else {
      setError('どのレコードタイプでも結果が見つかりませんでした')
    }

    setLoading(false)
  }

  return (
    <ToolLayout
      title="DNSレコードチェッカー"
      description="ドメインのDNSレコードを検索・確認するツール"
    >
      <div className="space-y-6">
        {/* 検索エリア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              DNS検索
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  ドメイン名 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkDns()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  レコードタイプ
                </label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DNS_RECORD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={checkDns} disabled={loading}>
                {loading ? '検索中...' : '検索'}
              </Button>
              <Button variant="outline" onClick={checkAllRecords} disabled={loading}>
                全タイプ検索
              </Button>
            </div>

            {/* サンプルドメイン */}
            <div>
              <div className="text-sm font-medium mb-2">サンプルドメイン</div>
              <div className="flex flex-wrap gap-2">
                {commonDomains.map((sampleDomain, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setDomain(sampleDomain)}
                  >
                    {sampleDomain}
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

        {/* 検索結果 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">検索結果</h3>
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={getRecordColor(result.recordType)}>
                        {result.recordType}
                      </Badge>
                      {result.domain}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {new Date(result.timestamp).toLocaleString('ja-JP')}
                      </div>
                      {result.records.length > 0 && (
                        <CopyButton text={formatRecords(result.records)} />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {result.status === 'success' && result.records.length > 0 ? (
                    <div className="space-y-3">
                      {result.records.map((record, recordIndex) => {
                        const Icon = getRecordIcon(record.type)
                        return (
                          <div
                            key={recordIndex}
                            className="p-3 bg-gray-50 rounded-lg flex items-start gap-3"
                          >
                            <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{record.name}</span>
                                <Badge variant="outline">{record.type}</Badge>
                                {record.ttl && (
                                  <Badge variant="secondary">TTL: {record.ttl}s</Badge>
                                )}
                              </div>
                              <div className="font-mono text-sm bg-white p-2 rounded border break-all">
                                {record.value}
                              </div>
                              {record.priority && (
                                <div className="text-xs text-gray-600 mt-1">
                                  優先度: {record.priority}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      {result.message || 'レコードが見つかりませんでした'}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              ドメイン名を入力して「検索」ボタンをクリックしてください
            </CardContent>
          </Card>
        )}

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>DNSレコードタイプについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <Badge className="bg-blue-100 text-blue-800 mb-1">A</Badge>
                  <p>IPv4アドレスを指定するレコード</p>
                </div>
                <div>
                  <Badge className="bg-indigo-100 text-indigo-800 mb-1">AAAA</Badge>
                  <p>IPv6アドレスを指定するレコード</p>
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-800 mb-1">CNAME</Badge>
                  <p>別のドメイン名への別名レコード</p>
                </div>
                <div>
                  <Badge className="bg-purple-100 text-purple-800 mb-1">MX</Badge>
                  <p>メールサーバーを指定するレコード</p>
                </div>
                <div>
                  <Badge className="bg-yellow-100 text-yellow-800 mb-1">TXT</Badge>
                  <p>テキスト情報を格納するレコード</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Badge className="bg-red-100 text-red-800 mb-1">NS</Badge>
                  <p>ネームサーバーを指定するレコード</p>
                </div>
                <div>
                  <Badge className="bg-gray-100 text-gray-800 mb-1">PTR</Badge>
                  <p>IPアドレスからドメイン名への逆引きレコード</p>
                </div>
                <div>
                  <Badge className="bg-orange-100 text-orange-800 mb-1">SOA</Badge>
                  <p>ゾーンの権威情報を示すレコード</p>
                </div>
                <div>
                  <Badge className="bg-pink-100 text-pink-800 mb-1">SRV</Badge>
                  <p>サービスの場所を指定するレコード</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>各種DNSレコードタイプの検索</li>
                  <li>複数レコードタイプの一括検索</li>
                  <li>TTL（Time To Live）情報の表示</li>
                  <li>検索履歴の保持</li>
                  <li>結果のコピー機能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ドメイン設定の確認</li>
                  <li>メールサーバー設定の調査</li>
                  <li>CDN・ロードバランサーの確認</li>
                  <li>DNS伝播の確認</li>
                  <li>セキュリティ設定（SPF、DKIM等）の確認</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">技術仕様</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>DNS over HTTPS (DoH) を使用</li>
                  <li>Cloudflare DNS (1.1.1.1) を利用</li>
                  <li>ブラウザからの安全なDNS検索</li>
                  <li>リアルタイムでの結果表示</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}