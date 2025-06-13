'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CharsetOption {
  name: string
  value: string
  chars: string
}

export default function RandomStringPage() {
  const [length, setLength] = useState('12')
  const [selectedCharsets, setSelectedCharsets] = useState<string[]>(['letters', 'numbers'])
  const [customChars, setCustomChars] = useState('')
  const [excludeChars, setExcludeChars] = useState('')
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([])
  const [generateCount, setGenerateCount] = useState('1')

  const charsetOptions: CharsetOption[] = [
    { name: '大文字', value: 'uppercase', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
    { name: '小文字', value: 'lowercase', chars: 'abcdefghijklmnopqrstuvwxyz' },
    { name: '英字', value: 'letters', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' },
    { name: '数字', value: 'numbers', chars: '0123456789' },
    { name: '記号', value: 'symbols', chars: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    { name: '安全な記号', value: 'safe-symbols', chars: '!@#$%^&*-_=+' }
  ]

  const generateRandomString = () => {
    let charset = ''
    
    // 選択された文字セットを結合
    selectedCharsets.forEach(charsetValue => {
      const charsetOption = charsetOptions.find(option => option.value === charsetValue)
      if (charsetOption) {
        charset += charsetOption.chars
      }
    })
    
    // カスタム文字を追加
    if (customChars) {
      charset += customChars
    }
    
    // 除外文字を削除
    if (excludeChars) {
      for (const char of excludeChars) {
        charset = charset.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
      }
    }
    
    // 重複文字を削除
    charset = [...new Set(charset)].join('')
    
    if (!charset) {
      alert('使用可能な文字がありません')
      return
    }
    
    const targetLength = parseInt(length)
    const count = parseInt(generateCount)
    const results: string[] = []
    
    for (let i = 0; i < count; i++) {
      let result = ''
      for (let j = 0; j < targetLength; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        result += charset[randomIndex]
      }
      results.push(result)
    }
    
    setGeneratedStrings(results)
  }

  const copyAllStrings = () => {
    const allStrings = generatedStrings.join('\n')
    navigator.clipboard.writeText(allStrings)
  }

  const presetConfigs = [
    {
      name: 'パスワード（強力）',
      charsets: ['letters', 'numbers', 'safe-symbols'],
      length: '16',
      description: '英数字と安全な記号を含む強力なパスワード'
    },
    {
      name: 'パスワード（基本）',
      charsets: ['letters', 'numbers'],
      length: '12',
      description: '英数字のみの基本的なパスワード'
    },
    {
      name: 'API キー',
      charsets: ['uppercase', 'numbers'],
      length: '32',
      description: '大文字と数字からなるAPIキー形式'
    },
    {
      name: 'セッションID',
      charsets: ['lowercase', 'numbers'],
      length: '24',
      description: '小文字と数字からなるセッションID'
    }
  ]

  const applyPreset = (preset: typeof presetConfigs[0]) => {
    setSelectedCharsets(preset.charsets)
    setLength(preset.length)
    setCustomChars('')
    setExcludeChars('')
  }

  return (
    <ToolLayout
      title="ランダム文字列生成"
      description="パスワードやトークン生成に使えるランダム文字列を生成します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">文字数</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              min="1"
              max="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">生成個数</label>
            <Input
              type="number"
              value={generateCount}
              onChange={(e) => setGenerateCount(e.target.value)}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">使用する文字種</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {charsetOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCharsets.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCharsets([...selectedCharsets, option.value])
                    } else {
                      setSelectedCharsets(selectedCharsets.filter(v => v !== option.value))
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">追加文字</label>
            <Input
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              placeholder="追加したい文字を入力..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">除外文字</label>
            <Input
              value={excludeChars}
              onChange={(e) => setExcludeChars(e.target.value)}
              placeholder="除外したい文字を入力..."
            />
          </div>
        </div>

        <Button onClick={generateRandomString} className="w-full">
          ランダム文字列生成
        </Button>

        {generatedStrings.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成された文字列</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAllStrings}>
                    全てコピー
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setGeneratedStrings([])}>
                    クリア
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {generatedStrings.map((str, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <code className="font-mono text-sm break-all flex-1 mr-4">{str}</code>
                    <CopyButton text={str} className="flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>プリセット設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetConfigs.map((preset, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{preset.name}</h4>
                      <p className="text-sm text-gray-600">{preset.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                    >
                      適用
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    文字数: {preset.length} | 文字種: {preset.charsets.map(c => charsetOptions.find(o => o.value === c)?.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セキュリティガイド</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">強力なパスワードの条件</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>最低12文字以上（重要なアカウントは16文字以上推奨）</li>
                  <li>大文字、小文字、数字、記号を組み合わせる</li>
                  <li>辞書にある単語や個人情報を含まない</li>
                  <li>サービスごとに異なるパスワードを使用</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>生成されたパスワードは安全な場所に保存してください</li>
                  <li>パスワードマネージャーの使用を強く推奨します</li>
                  <li>定期的にパスワードを変更しましょう</li>
                  <li>二要素認証の併用でセキュリティを強化しましょう</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}