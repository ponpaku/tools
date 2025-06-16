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
  image: [
    '画像リサイズ', '画像圧縮', '画像変換', '画像加工', 'リサイズツール',
    'TinyPNG', 'Squoosh', 'iLoveIMG', 'Photopea', 'remove.bg',
    '画像最適化', 'ファビコン生成', 'QRコード読み取り', '画像処理'
  ],
  datetime: [
    '年齢計算', '満年齢', '和暦変換', '西暦変換', 'Unixタイム', 'タイムスタンプ',
    '日付計算', '曜日計算', '法要計算', '日付ツール', 'カレンダー計算'
  ],
  dev: [
    'JSON整形', 'JSONフォーマッター', 'JSON Beautifier', 'JSON構文チェック',
    'JSONきれい', 'OneEngineer', 'RAKKOTOOLS', 'Web ToolBox',
    'cron設定', 'cronジェネレータ', 'UUID生成', '開発者ツール',
    'DNS設定', 'DNSレコード', 'CIDR計算', 'サブネット計算'
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
  'line-break-converter': {
    title: '改行コード変換ツール【Windows・Unix・Mac対応・無料】',
    description: 'Windows・Unix・Mac間の改行コードを相互変換する無料ツール。CRLF・LF・CR形式に対応。ファイル転送、クロスプラットフォーム開発に最適。',
    keywords: [
      '改行コード変換', 'CRLF', 'LF', 'CR', 'Windows', 'Unix', 'Mac',
      'ファイル転送', 'クロスプラットフォーム', 'テキスト変換', '文字コード',
      '開発', 'プログラミング', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text'
  },
  'emoji-converter': {
    title: 'Emojiコード変換ツール【Unicode・HTML・CSS・JavaScript対応】',
    description: '絵文字とUnicodeコード・HTML Entity・CSS・JavaScript形式を相互変換。プログラミング、Web開発、文字コード処理に最適な無料ツール。',
    keywords: [
      'Emoji変換', '絵文字変換', 'Unicode', 'HTML Entity', 'CSS', 'JavaScript',
      '文字コード', 'プログラミング', 'Web開発', '絵文字コード',
      'エンコーディング', '無料', 'オンライン'
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
  'regex-tester': {
    title: '正規表現テスター【無料・カラーハイライト・マッチ検証】',
    description: '正規表現のテスト・検証を行う無料ツール。カラーハイライト付きでマッチ結果を視覚的に確認。プログラミング、文字列処理、データ検索に最適。',
    keywords: [
      '正規表現', 'regex', 'regexp', '正規表現テスター', 'マッチング',
      'パターンマッチ', 'プログラミング', '文字列処理', 'データ検索',
      'カラーハイライト', '検証', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'color-converter': {
    title: 'カラーコード変換ツール【HEX・RGB・HSL・HSV・CMYK】',
    description: 'HEX・RGB・HSL・HSV・CMYK形式の色変換を瞬時に実行。Web開発、デザイン、印刷物制作に最適な無料カラーコード変換ツール。',
    keywords: [
      'カラーコード', '色変換', 'HEX', 'RGB', 'HSL', 'HSV', 'CMYK',
      'Web開発', 'デザイン', '印刷', 'カラーパレット',
      '色彩', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'jwt-decoder': {
    title: 'JWT・PASETOデコーダ【無料・JSON Web Token解析】',
    description: 'JWT（JSON Web Token）とPASETOの解析・デコードを行う無料ツール。ヘッダー・ペイロード・署名を詳細表示。API開発、認証トークン検証に最適。',
    keywords: [
      'JWT', 'JSON Web Token', 'PASETO', 'デコード', 'トークン解析',
      'API開発', '認証', 'セキュリティ', 'ヘッダー', 'ペイロード',
      '署名検証', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'markdown-preview': {
    title: 'Markdownプレビューツール【無料・リアルタイム・変換】',
    description: 'Markdownテキストをリアルタイムでプレビュー・HTML変換する無料ツール。文書作成、GitHub、技術ドキュメント執筆に最適。',
    keywords: [
      'Markdown', 'マークダウン', 'プレビュー', 'HTML変換', 'リアルタイム',
      '文書作成', 'GitHub', '技術ドキュメント', 'テキスト', 'フォーマット',
      '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'http-header-viewer': {
    title: 'HTTPヘッダービューアー【無料・セキュリティ確認・Web解析】',
    description: 'WebサイトのHTTPレスポンスヘッダーとクライアント情報を詳細分析。セキュリティヘッダー、キャッシュ設定、サーバー情報を確認できる無料ツール。',
    keywords: [
      'HTTPヘッダー', 'レスポンスヘッダー', 'セキュリティヘッダー', 'Web解析',
      'CORS', 'CSP', 'HSTS', 'X-Frame-Options', 'キャッシュ制御',
      'サーバー情報', 'ブラウザ情報', 'デバッグ', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'dns-checker': {
    title: 'DNSレコードチェッカー【無料・高速・全タイプ対応】',
    description: 'ドメインのDNSレコード（A、AAAA、CNAME、MX、TXT、NS等）を高速検索・確認。DNS over HTTPSで安全に解析できる無料ツール。',
    keywords: [
      'DNS', 'DNSレコード', 'ドメイン確認', 'Aレコード', 'MXレコード',
      'CNAMEレコード', 'TXTレコード', 'NSレコード', 'DNS解析',
      'ドメイン設定', 'メールサーバー', 'ネームサーバー', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
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
  },
  'random-string': {
    title: 'ランダム文字列生成ツール【パスワード・トークン・無料】',
    description: 'セキュアなランダム文字列・パスワード・トークンを瞬時に生成。英数字・記号・長さ指定対応。セキュリティ、開発、テストに最適な無料ツール。',
    keywords: [
      'ランダム文字列', 'パスワード生成', 'トークン生成', 'セキュア',
      '英数字', '記号', 'セキュリティ', '開発', 'テスト',
      'API Key', '一意文字列', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.generator,
    category: 'generator',
    schemaType: 'WebApplication'
  },
  'loan-calculator': {
    title: 'ローン返済・利息計算機【住宅ローン・自動車ローン・無料】',
    description: '住宅ローン・自動車ローンの返済計画を詳細計算。元利均等・元金均等返済に対応。月々の返済額、総利息額を瞬時に算出する無料ツール。',
    keywords: [
      'ローン計算', '住宅ローン', '自動車ローン', '返済計算', '利息計算',
      '元利均等', '元金均等', '月返済額', '総利息', '返済計画',
      '金利計算', 'ローンシミュレーション', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'tax-calculator': {
    title: '税金計算機【所得税・住民税・社会保険料・手取り計算】',
    description: '年収から所得税・住民税・社会保険料を自動計算。配偶者控除・扶養控除対応。手取り収入と税負担率を詳細表示する無料ツール。',
    keywords: [
      '税金計算', '所得税', '住民税', '社会保険料', '手取り計算',
      '配偶者控除', '扶養控除', '税負担', '年収計算', '給与計算',
      '源泉徴収', '確定申告', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'statistics-calculator': {
    title: '統計計算機【平均・分散・標準偏差・基本統計量】',
    description: '数値データの基本統計量を自動計算。平均・中央値・分散・標準偏差・四分位数を瞬時に算出。データ分析・統計処理に最適な無料ツール。',
    keywords: [
      '統計計算', '基本統計量', '平均', '中央値', '分散', '標準偏差',
      '四分位数', 'データ分析', '統計処理', '数値解析',
      '記述統計', '統計学', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'fortune-generator': {
    title: '運勢・診断生成器【おみくじ・タロット・血液型占い】',
    description: 'おみくじ・タロット・血液型・動物占いをランダム生成。ラッキーアイテム・カラー・ナンバー付き。娯楽・話題作りに最適な無料占いツール。',
    keywords: [
      '運勢', '占い', 'おみくじ', 'タロット', '血液型占い', '動物占い',
      'ラッキーアイテム', 'ラッキーカラー', '診断', '娯楽',
      '話題作り', 'ランダム', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.generator,
    category: 'generator',
    schemaType: 'WebApplication'
  },
  // ユーティリティツール
  'fraction-percentage-converter': {
    title: '分数・小数・パーセント変換ツール【無料・相互変換】',
    description: '分数・小数・パーセントを瞬時に相互変換する無料ツール。数学、統計、教育、ビジネス計算に最適。約分・通分機能付き。',
    keywords: [
      '分数変換', '小数変換', 'パーセント変換', '相互変換', '約分',
      '通分', '数学', '統計', '教育', 'ビジネス計算',
      '割合計算', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'discount-calculator': {
    title: '商品値引き計算機【割引率・税込・ポイント還元】',
    description: '商品の割引率・税込価格・ポイント還元を含む総合価格計算ツール。セール価格、実質負担額を瞬時に算出する無料計算機。',
    keywords: [
      '値引き計算', '割引計算', '商品価格', 'セール価格', '税込価格',
      'ポイント還元', '実質負担額', 'ショッピング', '節約',
      '価格比較', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'unit-converter': {
    title: '単位変換ツール【長さ・重さ・温度・無料】',
    description: '長さ・重さ・温度の単位変換を瞬時に実行する無料ツール。メートル法・ヤード法・華氏・摂氏など多彩な単位に対応。',
    keywords: [
      '単位変換', '長さ変換', '重さ変換', '温度変換', 'メートル法',
      'ヤード法', '華氏', '摂氏', 'インチ', 'フィート',
      'キログラム', 'ポンド', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  'bmi-calculator': {
    title: 'BMI計算機【Body Mass Index・肥満度判定・無料】',
    description: '身長・体重からBMI（Body Mass Index）を計算し、肥満度を判定する無料ツール。健康管理、ダイエット、体重管理に最適。',
    keywords: [
      'BMI計算', 'Body Mass Index', '肥満度', '体重管理', 'ダイエット',
      '健康管理', '身長', '体重', '標準体重', '理想体重',
      'メタボ', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.utility,
    category: 'utility',
    schemaType: 'WebApplication'
  },
  // 画像処理ツール
  'image-resize': {
    title: '画像リサイズ・切り抜きツール【無料・高品質・Canvas処理】',
    description: '画像のリサイズと切り抜きを高品質で実行する無料ツール。サイズ変更、トリミング、縦横比維持に対応。Web用画像作成、SNS投稿、ブログ画像に最適。',
    keywords: [
      '画像リサイズ', '画像切り抜き', '画像サイズ変更', 'トリミング', '画像加工',
      'リサイズツール', 'Web画像', 'SNS画像', 'ブログ画像', '縦横比維持',
      '高品質', 'Canvas', '無料', 'オンライン', '画像編集'
    ],
    competitorKeywords: competitorKeywords.image,
    category: 'image',
    schemaType: 'WebApplication'
  },
  'image-compress': {
    title: '画像圧縮ツール【JPEG・PNG・WebP対応・無料】',
    description: 'JPEG・PNG・WebP画像のファイルサイズを効率的に圧縮する無料ツール。品質調整、一括圧縮、複数形式対応。Web最適化、ストレージ節約に最適。',
    keywords: [
      '画像圧縮', '画像最適化', 'JPEG圧縮', 'PNG圧縮', 'WebP圧縮',
      'ファイルサイズ削減', 'TinyPNG', 'Squoosh', 'iLoveIMG', 'Web最適化',
      'ストレージ節約', '品質調整', '一括圧縮', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.image,
    category: 'image',
    schemaType: 'WebApplication'
  },
  'image-convert': {
    title: '画像形式変換ツール【JPEG・PNG・WebP相互変換・無料】',
    description: 'JPEG・PNG・WebP間の画像形式を相互変換する無料ツール。透明度保持、品質調整、一括変換対応。Web用画像、印刷用画像の形式変更に最適。',
    keywords: [
      '画像形式変換', '画像変換', 'JPEG変換', 'PNG変換', 'WebP変換',
      '相互変換', '透明度保持', '品質調整', 'Web用画像', '印刷用画像',
      '一括変換', 'フォーマット変換', '無料', 'オンライン', '画像処理'
    ],
    competitorKeywords: competitorKeywords.image,
    category: 'image',
    schemaType: 'WebApplication'
  },
  'qr-reader': {
    title: 'QRコード読み取り・解析ツール【画像からQR読取・無料】',
    description: '画像からQRコードを読み取り、内容を詳細解析する無料ツール。URL・メール・WiFi・連絡先・位置情報など多様なQRコードに対応。',
    keywords: [
      'QRコード読み取り', 'QRコード解析', 'QRコードスキャン', '二次元コード読取',
      'URL QRコード', 'WiFi QRコード', '連絡先QRコード', '位置情報QRコード',
      'QRコードデコード', 'QR Scanner', '画像解析', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.image,
    category: 'image',
    schemaType: 'WebApplication'
  },
  'favicon-generator': {
    title: 'Favicon生成ツール【無料・複数サイズ・PWA対応】',
    description: '画像からWebサイト用Faviconを複数サイズで生成する無料ツール。16x16から512x512まで対応。PWA、iOS、Android用アイコンも生成。',
    keywords: [
      'Favicon生成', 'アイコン生成', 'Webサイトアイコン', 'PWAアイコン',
      'iOS Safari', 'Android Chrome', 'apple-touch-icon', 'manifest.json',
      '16x16', '32x32', '192x192', '512x512', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.image,
    category: 'image',
    schemaType: 'WebApplication'
  },
  'dns-generator': {
    title: 'DNSレコード生成ツール【A・MX・CNAME・TXT対応・無料】',
    description: 'DNS設定のテンプレートを生成する無料ツール。A・AAAA・CNAME・MX・TXT・NS・SOAレコードに対応。BIND形式、ゾーンファイル出力可能。',
    keywords: [
      'DNSレコード生成', 'DNS設定', 'Aレコード', 'MXレコード', 'CNAMEレコード',
      'TXTレコード', 'NSレコード', 'SOAレコード', 'BIND設定', 'ゾーンファイル',
      'ドメイン設定', 'DNS管理', '無料', 'オンライン', '開発者ツール'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'cidr-calculator': {
    title: 'CIDR計算機【サブネット計算・IPアドレス範囲・無料】',
    description: 'CIDR記法のIPアドレス範囲計算とサブネット分析を行う無料ツール。ネットワーク設計、IP管理、サブネット分割に最適。',
    keywords: [
      'CIDR計算', 'サブネット計算', 'IPアドレス計算', 'ネットワーク計算',
      'サブネットマスク', 'IPアドレス範囲', 'ネットワーク設計', 'IP管理',
      'サブネット分割', 'VLSM', 'プライベートIP', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.dev,
    category: 'dev',
    schemaType: 'WebApplication'
  },
  'kana-romaji': {
    title: 'かな・ローマ字変換ツール【ひらがな・カタカナ・ヘボン式・無料】',
    description: 'ひらがな・カタカナとローマ字を相互変換する無料ツール。ヘボン式・訓令式・日本式に対応。日本語入力、文字変換、言語学習に最適。',
    keywords: [
      'かな変換', 'ローマ字変換', 'ひらがな変換', 'カタカナ変換', 'ヘボン式',
      '訓令式', '日本式', '日本語入力', '文字変換', '言語学習',
      'Romaji', 'Hiragana', 'Katakana', '相互変換', '無料', 'オンライン'
    ],
    competitorKeywords: competitorKeywords.text,
    category: 'text',
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