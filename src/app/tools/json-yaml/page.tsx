'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function JsonYamlPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'jsonToYaml' | 'yamlToJson'>('jsonToYaml')
  const [indentSize, setIndentSize] = useState('2')
  const [error, setError] = useState('')

  const convert = async () => {
    setError('')
    
    if (!inputText.trim()) {
      setOutputText('')
      return
    }

    try {
      const yaml = await import('js-yaml')
      
      if (mode === 'jsonToYaml') {
        // JSON → YAML
        const jsonData = JSON.parse(inputText)
        const yamlOutput = yaml.dump(jsonData, {
          indent: parseInt(indentSize),
          lineWidth: -1,
          noRefs: true,
          sortKeys: false
        })
        setOutputText(yamlOutput)
      } else {
        // YAML → JSON
        const yamlData = yaml.load(inputText)
        const jsonOutput = JSON.stringify(yamlData, null, parseInt(indentSize))
        setOutputText(jsonOutput)
      }
    } catch (err) {
      setError(`変換エラー: ${(err as Error).message}`)
      setOutputText('')
    }
  }

  const swapMode = () => {
    setMode(mode === 'jsonToYaml' ? 'yamlToJson' : 'jsonToYaml')
    setInputText(outputText)
    setOutputText(inputText)
    setError('')
  }

  const examples = [
    {
      name: '基本的なオブジェクト',
      json: `{
  "name": "田中太郎",
  "age": 30,
  "city": "東京",
  "married": true
}`,
      yaml: `name: 田中太郎
age: 30
city: 東京
married: true`
    },
    {
      name: '配列を含むデータ',
      json: `{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ],
  "total": 2
}`,
      yaml: `users:
  - id: 1
    name: Alice
  - id: 2
    name: Bob
total: 2`
    },
    {
      name: '設定ファイル形式',
      json: `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  },
  "features": {
    "logging": true,
    "cache": false
  }
}`,
      yaml: `database:
  host: localhost
  port: 5432
  name: myapp
features:
  logging: true
  cache: false`
    }
  ]

  return (
    <ToolLayout
      title="JsonYaml変換"
      description="JSONとYAMLの相互変換を行います"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">変換方向</label>
            <Select value={mode} onValueChange={(value: any) => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jsonToYaml">JSON → YAML</SelectItem>
                <SelectItem value="yamlToJson">YAML → JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">インデントサイズ</label>
            <Select value={indentSize} onValueChange={setIndentSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2スペース</SelectItem>
                <SelectItem value="4">4スペース</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={swapMode} disabled={!inputText && !outputText}>
            入出力を入れ替え
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'jsonToYaml' ? 'JSONテキスト' : 'YAMLテキスト'}
          </label>
          <Textarea
            placeholder={mode === 'jsonToYaml' ? 'JSONを入力してください...' : 'YAMLを入力してください...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Button onClick={convert} className="w-full" disabled={!inputText.trim()}>
          {mode === 'jsonToYaml' ? 'YAML に変換' : 'JSON に変換'}
        </Button>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {outputText && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                <CopyButton text={outputText} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[200px] bg-gray-50 font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                入力: {inputText.length.toLocaleString()}文字 → 出力: {outputText.length.toLocaleString()}文字
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">{example.name}</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-700">JSON</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setInputText(example.json)
                            setMode('jsonToYaml')
                          }}
                        >
                          使用
                        </Button>
                      </div>
                      <pre className="bg-blue-50 p-3 rounded text-xs overflow-x-auto">
                        <code>{example.json}</code>
                      </pre>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-700">YAML</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setInputText(example.yaml)
                            setMode('yamlToJson')
                          }}
                        >
                          使用
                        </Button>
                      </div>
                      <pre className="bg-green-50 p-3 rounded text-xs overflow-x-auto">
                        <code>{example.yaml}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON vs YAML</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">JSON (JavaScript Object Notation)</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>プログラミング言語に依存しない軽量データ交換フォーマット</li>
                    <li>API通信で最も広く使用される</li>
                    <li>厳密な構文規則（クォート必須等）</li>
                    <li>コメント不可</li>
                    <li>パースが高速</li>
                  </ul>
                  
                  <h5 className="font-semibold mt-3 mb-1">適用場面:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>REST API のデータ交換</li>
                    <li>Web アプリケーションの設定</li>
                    <li>NoSQL データベースのドキュメント</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">YAML (YAML Ain&apos;t Markup Language)</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>人間が読みやすい構造化データフォーマット</li>
                    <li>インデントで階層を表現</li>
                    <li>コメント記述可能</li>
                    <li>より自然な記述が可能</li>
                    <li>設定ファイルに適している</li>
                  </ul>
                  
                  <h5 className="font-semibold mt-3 mb-1">適用場面:</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Docker Compose や Kubernetes 設定</li>
                    <li>CI/CD パイプライン設定</li>
                    <li>アプリケーション設定ファイル</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">変換時の注意点</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>データ型</strong>: YAMLでは文字列クォートが任意、JSONでは必須</li>
                  <li><strong>コメント</strong>: YAML → JSON変換時にコメントは失われます</li>
                  <li><strong>インデント</strong>: YAMLはインデントが構文的に重要です</li>
                  <li><strong>特殊文字</strong>: YAML固有の構文は適切にエスケープされます</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用場面の例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>設定ファイルを人間が編集しやすいYAML形式で管理</li>
                  <li>APIとの通信用にJSON形式に変換</li>
                  <li>チーム間でのデータフォーマット統一</li>
                  <li>CI/CD設定の他のツールへの移行</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}