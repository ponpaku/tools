'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState('')
  const [hashes, setHashes] = useState<{
    md5: string
    sha1: string
    sha256: string
    sha512: string
  }>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  })

  const generateHashes = async () => {
    if (!inputText) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' })
      return
    }

    try {
      const CryptoJS = (await import('crypto-js')).default
      
      const md5 = CryptoJS.MD5(inputText).toString()
      const sha1 = CryptoJS.SHA1(inputText).toString()
      const sha256 = CryptoJS.SHA256(inputText).toString()
      const sha512 = CryptoJS.SHA512(inputText).toString()

      setHashes({ md5, sha1, sha256, sha512 })
    } catch (error) {
      console.error('ハッシュ生成エラー:', error)
      alert('ハッシュ生成中にエラーが発生しました')
    }
  }

  const hashAlgorithms = [
    {
      name: 'MD5',
      key: 'md5' as keyof typeof hashes,
      description: '128bit（32文字）- 高速だが暗号学的には非推奨',
      useCase: 'ファイル整合性チェック（非セキュア）'
    },
    {
      name: 'SHA-1',
      key: 'sha1' as keyof typeof hashes,
      description: '160bit（40文字）- 脆弱性があり非推奨',
      useCase: '旧システムとの互換性'
    },
    {
      name: 'SHA-256',
      key: 'sha256' as keyof typeof hashes,
      description: '256bit（64文字）- 現在推奨される標準',
      useCase: 'パスワードハッシュ、デジタル署名'
    },
    {
      name: 'SHA-512',
      key: 'sha512' as keyof typeof hashes,
      description: '512bit（128文字）- 最高レベルのセキュリティ',
      useCase: '高セキュリティが要求される用途'
    }
  ]

  const examples = [
    { name: '簡単なテキスト', text: 'Hello World' },
    { name: '日本語テキスト', text: 'こんにちは世界' },
    { name: 'パスワード例', text: 'MySecurePassword123!' },
    { name: '空文字列', text: '' }
  ]

  const copyAllHashes = () => {
    const allHashes = hashAlgorithms
      .map(algo => `${algo.name}: ${hashes[algo.key]}`)
      .join('\n')
    navigator.clipboard.writeText(`入力: ${inputText}\n\n${allHashes}`)
  }

  return (
    <ToolLayout
      title="ハッシュ生成"
      description="MD5、SHA-1、SHA-256、SHA-512ハッシュを生成します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <Textarea
            placeholder="ハッシュ化したいテキストを入力してください..."
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value)
              // リアルタイム生成（短いテキストの場合）
              if (e.target.value.length < 1000) {
                generateHashes()
              }
            }}
            className="min-h-[120px]"
          />
          <div className="mt-1 text-sm text-gray-500">
            文字数: {inputText.length.toLocaleString()}
          </div>
        </div>

        <Button onClick={generateHashes} className="w-full">
          ハッシュ生成
        </Button>

        {(hashes.md5 || hashes.sha1 || hashes.sha256 || hashes.sha512) && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成されたハッシュ</CardTitle>
                <Button onClick={copyAllHashes} variant="outline" size="sm">
                  すべてコピー
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hashAlgorithms.map(algo => (
                <div key={algo.key} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{algo.name}</h4>
                      <p className="text-sm text-gray-600">{algo.description}</p>
                    </div>
                    <CopyButton text={hashes[algo.key]} />
                  </div>
                  
                  {hashes[algo.key] && (
                    <div className="bg-gray-50 p-3 rounded-lg mt-2">
                      <code className="font-mono text-sm break-all">
                        {hashes[algo.key]}
                      </code>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    用途: {algo.useCase}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>サンプルテキスト</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{example.name}</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputText(example.text)}
                    >
                      使用
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                    {example.text || '(空文字列)'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ハッシュアルゴリズムについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">ハッシュ関数の特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>一方向性</strong>: ハッシュ値から元のデータを復元することは困難</li>
                  <li><strong>決定性</strong>: 同じ入力は常に同じハッシュ値を生成</li>
                  <li><strong>雪崩効果</strong>: 入力の僅かな変更でハッシュ値が大きく変化</li>
                  <li><strong>固定長</strong>: 入力の長さに関係なく出力は固定長</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">セキュリティレベル</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span><strong>MD5・SHA-1</strong>: 脆弱性が発見されており、セキュリティ用途には非推奨</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span><strong>SHA-256</strong>: 現在推奨される標準的なハッシュアルゴリズム</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span><strong>SHA-512</strong>: より高いセキュリティレベルを提供</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">主な用途</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ファイルの整合性チェック</li>
                  <li>パスワードの安全な保存（ソルト付き）</li>
                  <li>デジタル署名</li>
                  <li>ブロックチェーンとマイニング</li>
                  <li>重複検出</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">重要な注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>パスワード保存時は必ずソルトを使用してください</li>
                  <li>MD5とSHA-1は暗号学的用途には使用しないでください</li>
                  <li>レインボーテーブル攻撃に注意してください</li>
                  <li>機密データのハッシュ化には適切なライブラリを使用してください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}