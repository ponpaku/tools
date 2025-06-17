'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, FileText, Info, RefreshCw } from 'lucide-react'
import { ToolLayout } from '@/components/layout/tool-layout'

type GenerationType = 'paragraphs' | 'sentences' | 'words' | 'bytes'
type LoremType = 'classic' | 'bacon' | 'hipster' | 'corporate' | 'zombie'

export default function LoremIpsumPage() {
  const [count, setCount] = useState<string>('3')
  const [type, setType] = useState<GenerationType>('paragraphs')
  const [loremType, setLoremType] = useState<LoremType>('classic')
  const [startWithLorem, setStartWithLorem] = useState(true)

  // 各種Lorem Ipsumのテキストソース
  const textSources = useMemo(() => ({
    classic: {
      name: "クラシック Lorem Ipsum",
      words: [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
        "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
        "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
        "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
        "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
        "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
        "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
        "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
        "accusamus", "accusantium", "doloremque", "laudantium", "totam", "rem",
        "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis"
      ]
    },
    bacon: {
      name: "Bacon Ipsum",
      words: [
        "bacon", "ipsum", "dolor", "amet", "hamburger", "prosciutto", "chicken", "beef",
        "ribs", "pork", "belly", "bresaola", "turkey", "spare", "strip", "steak",
        "drumstick", "kevin", "swine", "pig", "short", "loin", "shoulder", "cow",
        "tenderloin", "ball", "tip", "pastrami", "salami", "kielbasa", "andouille",
        "pancetta", "meatball", "jowl", "tail", "shank", "flank", "brisket", "chuck",
        "pork", "chop", "fatback", "ham", "hock", "tri", "boudin", "sirloin",
        "picanha", "alcatra", "capicola", "frankfurter", "filet", "mignon", "leberkas",
        "corned", "beef", "jerky", "ground", "round", "venison", "sausage"
      ]
    },
    hipster: {
      name: "Hipster Ipsum",
      words: [
        "beard", "artisan", "sustainable", "organic", "craft", "beer", "fixie", "vinyl",
        "authentic", "brooklyn", "helvetica", "skateboard", "cliche", "irony", "mustache",
        "typewriter", "bicycle", "rights", "tattooed", "food", "truck", "wayfarers",
        "cardigan", "retro", "salvia", "aesthetic", "raw", "denim", "pitchfork",
        "portland", "shoreditch", "quinoa", "kale", "chips", "selfies", "gluten",
        "free", "meditation", "kombucha", "artisanal", "cold", "pressed", "juice",
        "farm", "table", "locavore", "paleo", "crossfit", "yoga", "chakra",
        "mindfulness", "wellness", "detox", "cleanse", "superfood", "antioxidant"
      ]
    },
    corporate: {
      name: "Corporate Ipsum",
      words: [
        "synergy", "leverage", "paradigm", "shift", "streamline", "optimize", "maximize",
        "efficiency", "scalable", "solution", "innovative", "disruptive", "technology",
        "digital", "transformation", "agile", "methodology", "best", "practices",
        "strategic", "initiative", "competitive", "advantage", "market", "penetration",
        "value", "proposition", "stakeholder", "engagement", "deliverable", "milestone",
        "actionable", "insights", "data", "driven", "analytics", "metrics", "KPI",
        "ROI", "ecosystem", "workflow", "automation", "integration", "collaboration",
        "communication", "transparency", "accountability", "governance", "compliance"
      ]
    },
    zombie: {
      name: "Zombie Ipsum",
      words: [
        "zombie", "brain", "apocalypse", "outbreak", "undead", "infection", "virus",
        "bite", "flesh", "decay", "horde", "survivor", "barricade", "shelter",
        "ammunition", "weapon", "crossbow", "machete", "headshot", "walking", "dead",
        "infected", "quarantine", "evacuation", "safe", "zone", "bunker", "supplies",
        "scavenge", "fortify", "defend", "escape", "hunt", "stalker", "crawler",
        "runner", "screamer", "bloater", "spitter", "hunter", "witch", "tank",
        "mutation", "plague", "pandemic", "contagion", "patient", "zero"
      ]
    }
  }), [])

  // Lorem Ipsum生成関数
  const generateLoremIpsum = useMemo(() => {
    const numCount = parseInt(count) || 1
    const source = textSources[loremType]
    
    const getRandomWords = (wordCount: number): string[] => {
      const words: string[] = []
      for (let i = 0; i < wordCount; i++) {
        words.push(source.words[Math.floor(Math.random() * source.words.length)])
      }
      return words
    }

    const generateSentence = (): string => {
      const wordCount = Math.floor(Math.random() * 10) + 5 // 5-14 words per sentence
      const words = getRandomWords(wordCount)
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return words.join(' ') + '.'
    }

    const generateParagraph = (): string => {
      const sentenceCount = Math.floor(Math.random() * 5) + 3 // 3-7 sentences per paragraph
      const sentences: string[] = []
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence())
      }
      return sentences.join(' ')
    }

    let result = ''

    switch (type) {
      case 'paragraphs':
        const paragraphs: string[] = []
        for (let i = 0; i < numCount; i++) {
          let paragraph = generateParagraph()
          // 最初の段落の最初の文をLorem ipsumで開始
          if (i === 0 && startWithLorem && loremType === 'classic') {
            paragraph = 'Lorem ipsum ' + paragraph.substring(paragraph.indexOf(' ') + 1)
          }
          paragraphs.push(paragraph)
        }
        result = paragraphs.join('\n\n')
        break

      case 'sentences':
        const sentences: string[] = []
        for (let i = 0; i < numCount; i++) {
          let sentence = generateSentence()
          if (i === 0 && startWithLorem && loremType === 'classic') {
            sentence = 'Lorem ipsum ' + sentence.substring(sentence.indexOf(' ') + 1)
          }
          sentences.push(sentence)
        }
        result = sentences.join(' ')
        break

      case 'words':
        const words = getRandomWords(numCount)
        if (startWithLorem && loremType === 'classic' && words.length > 0) {
          words[0] = 'Lorem'
          if (words.length > 1) words[1] = 'ipsum'
        }
        result = words.join(' ')
        break

      case 'bytes':
        let byteText = ''
        while (byteText.length < numCount) {
          byteText += getRandomWords(10).join(' ') + ' '
        }
        result = byteText.substring(0, numCount)
        break
    }

    return result
  }, [count, type, loremType, startWithLorem, textSources])

  const handleCopy = () => {
    navigator.clipboard.writeText(generateLoremIpsum)
  }

  const quickOptions = useMemo(() => [
    { count: '1', type: 'paragraphs' as GenerationType, label: '1段落' },
    { count: '3', type: 'paragraphs' as GenerationType, label: '3段落' },
    { count: '5', type: 'sentences' as GenerationType, label: '5文' },
    { count: '50', type: 'words' as GenerationType, label: '50単語' },
    { count: '500', type: 'bytes' as GenerationType, label: '500文字' }
  ], [])

  return (
    <ToolLayout
      title="Lorem Ipsum生成"
      description="ダミーテキスト・プレースホルダーテキストを生成する無料ツール。デザイン・開発・プロトタイプ作成に最適。"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Lorem Ipsum生成ツール</span>
            </CardTitle>
            <CardDescription>
              ダミーテキストを生成します。Webデザイン、印刷物、プロトタイプ作成に便利です。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 設定エリア */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">数量</label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="生成する数量"
                  min="1"
                  max="1000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">単位</label>
                <Select value={type} onValueChange={(value) => setType(value as GenerationType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">段落</SelectItem>
                    <SelectItem value="sentences">文</SelectItem>
                    <SelectItem value="words">単語</SelectItem>
                    <SelectItem value="bytes">文字数</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">スタイル</label>
                <Select value={loremType} onValueChange={(value) => setLoremType(value as LoremType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">クラシック</SelectItem>
                    <SelectItem value="bacon">Bacon</SelectItem>
                    <SelectItem value="hipster">Hipster</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="zombie">Zombie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">オプション</label>
                <Button
                  onClick={() => setStartWithLorem(!startWithLorem)}
                  variant={startWithLorem ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={loremType !== 'classic'}
                >
                  Lorem開始
                </Button>
              </div>
            </div>

            {/* クイックオプション */}
            <div className="space-y-2">
              <label className="text-sm font-medium">クイック選択</label>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setCount(option.count)
                      setType(option.type)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* スタイル説明 */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{textSources[loremType].name}</Badge>
              <span className="text-sm text-gray-600">
                {loremType === 'classic' && 'ラテン語ベースの伝統的なダミーテキスト'}
                {loremType === 'bacon' && '肉料理をテーマにしたユニークなダミーテキスト'}
                {loremType === 'hipster' && 'モダンなライフスタイル用語を使用'}
                {loremType === 'corporate' && 'ビジネス・企業用語を中心としたテキスト'}
                {loremType === 'zombie' && 'ゾンビ・ホラーテーマのダミーテキスト'}
              </span>
            </div>

            <div className="border-t border-gray-200 my-4" />

            {/* 生成結果 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">生成されたテキスト</label>
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      setCount(count)
                      setType(type)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>再生成</span>
                  </Button>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>コピー</span>
                  </Button>
                </div>
              </div>
              <Textarea
                value={generateLoremIpsum}
                readOnly
                rows={10}
                className="font-mono text-sm"
              />
              <div className="text-xs text-gray-500">
                文字数: {generateLoremIpsum.length} | 
                単語数: {generateLoremIpsum.split(/\s+/).filter(word => word.length > 0).length} |
                段落数: {generateLoremIpsum.split('\n\n').length}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用方法と説明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Lorem Ipsumについて</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Lorem Ipsumとは</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 1500年代から使われる伝統的なダミーテキスト</li>
                  <li>• ラテン語をベースとした無意味な文章</li>
                  <li>• 内容に気を取られず、デザインに集中できる</li>
                  <li>• 印刷・出版業界の標準プレースホルダー</li>
                  <li>• 「dolor sit amet」で有名な古典的テキスト</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">使用用途</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Webサイトのデザインプロトタイプ</li>
                  <li>• 印刷物のレイアウト確認</li>
                  <li>• モックアップ・ワイヤーフレーム</li>
                  <li>• フォント・タイポグラフィテスト</li>
                  <li>• CMSテンプレートの動作確認</li>
                  <li>• プレゼンテーション資料作成</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-3">
              <h4 className="font-semibold">各スタイルの特徴</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Classic:</span> 伝統的なLorem Ipsum（ラテン語）
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Bacon:</span> 肉料理テーマ（英語、ユニーク）
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Hipster:</span> モダンライフスタイル（英語）
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Corporate:</span> ビジネス用語（英語、企業向け）
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Zombie:</span> ホラーテーマ（英語、エンタメ）
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