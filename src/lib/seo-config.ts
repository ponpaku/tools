import { Metadata } from 'next'

export interface ToolSEOConfig {
  title: string
  description: string
  keywords: string[]
  competitorKeywords: string[]
  category: string
  schemaType?: string
}

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    type: 'website'
    locale: 'ja_JP'
    url: string
    siteName: string
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
  }
  alternates: {
    canonical: string
  }
}

// カテゴリ別競合キーワード
export const competitorKeywords = {
  text: [
    '文字数カウント', '文字数計測', '文字数チェッカー', '字数カウンター', 
    'numMoji', 'RAKKOTOOLS', 'oh-benri-tools', '文字数制限', '文字数確認',
    'すぐ使える', 'リアルタイム', 'オンライン文字数'
  ],
  encoding: [
    'Base64エンコード', 'Base64デコード', 'Base64変換', 'BASE64ツール',
    'エン・ＰＣサービス', 'トメイト', 'RAKKOTOOLS', 'CodeTool', 'ツールタロウ',
    'エンコーディング', 'デコーディング', 'オンライン変換'
  ],
  datetime: [
    '年齢計算', '満年齢', '和暦変換', '西暦変換', 'Unixタイム', 'タイムスタンプ',
    '日付計算', '曜日計算', '法要計算', '日付ツール', 'カレンダー計算'
  ],
  dev: [
    'JSON整形', 'JSONフォーマッター', 'JSON Beautifier', 'JSON構文チェック',
    'JSONきれい', 'OneEngineer', 'RAKKOTOOLS', 'Web ToolBox',
    'cron設定', 'cronジェネレータ', 'UUID生成', '開発者ツール'
  ],
  generator: [
    'QRコード生成', 'QRコード作成', '二次元コード生成', 'QRのススメ',
    'Adobe Express', 'Canva', 'クルクル マネージャー',
    'ランダム文字列', 'パスワード生成', 'トークン生成'
  ],
  games: [
    'ビンゴ', 'ルーレット', 'スコアボード', 'ゲームツール',
    'レクリエーション', 'イベント', '抽選', '点数管理'
  ],
  utility: [
    'Amazonリンク', 'URL短縮', 'IPアドレス', 'EXIF確認', 
    '転送速度', '電子レンジ時間', 'ユーティリティ', 'オンラインツール'
  ]
}

// ツール固有のSEO設定
export const toolSEOConfigs: Record<string, ToolSEOConfig> = {
  'character-counter': {
    title: '文字数カウント・文字数計測ツール【無料・高速・日本語対応】',
    description: '文字数、行数、バイト数を瞬時に計測できる無料ツール。ひらがな・カタカナ・漢字の文字種別統計も表示。原稿執筆、SNS投稿、レポート作成に最適。numMojiやRakkoToolsの代替として使える高機能な文字数カウンター。',
    keywords: [
      '文字数カウント', '文字数計測', '文字数チェッカー', '字数カウンター',
      'numMoji', 'RAKKOTOOLS', 'oh-benri-tools', '文字数制限', '文字数確認',
      'ひらがな', 'カタカナ', '漢字', 'バイト数', '行数', '単語数', '段落数',
      '原稿', 'SNS', 'Twitter', 'レポート', '無料', 'オンライン', 'リアルタイム'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text',
    schemaType: 'WebApplication'
  },
  'full-half-converter': {
    title: '全角半角変換ツール【無料・瞬時変換・日本語特化】',
    description: '全角・半角文字を瞬時に相互変換できる無料ツール。英数字、カタカナ、記号に対応。データ入力、フォーム入力、文書整形に最適。文字数カウント機能付き。',
    keywords: [
      '全角半角変換', '全角変換', '半角変換', '文字変換',
      'カタカナ変換', '英数字変換', '記号変換', 'データ入力',
      'フォーム入力', '文書整形', '無料', 'オンライン', 'リアルタイム'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'case-converter': {
    title: '大文字小文字変換ツール【無料・英語対応・高速変換】',
    description: '英字の大文字・小文字を瞬時に変換できる無料ツール。UPPER CASE、lower case、Title Case、camelCase、snake_case、kebab-caseに対応。プログラミング、文書作成に最適。',
    keywords: [
      '大文字小文字変換', '英字変換', 'UPPER CASE', 'lower case', 'Title Case',
      'camelCase', 'snake_case', 'kebab-case', 'プログラミング', '文書作成',
      '無料', 'オンライン', 'リアルタイム', '英語変換'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'line-remover': {
    title: '改行削除ツール【無料・テキスト整形・一括変換】',
    description: '改行を削除してテキストを一行にまとめる無料ツール。コピペ作業、データ整形、プログラムコード整理に最適。複数行を瞬時に連結可能。',
    keywords: [
      '改行削除', '改行除去', 'テキスト整形', '改行変換', 'テキスト連結',
      'コピペ', 'データ整形', 'プログラムコード', '一行変換', 'テキスト処理',
      '無料', 'オンライン', 'リアルタイム', '文字列処理'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'duplicate-highlighter': {
    title: '重複行ハイライトツール【無料・重複検出・データ整理】',
    description: '重複した行を瞬時に検出・ハイライト表示する無料ツール。データクリーニング、リスト整理、重複チェックに最適。CSV、リスト、テキストファイルの重複削除に便利。',
    keywords: [
      '重複行', '重複検出', '重複チェック', 'ハイライト', 'データクリーニング',
      'リスト整理', '重複削除', 'CSV', 'テキストファイル', 'データ整理',
      '無料', 'オンライン', 'リアルタイム', '文字列処理'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'diff-tool': {
    title: 'diffツール・テキスト比較【無料・差分表示・高精度】',
    description: '2つのテキストの差分を詳細に比較表示する無料ツール。コードレビュー、文書比較、バージョン管理に最適。行単位・文字単位での差分を色分け表示。',
    keywords: [
      'diff', 'テキスト比較', '差分', '比較ツール', 'コードレビュー',
      '文書比較', 'バージョン管理', '差分表示', 'テキスト差分', 'ファイル比較',
      '無料', 'オンライン', 'リアルタイム', '開発者ツール'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'kanji-converter': {
    title: '漢数字変換ツール【無料・日本語数字・和文変換】',
    description: '漢数字とアラビア数字を相互変換する無料ツール。和文書作成、契約書、領収書、日本語文書の数字表記に最適。一、十、百、千、万の単位に対応。',
    keywords: [
      '漢数字変換', '数字変換', 'アラビア数字', '和数字', '漢字数字',
      '和文書', '契約書', '領収書', '日本語文書', '数字表記',
      '一十百千万', '数字読み', '無料', 'オンライン', 'リアルタイム'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'base64': {
    title: 'Base64エンコード・デコードツール【無料・高速・安全】',
    description: 'Base64形式のエンコード・デコードを瞬時に実行する無料ツール。メール添付、Data URI、API認証トークンに最適。エン・ＰＣサービス、トメイト、RAKKOTOOLSの代替として使える高機能Base64変換ツール。',
    keywords: [
      'Base64エンコード', 'Base64デコード', 'Base64変換', 'BASE64ツール',
      'エン・ＰＣサービス', 'トメイト', 'RAKKOTOOLS', 'CodeTool', 'ツールタロウ',
      'エンコーディング', 'デコーディング', 'メール添付', 'Data URI', 'API認証',
      'バイナリデータ', '文字コード', '無料', 'オンライン', 'リアルタイム'
    ],
    competitorKeywords: competitorKeywords.encoding,
    category: 'encoding'
  },
  'url-encoder': {
    title: 'URLエンコード・デコードツール【無料・パーセントエンコーディング】',
    description: 'URLエンコード・デコードを瞬時に実行する無料ツール。パーセントエンコーディング、日本語URL、クエリパラメータに対応。Web開発、API構築に最適。',
    keywords: [
      'URLエンコード', 'URLデコード', 'パーセントエンコーディング', 'URL変換',
      '日本語URL', 'クエリパラメータ', 'Web開発', 'API構築', 'パラメータ処理',
      'RFC3986', 'UTF-8', '無料', 'オンライン', 'リアルタイム', 'エンコーディング'
    ],
    competitorKeywords: competitorKeywords.encoding,
    category: 'encoding'
  },
  'hash-generator': {
    title: 'ハッシュ生成ツール【MD5・SHA-1・SHA-256・無料】',
    description: 'MD5、SHA-1、SHA-256ハッシュを瞬時に生成する無料ツール。パスワード暗号化、ファイル整合性チェック、セキュリティ検証に最適。暗号化ハッシュ関数の生成が簡単。',
    keywords: [
      'ハッシュ生成', 'MD5', 'SHA-1', 'SHA-256', 'ハッシュ関数',
      'パスワード暗号化', 'ファイル整合性', 'セキュリティ検証', '暗号化',
      'チェックサム', 'ダイジェスト', 'セキュリティ', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.encoding,
    category: 'encoding'
  },
  // 日付・時間ツール
  'age-calculator': {
    title: '満年齢計算機【無料・正確・生年月日から自動計算】',
    description: '生年月日から満年齢を正確に計算する無料ツール。年・月・日単位での詳細表示、和暦対応。誕生日計算、年齢確認、履歴書・申込書記入に最適。',
    keywords: [
      '満年齢計算', '年齢計算', '生年月日', '誕生日計算', '年齢確認',
      '履歴書', '申込書', '和暦', '年齢算出', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.datetime,
    category: 'datetime'
  },
  'japanese-calendar': {
    title: '和暦西暦変換ツール【昭和・平成・令和・元号対応】',
    description: '和暦と西暦を相互変換する無料ツール。昭和・平成・令和の元号に完全対応。履歴書、公的文書、契約書作成に最適。',
    keywords: [
      '和暦変換', '西暦変換', '元号', '昭和', '平成', '令和',
      '履歴書', '公的文書', '契約書', '日本の暦', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.datetime,
    category: 'datetime'
  },
  'unix-time': {
    title: 'Unixタイムスタンプ変換ツール【無料・高精度・開発者向け】',
    description: 'Unixタイムスタンプと日時を相互変換する無料ツール。プログラミング、API開発、データベース管理に最適。ミリ秒対応・タイムゾーン考慮。',
    keywords: [
      'Unixタイム', 'タイムスタンプ', 'エポック時間', 'プログラミング', 'API開発',
      'データベース', 'ミリ秒', 'タイムゾーン', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.datetime,
    category: 'datetime'
  },
  'weekday-list': {
    title: '曜日リスト化ツール【指定曜日の日付一覧・カレンダー生成】',
    description: '指定した曜日の日付リストを自動生成する無料ツール。定例会議、スケジュール管理、カレンダー作成に最適。CSV出力対応。',
    keywords: [
      '曜日リスト', '日付一覧', 'カレンダー生成', 'スケジュール管理', '定例会議',
      'CSV出力', '日程調整', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.datetime,
    category: 'datetime'
  },
  'memorial-calculator': {
    title: '法要計算機【四十九日・一周忌・三回忌・法事日程計算】',
    description: '法要の日程を正確に計算する無料ツール。四十九日、一周忌、三回忌などの法事日程を自動算出。仏教式・神式対応。',
    keywords: [
      '法要計算', '四十九日', '一周忌', '三回忌', '法事日程',
      '仏教', '神式', '供養', '年忌法要', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.datetime,
    category: 'datetime'
  },
  // 開発者ツール
  'json-formatter': {
    title: 'JSON整形・フォーマッターツール【無料・構文チェック・圧縮】',
    description: 'JSONデータの整形・圧縮・構文チェックを行う無料ツール。プログラミング、API開発、デバッグに最適。エラー検出・修正機能付き。',
    keywords: [
      'JSON整形', 'JSONフォーマッター', 'JSON圧縮', '構文チェック', 'プログラミング',
      'API開発', 'デバッグ', 'エラー検出', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'json-yaml': {
    title: 'JSON・YAML変換ツール【相互変換・フォーマット変換】',
    description: 'JSONとYAMLを相互変換する無料ツール。設定ファイル変換、API設計、DevOpsに最適。構文チェック・整形機能付き。',
    keywords: [
      'JSON変換', 'YAML変換', '相互変換', '設定ファイル', 'API設計',
      'DevOps', '構文チェック', '整形', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'cron-generator': {
    title: 'cronジェネレーター【cron式生成・スケジュール設定】',
    description: 'cron式を簡単に生成する無料ツール。サーバー管理、タスクスケジューリング、自動化に最適。視覚的な設定インターフェース。',
    keywords: [
      'cronジェネレーター', 'cron式', 'スケジューリング', 'サーバー管理', '自動化',
      'タスク実行', 'Linux', 'Unix', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'cron-parser': {
    title: 'cronパーサー【cron式解析・実行時間確認】',
    description: 'cron式を解析して実行時間を確認する無料ツール。サーバー運用、バッチ処理、スケジュール確認に最適。',
    keywords: [
      'cronパーサー', 'cron解析', '実行時間', 'サーバー運用', 'バッチ処理',
      'スケジュール確認', 'システム管理', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'uuid-generator': {
    title: 'UUID生成ツール【v1・v4・ユニークID生成】',
    description: 'UUID v1、v4を生成する無料ツール。プログラミング、データベース設計、API開発に最適。一意識別子の大量生成対応。',
    keywords: [
      'UUID生成', 'ユニークID', 'v1', 'v4', 'プログラミング',
      'データベース', 'API開発', '一意識別子', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'number-base-converter': {
    title: '進数変換ツール【2進数・8進数・10進数・16進数】無料',
    description: '2進数、8進数、10進数、16進数の相互変換を瞬時に実行する無料ツール。プログラミング、計算機科学、デジタル回路設計に最適。',
    keywords: [
      '進数変換', '2進数', '8進数', '10進数', '16進数', 'Binary', 'Octal', 'Decimal', 'Hexadecimal',
      'プログラミング', '計算機科学', 'デジタル回路', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev'
  },
  'qr-generator': {
    title: 'QRコード生成ツール【無料・高品質・カスタマイズ対応】',
    description: 'テキスト・URL・連絡先情報から高品質なQRコードを無料生成。サイズ調整、エラー訂正レベル設定対応。印刷・デジタル利用に最適。',
    keywords: [
      'QRコード生成', 'QRコード作成', '二次元コード生成', 'QRのススメ',
      'Adobe Express', 'Canva', 'クルクル マネージャー', 'QRコード無料',
      'URL QRコード', '連絡先 QRコード', 'テキスト QRコード', '高品質', 'カスタマイズ'
    ],
    competitorKeywords: competitorKeywords.generator,
    category: 'generator',
    schemaType: 'WebApplication'
  }
}

// generateMetadata関数用のヘルパー
export function generateToolMetadata(
  toolId: string, 
  path: string, 
  siteUrl: string = 'https://tools.ponpaku.com'
): Metadata {
  const config = toolSEOConfigs[toolId]
  
  if (!config) {
    throw new Error(`SEO config not found for tool: ${toolId}`)
  }

  const url = `${siteUrl}${path}`
  const ogImageUrl = `${siteUrl}/og-tools/${toolId}.png`
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      locale: 'ja_JP',
      url,
      siteName: 'ぽんぱくツール',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title.length > 55 ? config.title.substring(0, 55) + '...' : config.title,
      description: config.description.length > 200 ? config.description.substring(0, 200) + '...' : config.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'theme-color': '#3b82f6',
    },
  }
}

// 構造化データ生成ヘルパー
export function generateToolStructuredData(
  toolId: string, 
  path: string, 
  siteUrl: string = 'https://tools.ponpaku.com'
) {
  const config = toolSEOConfigs[toolId]
  
  if (!config) {
    throw new Error(`SEO config not found for tool: ${toolId}`)
  }

  const url = `${siteUrl}${path}`
  
  return {
    "@context": "https://schema.org",
    "@type": config.schemaType || "WebApplication",
    "name": config.title,
    "description": config.description,
    "url": url,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "ぽんぱく",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization", 
      "name": "ぽんぱく",
      "url": siteUrl
    },
    "inLanguage": "ja",
    "keywords": config.keywords.join(", "),
    "audience": {
      "@type": "Audience",
      "audienceType": "一般ユーザー"
    }
  }
}