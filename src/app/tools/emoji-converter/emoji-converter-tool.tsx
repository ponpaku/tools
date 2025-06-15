'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, Copy } from 'lucide-react'

interface EmojiData {
  emoji: string
  unicode: string
  htmlEntity: string
  css: string
  javascript: string
  name: string
}

// 絵文字カテゴリ別データ
const emojiCategories = {
  faces: {
    name: 'スマイリー・感情',
    emojis: [
      { emoji: '😀', name: 'にっこり顔' },
      { emoji: '😃', name: '嬉しい顔' },
      { emoji: '😄', name: '笑顔' },
      { emoji: '😁', name: 'にこにこ顔' },
      { emoji: '😆', name: '大笑い' },
      { emoji: '😅', name: '苦笑い' },
      { emoji: '😂', name: '涙を流して笑う顔' },
      { emoji: '🤣', name: '爆笑' },
      { emoji: '😊', name: '嬉しい顔' },
      { emoji: '😇', name: '天使' },
      { emoji: '😍', name: 'ハート目' },
      { emoji: '🤗', name: 'ハグ' },
      { emoji: '😘', name: 'キス' },
      { emoji: '😗', name: 'キス顔' },
      { emoji: '😙', name: 'キス顔' },
      { emoji: '😚', name: 'キス顔' },
      { emoji: '🤔', name: '考える顔' },
      { emoji: '😐', name: '無表情' },
      { emoji: '😑', name: '無表情' },
      { emoji: '😶', name: '口なし顔' },
      { emoji: '😏', name: 'にやり顔' },
      { emoji: '😒', name: 'つまらない顔' },
      { emoji: '🙄', name: '目を回す' },
      { emoji: '😬', name: 'しかめっ面' },
      { emoji: '🤐', name: '口にジッパー' },
      { emoji: '😴', name: '眠い顔' },
      { emoji: '😷', name: 'マスク' },
      { emoji: '🤒', name: '熱がある顔' },
      { emoji: '🤕', name: '頭に包帯' },
      { emoji: '🤢', name: '吐き気' },
      { emoji: '🤮', name: '嘔吐' },
      { emoji: '🤧', name: 'くしゃみ' },
      { emoji: '😵', name: 'めまい' },
      { emoji: '😎', name: 'サングラス' },
      { emoji: '🤓', name: 'オタク顔' },
      { emoji: '😕', name: '困った顔' },
      { emoji: '😟', name: '心配な顔' },
      { emoji: '🙁', name: 'しかめっ面' },
      { emoji: '😮', name: '驚き' },
      { emoji: '😯', name: '静かな驚き' },
      { emoji: '😲', name: 'ショック' },
      { emoji: '😳', name: '赤面' },
      { emoji: '🥺', name: '懇願する顔' },
      { emoji: '😦', name: '心配顔' },
      { emoji: '😧', name: '苦悩' },
      { emoji: '😨', name: '恐怖' },
      { emoji: '😰', name: '冷や汗' },
      { emoji: '😥', name: '落胆' },
      { emoji: '😢', name: '泣き顔' },
      { emoji: '😭', name: '大泣き' },
      { emoji: '😱', name: '絶叫' },
      { emoji: '😖', name: '困惑' },
      { emoji: '😣', name: '頑張る顔' },
      { emoji: '😞', name: '失望' },
      { emoji: '😓', name: '冷や汗' },
      { emoji: '😩', name: '疲れた顔' },
      { emoji: '😫', name: 'うんざり' },
      { emoji: '😤', name: '怒り' },
      { emoji: '😡', name: '激怒' },
      { emoji: '😠', name: '怒り顔' },
      { emoji: '🤬', name: '悪態' },
      { emoji: '😈', name: '悪魔の笑み' },
      { emoji: '👿', name: '怒った悪魔' },
      { emoji: '💀', name: 'どくろ' },
      { emoji: '☠️', name: 'どくろと骨' }
    ]
  },
  people: {
    name: '人・手',
    emojis: [
      { emoji: '👋', name: '手を振る' },
      { emoji: '🤚', name: '手の甲' },
      { emoji: '🖐️', name: '開いた手' },
      { emoji: '✋', name: 'ストップ' },
      { emoji: '🖖', name: 'バルカンサイン' },
      { emoji: '👌', name: 'OK' },
      { emoji: '🤏', name: 'つまむ' },
      { emoji: '✌️', name: 'ピース' },
      { emoji: '🤞', name: '指をクロス' },
      { emoji: '🤟', name: 'アイラブユー' },
      { emoji: '🤘', name: 'ロックサイン' },
      { emoji: '🤙', name: 'ハングルース' },
      { emoji: '👈', name: '左指差し' },
      { emoji: '👉', name: '右指差し' },
      { emoji: '👆', name: '上指差し' },
      { emoji: '🖕', name: '中指' },
      { emoji: '👇', name: '下指差し' },
      { emoji: '☝️', name: '人差し指' },
      { emoji: '👍', name: 'サムズアップ' },
      { emoji: '👎', name: 'サムズダウン' },
      { emoji: '✊', name: 'げんこつ' },
      { emoji: '👊', name: 'パンチ' },
      { emoji: '🤛', name: '左パンチ' },
      { emoji: '🤜', name: '右パンチ' },
      { emoji: '👏', name: '拍手' },
      { emoji: '🙌', name: 'バンザイ' },
      { emoji: '👐', name: '開いた手' },
      { emoji: '🤲', name: '手のひら' },
      { emoji: '🤝', name: '握手' },
      { emoji: '🙏', name: '祈り' }
    ]
  },
  hearts: {
    name: 'ハート・シンボル',
    emojis: [
      { emoji: '❤️', name: '赤いハート' },
      { emoji: '🧡', name: 'オレンジのハート' },
      { emoji: '💛', name: '黄色いハート' },
      { emoji: '💚', name: '緑のハート' },
      { emoji: '💙', name: '青いハート' },
      { emoji: '💜', name: '紫のハート' },
      { emoji: '🖤', name: '黒いハート' },
      { emoji: '🤍', name: '白いハート' },
      { emoji: '🤎', name: '茶色いハート' },
      { emoji: '💔', name: '壊れたハート' },
      { emoji: '❣️', name: 'ハートの感嘆符' },
      { emoji: '💕', name: '2つのハート' },
      { emoji: '💞', name: '回転するハート' },
      { emoji: '💓', name: '鼓動するハート' },
      { emoji: '💗', name: '成長するハート' },
      { emoji: '💖', name: 'きらめくハート' },
      { emoji: '💘', name: '矢印とハート' },
      { emoji: '💝', name: 'ハートのプレゼント' },
      { emoji: '💟', name: 'ハート装飾' }
    ]
  }
}

// 絵文字からUnicodeコードポイントを取得
function getUnicodeCodePoint(emoji: string): string {
  const codePoints = Array.from(emoji).map(char => {
    const codePoint = char.codePointAt(0)
    return codePoint ? `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}` : ''
  })
  return codePoints.join(' ')
}

// 絵文字からHTML Entityを取得
function getHtmlEntity(emoji: string): string {
  const codePoints = Array.from(emoji).map(char => {
    const codePoint = char.codePointAt(0)
    return codePoint ? `&#${codePoint};` : ''
  })
  return codePoints.join('')
}

// 絵文字からCSS形式を取得
function getCssFormat(emoji: string): string {
  const codePoints = Array.from(emoji).map(char => {
    const codePoint = char.codePointAt(0)
    return codePoint ? `\\${codePoint.toString(16).toUpperCase()}` : ''
  })
  return codePoints.join('')
}

// 絵文字からJavaScript形式を取得
function getJavaScriptFormat(emoji: string): string {
  const codePoints = Array.from(emoji).map(char => {
    const codePoint = char.codePointAt(0)
    return codePoint ? `\\u{${codePoint.toString(16).toUpperCase()}}` : ''
  })
  return codePoints.join('')
}

// Unicode文字列から絵文字を生成
function parseUnicodeToEmoji(unicode: string): string {
  try {
    // U+1F600 形式をパース
    const codePoints = unicode.split(/[\s,]+/)
      .map(code => code.trim())
      .filter(code => code.length > 0)
      .map(code => {
        const match = code.match(/U\+([0-9A-Fa-f]+)/)
        if (match) {
          return parseInt(match[1], 16)
        }
        // 16進数のみの場合
        const hexMatch = code.match(/^([0-9A-Fa-f]+)$/)
        if (hexMatch) {
          return parseInt(hexMatch[1], 16)
        }
        return null
      })
      .filter(codePoint => codePoint !== null) as number[]

    if (codePoints.length === 0) return ''
    return String.fromCodePoint(...codePoints)
  } catch {
    return ''
  }
}

export default function EmojiConverterTool() {
  const [inputText, setInputText] = useState('')
  const [selectedTab, setSelectedTab] = useState('converter')

  // 入力テキストの解析結果
  const analysisResult = useMemo((): EmojiData[] => {
    if (!inputText.trim()) return []

    const emojis = Array.from(inputText)
      .filter(char => {
        const codePoint = char.codePointAt(0)
        return codePoint && (
          (codePoint >= 0x1F600 && codePoint <= 0x1F64F) || // 絵文字
          (codePoint >= 0x1F300 && codePoint <= 0x1F5FF) || // その他のシンボル
          (codePoint >= 0x1F680 && codePoint <= 0x1F6FF) || // 交通・地図
          (codePoint >= 0x1F1E0 && codePoint <= 0x1F1FF) || // 国旗
          (codePoint >= 0x2600 && codePoint <= 0x26FF) ||   // その他のシンボル
          (codePoint >= 0x2700 && codePoint <= 0x27BF) ||   // Dingbats
          (codePoint >= 0xFE00 && codePoint <= 0xFE0F) ||   // バリエーションセレクタ
          (codePoint >= 0x1F900 && codePoint <= 0x1F9FF) || // 追加絵文字
          (codePoint >= 0x1F018 && codePoint <= 0x1F270)    // その他
        )
      })

    // 重複を除去
    const uniqueEmojis = Array.from(new Set(emojis))

    return uniqueEmojis.map(emoji => ({
      emoji,
      unicode: getUnicodeCodePoint(emoji),
      htmlEntity: getHtmlEntity(emoji),
      css: getCssFormat(emoji),
      javascript: getJavaScriptFormat(emoji),
      name: '絵文字'
    }))
  }, [inputText])

  // Unicode入力からの変換
  const [unicodeInput, setUnicodeInput] = useState('')
  const unicodeToEmoji = useMemo(() => {
    if (!unicodeInput.trim()) return ''
    return parseUnicodeToEmoji(unicodeInput)
  }, [unicodeInput])

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji)
    setSelectedTab('converter')
  }

  return (
    <ToolLayout
      title="Emojiコード変換"
      description="絵文字とUnicodeコード・HTML Entity・CSS・JavaScript形式の相互変換"
    >
      <div className="space-y-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">変換ツール</TabsTrigger>
            <TabsTrigger value="picker">絵文字一覧</TabsTrigger>
          </TabsList>

          {/* 変換ツール */}
          <TabsContent value="converter" className="space-y-6">
            {/* 絵文字入力エリア */}
            <Card>
              <CardHeader>
                <CardTitle>絵文字を入力</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="絵文字を入力してください... 😀🎉💖"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px] text-lg"
                />
              </CardContent>
            </Card>

            {/* Unicode入力エリア */}
            <Card>
              <CardHeader>
                <CardTitle>Unicodeコードから絵文字に変換</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="例: U+1F600 U+1F389 または 1F600 1F389"
                  value={unicodeInput}
                  onChange={(e) => setUnicodeInput(e.target.value)}
                  className="font-mono"
                />
                {unicodeToEmoji && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-2">変換結果:</div>
                    <div className="text-3xl text-center">
                      {unicodeToEmoji}
                      <CopyButton text={unicodeToEmoji} className="ml-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 解析結果 */}
            {analysisResult.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>変換結果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysisResult.map((data, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{data.emoji}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">Unicode</div>
                              <div className="flex items-center gap-2">
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                  {data.unicode}
                                </code>
                                <CopyButton text={data.unicode} />
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">HTML Entity</div>
                              <div className="flex items-center gap-2">
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                  {data.htmlEntity}
                                </code>
                                <CopyButton text={data.htmlEntity} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">CSS</div>
                              <div className="flex items-center gap-2">
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                  {data.css}
                                </code>
                                <CopyButton text={data.css} />
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">JavaScript</div>
                              <div className="flex items-center gap-2">
                                <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                                  {data.javascript}
                                </code>
                                <CopyButton text={data.javascript} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 絵文字一覧 */}
          <TabsContent value="picker" className="space-y-6">
            {Object.entries(emojiCategories).map(([categoryId, category]) => (
              <Card key={categoryId}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-2">
                    {category.emojis.map((emojiData, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emojiData.emoji)}
                        className="p-2 text-2xl hover:bg-gray-100 rounded transition-colors"
                        title={emojiData.name}
                      >
                        {emojiData.emoji}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <li>絵文字からUnicodeコード、HTML Entity、CSS、JavaScript形式への変換</li>
                  <li>Unicodeコードから絵文字への逆変換</li>
                  <li>カテゴリ別絵文字一覧表示</li>
                  <li>変換結果のワンクリックコピー機能</li>
                  <li>複数絵文字の一括変換対応</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Web開発でのHTML/CSS/JavaScript実装</li>
                  <li>データベースへの絵文字保存時のエンコード</li>
                  <li>API通信での絵文字データ処理</li>
                  <li>Unicode文字の調査・分析</li>
                  <li>プログラミング学習・デバッグ作業</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">対応形式</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium">Unicode</div>
                    <div className="text-gray-600">U+1F600 形式</div>
                  </div>
                  <div>
                    <div className="font-medium">HTML Entity</div>
                    <div className="text-gray-600">&#128512; 形式</div>
                  </div>
                  <div>
                    <div className="font-medium">CSS</div>
                    <div className="text-gray-600">\\1F600 形式</div>
                  </div>
                  <div>
                    <div className="font-medium">JavaScript</div>
                    <div className="text-gray-600">\u005Cu{`{1F600}`} 形式</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}