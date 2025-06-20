import Link from 'next/link'
import { Heart, Shield, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900">ぽんぱくツール</h3>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              日常業務を効率化する便利なオンラインツールボックス。
              ブラウザ上で完全無料で利用できる実用的なツールを提供しています。
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>すべての処理はブラウザ内で実行され、データは外部に送信されません</span>
            </div>
          </div>

          {/* ツールカテゴリ */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">主要ツール</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/tools/character-counter" className="text-gray-600 hover:text-blue-600 transition-colors">
                文字数カウント
              </Link>
              <Link href="/tools/base64" className="text-gray-600 hover:text-blue-600 transition-colors">
                Base64変換
              </Link>
              <Link href="/tools/qr-generator" className="text-gray-600 hover:text-blue-600 transition-colors">
                QRコード生成
              </Link>
              <Link href="/tools/json-formatter" className="text-gray-600 hover:text-blue-600 transition-colors">
                JSON整形
              </Link>
              <Link href="/tools/hash-generator" className="text-gray-600 hover:text-blue-600 transition-colors">
                ハッシュ生成
              </Link>
              <Link href="/tools/full-half-converter" className="text-gray-600 hover:text-blue-600 transition-colors">
                全角半角変換
              </Link>
            </div>
          </div>

          {/* サイト情報・リンク */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">サイト情報</h4>
            <div className="space-y-2 text-sm">
              <Link 
                href="/privacy" 
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Shield className="h-3 w-3" />
                <span>プライバシーポリシー</span>
              </Link>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-3 w-3" />
                <span>お問い合わせ: tools.ponpaku.com</span>
              </div>
              <Link 
                href="https://note.com/ponpaku" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>作者について</span>
              </Link>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} ぽんぱくツール. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Made with ❤️ for developers & creators</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}