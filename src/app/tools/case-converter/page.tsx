'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState('')
  const [results, setResults] = useState<{
    uppercase: string
    lowercase: string
    capitalize: string
    camelCase: string
    pascalCase: string
    snakeCase: string
    kebabCase: string
    constantCase: string
    alternating: string
    inverse: string
  }>({
    uppercase: '',
    lowercase: '',
    capitalize: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
    constantCase: '',
    alternating: '',
    inverse: ''
  })

  const convertCases = () => {
    if (!inputText) return

    const text = inputText.trim()
    
    // 基本的な変換
    const uppercase = text.toUpperCase()
    const lowercase = text.toLowerCase()
    
    // 単語の最初の文字を大文字に
    const capitalize = text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
    
    // キャメルケース（最初の単語は小文字、以降は大文字）
    const words = text.toLowerCase().split(/[\s\-_]+/)
    const camelCase = words[0] + words.slice(1).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
    
    // パスカルケース（すべての単語の最初を大文字）
    const pascalCase = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')
    
    // スネークケース
    const snakeCase = words.join('_')
    
    // ケバブケース
    const kebabCase = words.join('-')
    
    // 定数ケース
    const constantCase = words.join('_').toUpperCase()
    
    // 交互ケース
    let alternating = ''
    let shouldUpper = true
    for (const char of text) {
      if (/[a-zA-Z]/.test(char)) {
        alternating += shouldUpper ? char.toUpperCase() : char.toLowerCase()
        shouldUpper = !shouldUpper
      } else {
        alternating += char
      }
    }
    
    // 逆転ケース（大文字↔小文字）
    const inverse = text.split('').map(char => {
      if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return char.toLowerCase()
      } else if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return char.toUpperCase()
      }
      return char
    }).join('')

    setResults({
      uppercase,
      lowercase,
      capitalize,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase,
      alternating,
      inverse
    })
  }

  const conversions = [
    { name: '大文字', key: 'uppercase' as keyof typeof results, description: 'すべて大文字' },
    { name: '小文字', key: 'lowercase' as keyof typeof results, description: 'すべて小文字' },
    { name: '文頭大文字', key: 'capitalize' as keyof typeof results, description: '各単語の最初を大文字' },
    { name: 'キャメルケース', key: 'camelCase' as keyof typeof results, description: 'camelCase形式' },
    { name: 'パスカルケース', key: 'pascalCase' as keyof typeof results, description: 'PascalCase形式' },
    { name: 'スネークケース', key: 'snakeCase' as keyof typeof results, description: 'snake_case形式' },
    { name: 'ケバブケース', key: 'kebabCase' as keyof typeof results, description: 'kebab-case形式' },
    { name: '定数ケース', key: 'constantCase' as keyof typeof results, description: 'CONSTANT_CASE形式' },
    { name: '交互ケース', key: 'alternating' as keyof typeof results, description: 'aLtErNaTiNg形式' },
    { name: '逆転ケース', key: 'inverse' as keyof typeof results, description: '大文字↔小文字を逆転' }
  ]

  return (
    <ToolLayout
      title="大文字小文字変換"
      description="英字の大文字・小文字変換と各種ケース変換を行います"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <Textarea
            placeholder="変換したいテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button onClick={convertCases} className="w-full" disabled={!inputText}>
          変換実行
        </Button>

        {results.uppercase && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">変換結果</h3>
            
            {conversions.map((conversion) => (
              <Card key={conversion.key}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{conversion.name}</CardTitle>
                      <p className="text-sm text-gray-600">{conversion.description}</p>
                    </div>
                    <CopyButton text={results[conversion.key]} />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm break-all">
                    {results[conversion.key]}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>各ケースの説明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">プログラミングでよく使われるケース</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>キャメルケース</strong>: JavaScript、Javaの変数名など</li>
                  <li><strong>パスカルケース</strong>: クラス名、コンポーネント名など</li>
                  <li><strong>スネークケース</strong>: Python、SQLの変数名など</li>
                  <li><strong>ケバブケース</strong>: CSS、HTMLの属性値など</li>
                  <li><strong>定数ケース</strong>: 定数、環境変数名など</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">変換例</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p><span className="text-blue-600">hello world example</span></p>
                  <p>→ キャメルケース: <span className="font-mono">helloWorldExample</span></p>
                  <p>→ パスカルケース: <span className="font-mono">HelloWorldExample</span></p>
                  <p>→ スネークケース: <span className="font-mono">hello_world_example</span></p>
                  <p>→ ケバブケース: <span className="font-mono">hello-world-example</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}