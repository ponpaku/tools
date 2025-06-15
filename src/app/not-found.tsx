'use client'

import { Home, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppLayout } from '@/components/layout/app-layout'

export default function NotFound() {
  // 人気ツールの提案
  const suggestedTools = [
    { name: '文字数カウンター', path: '/tools/character-counter', icon: '📝', description: 'テキストの文字数や行数をリアルタイムでカウント' },
    { name: 'Base64エンコード・デコード', path: '/tools/base64', icon: '🔒', description: 'テキストやファイルのBase64変換' },
    { name: 'QRコード生成器', path: '/tools/qr-generator', icon: '📱', description: 'テキストやURLからQRコードを生成' },
    { name: 'JSON整形・圧縮', path: '/tools/json-formatter', icon: '{}', description: 'JSONデータの整形と圧縮' }
  ]

  return (
    <AppLayout showCard={false}>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 404エラー表示 */}
          <div className="space-y-4">
            <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ページが見つかりません
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              お探しのページは移動または削除された可能性があります。
              <br />
              URLが正しいかご確認いただくか、下記のオプションをお試しください。
            </p>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/">
              <Button size="lg" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                ホームに戻る
              </Button>
            </Link>
            <Link href="/" onClick={() => {
              // ホームページの検索バーにフォーカスを当てる
              setTimeout(() => {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                }
              }, 100);
            }}>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                ツールを検索
              </Button>
            </Link>
          </div>

          {/* 人気ツールの提案 */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-xl">⭐</div>
              <h2 className="text-xl font-semibold text-gray-900">人気ツールを試してみませんか？</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {suggestedTools.map((tool, index) => (
                <Link key={index} href={tool.path}>
                  <Card className="h-full hover:shadow-lg hover:shadow-blue-100 transition-all duration-200 cursor-pointer group border-l-4 border-l-blue-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{tool.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-blue-600 transition-colors text-base">
                            {tool.name}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* ヘルプ情報 */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    お探しのツールが見つからない場合
                  </h3>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• URLのスペルや形式をご確認ください</li>
                    <li>• ホームページの検索機能をご利用ください</li>
                    <li>• カテゴリ別ツール一覧からお探しください</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}