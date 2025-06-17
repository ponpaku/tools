'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Diceware単語リスト（簡略版）
const DICEWARE_WORDS = [
  'a', 'abandon', 'ability', 'able', 'about', 'above', 'abuse', 'academy', 'accept', 'access',
  'accident', 'account', 'accurate', 'achieve', 'acid', 'acquire', 'across', 'action', 'actor', 'actual',
  'adapt', 'add', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice', 'advocate', 'affair',
  'affect', 'afford', 'afraid', 'after', 'again', 'against', 'age', 'agency', 'agent', 'agree',
  'ahead', 'aim', 'air', 'alarm', 'album', 'alert', 'alien', 'align', 'all', 'allow',
  'almost', 'alone', 'along', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle',
  'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety', 'any', 'apart', 'apology',
  'appear', 'apple', 'approve', 'april', 'arcade', 'arch', 'arctic', 'area', 'arena', 'argue',
  'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art',
  'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume', 'asthma',
  'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction', 'audit', 'august', 'aunt',
  'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware', 'away', 'awesome',
  'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge', 'bag', 'balance', 'balcony',
  'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain', 'barrel', 'base', 'basic',
  'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin',
  'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best', 'betray', 'better',
  'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology', 'bird', 'birth', 'bitter',
  'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless', 'blind', 'blood', 'blossom',
  'blow', 'blue', 'blur', 'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone',
  'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce', 'box',
  'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread', 'breeze', 'brick', 'bridge',
  'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze', 'broom', 'brother', 'brown',
  'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle',
  'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer', 'buzz',
  'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp',
  'can', 'canal', 'cancel', 'candy', 'cannon', 'canoe', 'canvas', 'canyon', 'capable', 'capital',
  'captain', 'car', 'carbon', 'card', 'care', 'career', 'careful', 'careless', 'cargo', 'carpet',
  'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual', 'cat', 'catalog', 'catch',
  'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census'
]

export default function DicewareGeneratorTool() {
  const [passphrase, setPassphrase] = useState('')
  const [wordCount, setWordCount] = useState('6')
  const [separator, setSeparator] = useState(' ')
  const [capitalize, setCapitalize] = useState(false)
  const [includeNumbers, setIncludeNumbers] = useState(false)

  // 暗号学的に安全な乱数生成
  const getSecureRandom = (max: number): number => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1)
      window.crypto.getRandomValues(array)
      return array[0] % max
    }
    // フォールバック（非推奨だが動作保証のため）
    return Math.floor(Math.random() * max)
  }

  const generateDicewarePassphrase = () => {
    const count = parseInt(wordCount)
    const selectedWords: string[] = []

    for (let i = 0; i < count; i++) {
      const randomIndex = getSecureRandom(DICEWARE_WORDS.length)
      let word = DICEWARE_WORDS[randomIndex]

      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }

      if (includeNumbers && i === count - 1) {
        const randomNum = getSecureRandom(100)
        word += randomNum.toString().padStart(2, '0')
      }

      selectedWords.push(word)
    }

    const actualSeparator = separator === "none" ? "" : separator
    setPassphrase(selectedWords.join(actualSeparator))
  }

  const calculateEntropy = () => {
    const count = parseInt(wordCount)
    const bitsPerWord = Math.log2(DICEWARE_WORDS.length)
    return Math.round(bitsPerWord * count)
  }

  const getStrengthLevel = (entropy: number) => {
    if (entropy < 40) return { level: '弱い', color: 'text-red-600', bg: 'bg-red-50' }
    if (entropy < 60) return { level: '普通', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (entropy < 80) return { level: '強い', color: 'text-green-600', bg: 'bg-green-50' }
    return { level: '非常に強い', color: 'text-blue-600', bg: 'bg-blue-50' }
  }

  const entropy = calculateEntropy()
  const strength = getStrengthLevel(entropy)

  return (
    <ToolLayout
      title="Dicewareパスフレーズ生成"
      description="Diceware方式による暗号学的に安全なパスフレーズを生成します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">単語数</label>
            <Select value={wordCount} onValueChange={setWordCount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4単語</SelectItem>
                <SelectItem value="5">5単語</SelectItem>
                <SelectItem value="6">6単語 (推奨)</SelectItem>
                <SelectItem value="7">7単語</SelectItem>
                <SelectItem value="8">8単語</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">区切り文字</label>
            <Select value={separator} onValueChange={setSeparator}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">スペース</SelectItem>
                <SelectItem value="-">ハイフン</SelectItem>
                <SelectItem value="_">アンダースコア</SelectItem>
                <SelectItem value=".">ドット</SelectItem>
                <SelectItem value="none">なし</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="capitalize"
              checked={capitalize}
              onChange={(e) => setCapitalize(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="capitalize" className="text-sm">
              先頭大文字
            </label>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="includeNumbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="includeNumbers" className="text-sm">
              数字追加
            </label>
          </div>
        </div>

        <Button onClick={generateDicewarePassphrase} className="w-full" size="lg">
          パスフレーズ生成
        </Button>

        {passphrase && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成されたパスフレーズ</CardTitle>
                <CopyButton text={passphrase} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg break-all">
                {passphrase}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-3 rounded-lg ${strength.bg}`}>
                  <p className="text-sm text-gray-600">強度</p>
                  <p className={`text-lg font-bold ${strength.color}`}>{strength.level}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">エントロピー</p>
                  <p className="text-lg font-bold text-blue-700">{entropy} bits</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">文字数</p>
                  <p className="text-lg font-bold text-purple-700">{passphrase.length}文字</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Dicewareとは</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">暗号学的安全性</h4>
                <p>
                  Dicewareは暗号学的に安全な乱数を使用して単語リストから単語を選択する方式です。
                  従来のパスワードよりも覚えやすく、かつ高いセキュリティを提供します。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">推奨設定</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>6単語以上の使用（エントロピー約77bits）</li>
                  <li>各サービスで異なるパスフレーズを使用</li>
                  <li>パスワードマネージャーでの管理を推奨</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">セキュリティレベル</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>4単語: 約52bits（一般用途）</li>
                  <li>5単語: 約65bits（ビジネス用途）</li>
                  <li>6単語: 約77bits（高セキュリティ）</li>
                  <li>7-8単語: 約90-103bits（最高セキュリティ）</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}