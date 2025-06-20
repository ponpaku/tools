import type { Metadata } from 'next'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Info, Mail, Calendar, ExternalLink } from 'lucide-react'
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo-config'

export function generateMetadata(): Metadata {
  return generateToolMetadata('privacy', '/privacy')
}

export default function PrivacyPage() {
  const structuredData = generateToolStructuredData('privacy', '/privacy')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <AppLayout 
        title="プライバシーポリシー" 
        description="個人情報の取り扱いについて"
        showCard={false}
      >
        <div className="max-w-4xl mx-auto space-y-8">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-xl">プライバシーポリシー</CardTitle>
            </div>
            <CardDescription>
              ぽんぱくツール（以下「当サイト」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>最終更新日: 2025年6月20日</span>
            </div>
          </CardContent>
        </Card>

        {/* 個人情報の定義 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>1. 個人情報の定義</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              本プライバシーポリシーにおいて「個人情報」とは、個人情報保護法に定める「個人情報」を指すものとし、生存する個人に関する情報であって、氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報を指します。
            </p>
          </CardContent>
        </Card>

        {/* 個人情報の収集方法 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>2. 個人情報の収集方法</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">直接的な収集</Badge>
                <p className="text-gray-700 leading-relaxed">
                  当サイトでは、原則として利用者が直接個人情報を入力することはありません。原則すべてのツールはブラウザ上で動作し、入力されたデータは利用者の端末内で処理され、外部サーバーには送信されません。
                </p>
              </div>
              
              <div>
                <Badge variant="outline" className="mb-2">間接的な収集</Badge>
                <p className="text-gray-700 leading-relaxed">
                  当サイトでは、Google Analytics、Google AdSenseなどのサービスを通じて、以下の情報を自動的に収集する場合があります：
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 ml-4">
                  <li>IPアドレス</li>
                  <li>ブラウザの種類・バージョン</li>
                  <li>オペレーティングシステム</li>
                  <li>アクセス日時</li>
                  <li>閲覧ページ</li>
                  <li>リファラー情報</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 個人情報の利用目的 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>3. 個人情報の利用目的</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              当サイトで収集した個人情報は、以下の目的で利用します：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>サイトの利用状況の分析・改善</li>
              <li>適切な広告の配信</li>
              <li>サイトの安全性・セキュリティの向上</li>
              <li>利用者の利便性向上のためのサービス改善</li>
              <li>法令に基づく対応</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookieについて */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>4. Cookieについて</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                当サイトでは、利用者の利便性向上のためCookieを使用しています。Cookieとは、ウェブサイトが利用者のコンピュータに送信する小さなテキストファイルです。
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cookieの用途：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>サイトの利用状況の分析</li>
                  <li>広告の配信・効果測定</li>
                  <li>利用者の設定やお気に入りツールの保存</li>
                  <li>サイトの機能向上</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cookieの無効化：</h4>
                <p className="text-gray-700 leading-relaxed">
                  利用者はブラウザの設定によりCookieを無効にすることができます。ただし、Cookieを無効にした場合、当サイトの一部機能が正常に動作しない可能性があります。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 第三者サービスについて */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>5. 第三者サービスについて</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Google Analytics</span>
                </h4>
                <p className="text-gray-700 leading-relaxed mb-2">
                  当サイトでは、Googleが提供するウェブ解析サービス「Google Analytics」を使用しています。このサービスはウェブサイトの利用状況を分析するためにCookieを使用します。
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  詳細については、<a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー</a>をご確認ください。
                </p>
              </div>
              
              <hr className="border-gray-200" />
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Google AdSense</span>
                </h4>
                <p className="text-gray-700 leading-relaxed mb-2">
                  当サイトでは、Googleが提供する広告配信サービス「Google AdSense」を使用しています。このサービスは利用者の興味に応じた広告を表示するためにCookieを使用します。
                </p>
                <p className="text-gray-700 leading-relaxed text-sm mb-2">
                  詳細については、<a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Googleの広告に関するポリシー</a>をご確認ください。
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  パーソナライズド広告を無効にするには、<a href="https://adssettings.google.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google広告設定ページ</a>から設定を変更できます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 個人情報の第三者提供 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>7. 個人情報の第三者提供</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              当サイトでは、以下の場合を除き、個人情報を第三者に提供することはありません：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
            </ul>
          </CardContent>
        </Card>

        {/* お問い合わせ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>8. お問い合わせ</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              本プライバシーポリシーに関するお問い合わせは、以下の方法でお受けしています：
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                メールアドレス: <a href="mailto:web.ponpaku@gmail.com" className="text-blue-600 hover:underline">web.ponpaku@gmail.com</a>
              </p>
              <p className="text-gray-700 text-sm mt-2">
                ※ お問い合わせの際は、件名に「プライバシーポリシーについて」と明記してください。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* プライバシーポリシーの変更 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>9. プライバシーポリシーの変更</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、本プライバシーポリシーの内容を適宜見直し、その改善に努めます。修正された最新のプライバシーポリシーは常に本ページにて開示されます。
            </p>
          </CardContent>
        </Card>

        {/* 免責事項 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>10. 免責事項</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
              </p>
              <p className="text-gray-700 leading-relaxed">
                当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。
              </p>
              <p className="text-gray-700 leading-relaxed">
                当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 著作権について */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>11. 著作権について</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              当サイトで掲載している文章や画像などにつきましては、無断転載することを禁止します。
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              当サイトは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、お問い合わせフォームよりご連絡ください。迅速に対応いたします。
            </p>
          </CardContent>
        </Card>
        </div>
      </AppLayout>
    </>
  )
}