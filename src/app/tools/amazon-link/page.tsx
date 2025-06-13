'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AmazonLinkPage() {
  const [inputUrl, setInputUrl] = useState('')
  const [associateTag, setAssociateTag] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [productInfo, setProductInfo] = useState<{
    asin: string
    title: string
    domain: string
  } | null>(null)

  const extractASIN = (url: string): string | null => {
    // Amazon商品URLからASINを抽出する正規表現パターン
    const patterns = [
      /\/dp\/([A-Z0-9]{10})/i,
      /\/gp\/product\/([A-Z0-9]{10})/i,
      /\/product\/([A-Z0-9]{10})/i,
      /\/ASIN\/([A-Z0-9]{10})/i,
      /[?&]ASIN=([A-Z0-9]{10})/i
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return 'amazon.co.jp'
    }
  }

  const generateShortUrl = () => {
    if (!inputUrl.trim()) {
      alert('AmazonのURLを入力してください')
      return
    }

    const asin = extractASIN(inputUrl)
    if (!asin) {
      alert('有効なAmazon商品URLを入力してください')
      return
    }

    const domain = getDomain(inputUrl)
    let baseUrl = `https://${domain}/dp/${asin}`
    
    // アソシエイトタグを追加
    if (associateTag.trim()) {
      baseUrl += `?tag=${associateTag.trim()}`
    }

    setShortUrl(baseUrl)
    
    // 商品情報を設定（実際の商品タイトルは取得できないため、ASINのみ）
    setProductInfo({
      asin,
      title: `商品 ${asin}`,
      domain
    })
  }

  const clearAll = () => {
    setInputUrl('')
    setShortUrl('')
    setProductInfo(null)
  }

  const examples = [
    {
      name: '通常の商品ページ',
      url: 'https://www.amazon.co.jp/dp/B08N5WRWNW?ref=sr_1_1&keywords=example'
    },
    {
      name: 'パラメータ付きURL',
      url: 'https://www.amazon.co.jp/gp/product/B08N5WRWNW?psc=1&ref_=d6k_applink_bb_marketplace'
    },
    {
      name: 'Amazon.com (US)',
      url: 'https://www.amazon.com/dp/B08N5WRWNW?ref=sr_1_1'
    }
  ]

  return (
    <ToolLayout
      title="Amazonリンク短縮ツール"
      description="AmazonのURLを短縮し、不要なパラメータを削除します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">AmazonのURL</label>
          <Textarea
            placeholder="AmazonのURLを入力してください..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            アソシエイトタグ（任意）
          </label>
          <Input
            value={associateTag}
            onChange={(e) => setAssociateTag(e.target.value)}
            placeholder="例: your-associate-tag-21"
          />
          <p className="text-sm text-gray-600 mt-1">
            Amazonアソシエイトプログラムのタグを入力すると、短縮URLに自動で追加されます
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateShortUrl} className="flex-1" disabled={!inputUrl.trim()}>
            短縮URL生成
          </Button>
          <Button onClick={clearAll} variant="outline">
            クリア
          </Button>
        </div>

        {shortUrl && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>短縮されたURL</CardTitle>
                <CopyButton text={shortUrl} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-mono text-sm break-all text-green-800">
                    {shortUrl}
                  </p>
                </div>
                
                {productInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">ASIN:</span>
                      <p className="font-mono">{productInfo.asin}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ドメイン:</span>
                      <p className="font-mono">{productInfo.domain}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">URL短縮率:</span>
                      <p>
                        {Math.round((1 - shortUrl.length / inputUrl.length) * 100)}% 短縮
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{example.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputUrl(example.url)}
                    >
                      使用
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-600 mb-1">元のURL:</p>
                    <p className="font-mono text-xs break-all">{example.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>機能と特徴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">URLの短縮</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>不要なパラメータ（ref、keywords等）を自動削除</li>
                  <li>ASINを基にした最短形式のURLを生成</li>
                  <li>元のURLの機能は完全に保持</li>
                  <li>様々なAmazonドメイン（.co.jp、.com等）に対応</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">ASINについて</h4>
                <p>
                  ASIN（Amazon Standard Identification Number）は、Amazonが各商品に割り当てる
                  10桁の英数字識別子です。この番号があれば、商品ページに直接アクセスできます。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">アソシエイトプログラム</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Amazonアソシエイトのタグを自動で追加</li>
                  <li>アフィリエイト収益の適切な追跡が可能</li>
                  <li>タグは末尾に追加され、元の機能に影響なし</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">活用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>SNSでの商品シェア</li>
                  <li>ブログやWebサイトでの商品紹介</li>
                  <li>メールやメッセージでの商品共有</li>
                  <li>QRコード生成用の短いURL作成</li>
                  <li>アフィリエイトリンクの管理</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                  <li>アソシエイトプログラムを利用する場合は、適切な開示が必要です</li>
                  <li>このツールはURL短縮のみ行い、商品情報は取得しません</li>
                  <li>生成されたURLの有効性は元のURLに依存します</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}