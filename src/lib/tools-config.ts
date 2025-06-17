import { ToolConfig } from "@/types";

export const toolsConfig: ToolConfig = {
  categories: [
    {
      id: "text",
      name: "文字列処理",
      icon: "Type",
      tools: [
        {
          id: "character-counter",
          name: "文字数計測ツール",
          description: "文字数、行数、バイト数などを計測",
          category: "text",
          icon: "AlignLeft",
          path: "/tools/character-counter"
        },
        {
          id: "full-half-converter",
          name: "全角半角変換",
          description: "全角・半角文字の相互変換",
          category: "text",
          icon: "ArrowLeftRight",
          path: "/tools/full-half-converter"
        },
        {
          id: "case-converter",
          name: "大文字小文字変換",
          description: "英字の大文字・小文字変換",
          category: "text",
          icon: "CaseSensitive",
          path: "/tools/case-converter"
        },
        {
          id: "line-remover",
          name: "改行削除ツール",
          description: "改行を削除してテキストを整形",
          category: "text",
          icon: "FileText",
          path: "/tools/line-remover"
        },
        {
          id: "duplicate-highlighter",
          name: "重複行ハイライト",
          description: "重複した行をハイライト表示",
          category: "text",
          icon: "Highlighter",
          path: "/tools/duplicate-highlighter"
        },
        {
          id: "diff-tool",
          name: "diffツール",
          description: "2つのテキストの差分を比較",
          category: "text",
          icon: "GitCompare",
          path: "/tools/diff-tool"
        },
        {
          id: "kanji-converter",
          name: "漢数字英数字変換",
          description: "漢数字とアラビア数字の相互変換",
          category: "text",
          icon: "Languages",
          path: "/tools/kanji-converter"
        },
        {
          id: "line-break-converter",
          name: "改行コード変換",
          description: "Windows・Unix・Mac間の改行コード変換",
          category: "text",
          icon: "ArrowUpDown",
          path: "/tools/line-break-converter"
        },
        {
          id: "kana-romaji",
          name: "かな・ローマ字変換",
          description: "ひらがな・カタカナとローマ字の相互変換",
          category: "text",
          icon: "Spellcheck",
          path: "/tools/kana-romaji"
        }
      ]
    },
    {
      id: "encoding",
      name: "エンコーディング",
      icon: "Lock",
      tools: [
        {
          id: "base64",
          name: "Base64エンコーダーデコーダ",
          description: "テキスト・画像・ファイルのBase64エンコード・デコード",
          category: "encoding",
          icon: "Key",
          path: "/tools/base64"
        },
        {
          id: "url-encoder",
          name: "URLエンコーダデコーダ",
          description: "URLエンコード・デコード",
          category: "encoding",
          icon: "Link",
          path: "/tools/url-encoder"
        },
        {
          id: "hash-generator",
          name: "ハッシュ生成",
          description: "MD5、SHA-1、SHA-256ハッシュ生成",
          category: "encoding",
          icon: "Hash",
          path: "/tools/hash-generator"
        },
        {
          id: "emoji-converter",
          name: "Emojiコード変換",
          description: "絵文字とUnicodeコード・HTML Entity・CSS・JavaScript形式の相互変換",
          category: "encoding",
          icon: "Smile",
          path: "/tools/emoji-converter"
        }
      ]
    },
    {
      id: "image",
      name: "画像処理",
      icon: "Image",
      tools: [
        {
          id: "image-resize",
          name: "画像リサイズ",
          description: "画像のサイズ変更と形式変換",
          category: "image",
          icon: "Maximize2",
          path: "/tools/image-resize"
        },
        {
          id: "image-compress",
          name: "画像圧縮",
          description: "JPEG・PNG・WebP画像の圧縮処理",
          category: "image",
          icon: "Minimize2",
          path: "/tools/image-compress"
        },
        {
          id: "image-convert",
          name: "画像形式変換",
          description: "JPEG・PNG・WebP間の画像形式変換",
          category: "image",
          icon: "RefreshCw",
          path: "/tools/image-convert"
        },
        {
          id: "qr-reader",
          name: "QRコード読み取り",
          description: "画像からQRコードを読み取り・解析",
          category: "image",
          icon: "ScanLine",
          path: "/tools/qr-reader"
        },
        {
          id: "favicon-generator",
          name: "Favicon生成",
          description: "画像からFaviconを生成",
          category: "image",
          icon: "Bookmark",
          path: "/tools/favicon-generator"
        }
      ]
    },
    {
      id: "datetime",
      name: "日付・時間",
      icon: "Calendar",
      tools: [
        {
          id: "japanese-calendar",
          name: "和暦西暦変換",
          description: "和暦と西暦の相互変換",
          category: "datetime",
          icon: "CalendarDays",
          path: "/tools/japanese-calendar"
        },
        {
          id: "unix-time",
          name: "Unixタイム変換",
          description: "Unixタイムスタンプと日時の変換",
          category: "datetime",
          icon: "Clock",
          path: "/tools/unix-time"
        },
        {
          id: "weekday-list",
          name: "曜日リスト化ツール",
          description: "指定曜日の日付リストを生成",
          category: "datetime",
          icon: "List",
          path: "/tools/weekday-list"
        },
        {
          id: "memorial-calculator",
          name: "法要計算機",
          description: "法要の日程を計算",
          category: "datetime",
          icon: "Heart",
          path: "/tools/memorial-calculator"
        }
      ]
    },
    {
      id: "dev",
      name: "開発者ツール",
      icon: "Code",
      tools: [
        {
          id: "json-formatter",
          name: "Jsonフォーマッター",
          description: "JSONの整形・縮小",
          category: "dev",
          icon: "Braces",
          path: "/tools/json-formatter"
        },
        {
          id: "json-yaml",
          name: "JsonYaml変換",
          description: "JSONとYAMLの相互変換",
          category: "dev",
          icon: "FileCode",
          path: "/tools/json-yaml"
        },
        {
          id: "cron-generator",
          name: "cronジェネレータ",
          description: "cron式を生成",
          category: "dev",
          icon: "Timer",
          path: "/tools/cron-generator"
        },
        {
          id: "cron-parser",
          name: "cronパーサー",
          description: "cron式を解析・説明",
          category: "dev",
          icon: "Clock4",
          path: "/tools/cron-parser"
        },
        {
          id: "uuid-generator",
          name: "UUID生成",
          description: "UUID v1、v4を生成",
          category: "dev",
          icon: "Fingerprint",
          path: "/tools/uuid-generator"
        },
        {
          id: "number-base-converter",
          name: "進数変換",
          description: "2進数・8進数・10進数・16進数の相互変換",
          category: "dev",
          icon: "Binary",
          path: "/tools/number-base-converter"
        },
        {
          id: "regex-tester",
          name: "正規表現テスター",
          description: "正規表現のテスト・検証ツール（カラーハイライト付き）",
          category: "dev",
          icon: "TestTube",
          path: "/tools/regex-tester"
        },
        {
          id: "color-converter",
          name: "カラーコード変換",
          description: "HEX・RGB・HSL・HSV・CMYK形式の色変換ツール",
          category: "dev",
          icon: "Palette",
          path: "/tools/color-converter"
        },
        {
          id: "jwt-decoder",
          name: "JWT/PASTOデコーダ",
          description: "JWT（JSON Web Token）とPASETOの解析・デコードツール",
          category: "dev",
          icon: "Shield",
          path: "/tools/jwt-decoder"
        },
        {
          id: "markdown-preview",
          name: "Markdownプレビュー",
          description: "Markdownテキストのリアルタイムプレビュー・変換ツール",
          category: "dev",
          icon: "Eye",
          path: "/tools/markdown-preview"
        },
        {
          id: "csv-json",
          name: "CSV・JSON変換",
          description: "CSVとJSONの相互変換ツール",
          category: "dev",
          icon: "Table",
          path: "/tools/csv-json"
        },
        {
          id: "markdown-html",
          name: "Markdown・HTML変換",
          description: "MarkdownとHTMLの相互変換ツール",
          category: "dev",
          icon: "FileCode2",
          path: "/tools/markdown-html"
        },
      ]
    },
    {
      id: "generator",
      name: "生成ツール",
      icon: "Sparkles",
      tools: [
        {
          id: "qr-generator",
          name: "QRコード生成",
          description: "テキストからQRコードを生成",
          category: "generator",
          icon: "QrCode",
          path: "/tools/qr-generator"
        },
        {
          id: "random-string",
          name: "ランダム文字列生成",
          description: "パスワードやトークン生成",
          category: "generator",
          icon: "Dices",
          path: "/tools/random-string"
        },
        {
          id: "fortune-generator",
          name: "運勢・診断生成器",
          description: "占い・おみくじ・診断結果をランダム生成",
          category: "generator",
          icon: "Star",
          path: "/tools/fortune-generator"
        },
        {
          id: "lorem-ipsum",
          name: "Lorem Ipsum生成",
          description: "ダミーテキスト・プレースホルダーテキストを生成",
          category: "generator",
          icon: "FileText",
          path: "/tools/lorem-ipsum"
        }
      ]
    },
    {
      id: "games",
      name: "ゲーム",
      icon: "Gamepad2",
      tools: [
        {
          id: "bingo-roulette",
          name: "ビンゴルーレット",
          description: "ビンゴ番号抽選器（演出付き）",
          category: "games",
          icon: "CircleDot",
          path: "/tools/bingo-roulette"
        },
        {
          id: "bingo-card",
          name: "ビンゴカード",
          description: "ビンゴカード生成・管理",
          category: "games",
          icon: "Grid3X3",
          path: "/tools/bingo-card"
        },
        {
          id: "roulette",
          name: "ルーレット",
          description: "カスタムルーレットで抽選・選択",
          category: "games",
          icon: "RotateCcw",
          path: "/tools/roulette"
        },
        {
          id: "scoreboard",
          name: "スコアボード",
          description: "点数を記録・管理",
          category: "games",
          icon: "Trophy",
          path: "/tools/scoreboard"
        },
        {
          id: "sports-scoreboard",
          name: "スポーツスコアボード",
          description: "バスケ・バレー・テニス・卓球のスコア管理",
          category: "games",
          icon: "Activity",
          path: "/tools/sports-scoreboard"
        }
      ]
    },
    {
      id: "calculator",
      name: "計算機",
      icon: "Calculator",
      tools: [
        {
          id: "age-calculator",
          name: "満年齢計算機",
          description: "生年月日から満年齢を計算",
          category: "calculator",
          icon: "Calendar",
          path: "/tools/age-calculator"
        },
        {
          id: "bmi-calculator",
          name: "BMI計算機",
          description: "身長・体重からBMI（Body Mass Index）を計算",
          category: "calculator",
          icon: "Weight",
          path: "/tools/bmi-calculator"
        },
        {
          id: "transfer-calculator",
          name: "転送速度計算器",
          description: "データ転送時間を計算",
          category: "calculator",
          icon: "Wifi",
          path: "/tools/transfer-calculator"
        },
        {
          id: "microwave-calculator",
          name: "電子レンジ時間計算器",
          description: "ワット数に応じた加熱時間を計算",
          category: "calculator",
          icon: "Zap",
          path: "/tools/microwave-calculator"
        },
        {
          id: "unit-converter",
          name: "単位変換ツール",
          description: "長さ・重さ・温度の単位変換",
          category: "calculator",
          icon: "ArrowUpDown",
          path: "/tools/unit-converter"
        },
        {
          id: "fraction-percentage-converter",
          name: "分数・小数・パーセント変換",
          description: "分数・小数・パーセントの相互変換ツール",
          category: "calculator",
          icon: "Percent",
          path: "/tools/fraction-percentage-converter"
        },
        {
          id: "statistics-calculator",
          name: "統計計算機",
          description: "平均・分散・標準偏差など基本統計量の計算ツール",
          category: "calculator",
          icon: "TrendingUp",
          path: "/tools/statistics-calculator"
        },
        {
          id: "memory-size-converter",
          name: "メモリサイズ変換",
          description: "Byte・KB・MB・GB・TB・PBの相互変換ツール",
          category: "calculator",
          icon: "HardDrive",
          path: "/tools/memory-size-converter"
        }
      ]
    },
    {
      id: "finance",
      name: "金融・価格",
      icon: "DollarSign",
      tools: [
        {
          id: "discount-calculator",
          name: "商品値引き計算機",
          description: "割引率・税込価格・ポイント還元を含む商品価格計算ツール",
          category: "finance",
          icon: "Percent",
          path: "/tools/discount-calculator"
        },
        {
          id: "loan-calculator",
          name: "ローン返済・利息計算機",
          description: "住宅ローン・自動車ローンなどの返済計画と利息計算ツール",
          category: "finance",
          icon: "CreditCard",
          path: "/tools/loan-calculator"
        },
        {
          id: "tax-calculator",
          name: "税金計算機",
          description: "所得税・住民税・社会保険料の計算ツール",
          category: "finance",
          icon: "FileText",
          path: "/tools/tax-calculator"
        }
      ]
    },
    {
      id: "network",
      name: "ネットワーク",
      icon: "Network",
      tools: [
        {
          id: "ip-address",
          name: "IPアドレス確認",
          description: "アクセス元IPアドレスを表示",
          category: "network",
          icon: "MapPin",
          path: "/tools/ip-address"
        },
        {
          id: "http-header-viewer",
          name: "HTTPヘッダービューアー",
          description: "WebサイトのHTTPレスポンスヘッダーとクライアント情報を分析・表示",
          category: "network",
          icon: "FileSearch",
          path: "/tools/http-header-viewer"
        },
        {
          id: "dns-checker",
          name: "DNSレコードチェッカー",
          description: "ドメインのDNSレコードを検索・確認するツール",
          category: "network",
          icon: "Search",
          path: "/tools/dns-checker"
        },
        {
          id: "dns-generator",
          name: "DNSレコード生成",
          description: "DNSレコード設定のテンプレートを生成",
          category: "network",
          icon: "FileText",
          path: "/tools/dns-generator"
        },
        {
          id: "cidr-calculator",
          name: "CIDR計算機",
          description: "CIDR記法のIPアドレス範囲計算・サブネット分析",
          category: "network",
          icon: "Network",
          path: "/tools/cidr-calculator"
        }
      ]
    },
    {
      id: "utility",
      name: "ユーティリティ",
      icon: "Wrench",
      tools: [
        {
          id: "amazon-link",
          name: "Amazonリンク短縮",
          description: "AmazonのURLを短縮",
          category: "utility",
          icon: "ShoppingCart",
          path: "/tools/amazon-link"
        },
        {
          id: "exif-viewer",
          name: "EXIF確認ツール",
          description: "画像のEXIF情報を表示",
          category: "utility",
          icon: "Image",
          path: "/tools/exif-viewer"
        }
      ]
    }
  ]
};