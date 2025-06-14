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
          icon: "Calculator",
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
          icon: "RemoveFormatting",
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
          description: "Base64形式のエンコード・デコード",
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
        }
      ]
    },
    {
      id: "datetime",
      name: "日付・時間",
      icon: "Calendar",
      tools: [
        {
          id: "age-calculator",
          name: "満年齢計算機",
          description: "生年月日から満年齢を計算",
          category: "datetime",
          icon: "Birthday",
          path: "/tools/age-calculator"
        },
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
          icon: "CalendarDays",
          path: "/tools/weekday-list"
        },
        {
          id: "memorial-calculator",
          name: "法要計算機",
          description: "法要の日程を計算",
          category: "datetime",
          icon: "Flower",
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
          icon: "FileText",
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
          icon: "Search",
          path: "/tools/cron-parser"
        },
        {
          id: "uuid-generator",
          name: "UUID生成",
          description: "UUID v1、v4を生成",
          category: "dev",
          icon: "Hash",
          path: "/tools/uuid-generator"
        }
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
        }
      ]
    },
    {
      id: "utility",
      name: "ユーティリティ",
      icon: "Settings",
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
          id: "ip-address",
          name: "IPアドレス確認",
          description: "アクセス元IPアドレスを表示",
          category: "utility",
          icon: "Globe",
          path: "/tools/ip-address"
        },
        {
          id: "exif-viewer",
          name: "EXIF確認ツール",
          description: "画像のEXIF情報を表示",
          category: "utility",
          icon: "Image",
          path: "/tools/exif-viewer"
        },
        {
          id: "transfer-calculator",
          name: "転送速度計算器",
          description: "データ転送時間を計算",
          category: "utility",
          icon: "Gauge",
          path: "/tools/transfer-calculator"
        },
        {
          id: "microwave-calculator",
          name: "電子レンジ時間計算器",
          description: "ワット数に応じた加熱時間を計算",
          category: "utility",
          icon: "Zap",
          path: "/tools/microwave-calculator"
        }
      ]
    }
  ]
};