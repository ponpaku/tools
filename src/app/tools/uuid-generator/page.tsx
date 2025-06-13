'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UUIDGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [version, setVersion] = useState<'v1' | 'v4'>('v4')
  const [count, setCount] = useState('1')
  const [format, setFormat] = useState<'default' | 'uppercase' | 'no-hyphens' | 'braces'>('default')

  const generateUUIDs = async () => {
    try {
      const { v1, v4 } = await import('uuid')
      const generateFunc = version === 'v1' ? v1 : v4
      const quantity = Math.min(parseInt(count), 1000)
      
      const newUuids: string[] = []
      for (let i = 0; i < quantity; i++) {
        let uuid = generateFunc()
        
        // フォーマット適用
        switch (format) {
          case 'uppercase':
            uuid = uuid.toUpperCase()
            break
          case 'no-hyphens':
            uuid = uuid.replace(/-/g, '')
            break
          case 'braces':
            uuid = `{${uuid}}`
            break
        }
        
        newUuids.push(uuid)
      }
      
      setUuids(newUuids)
    } catch (error) {
      console.error('UUID生成エラー:', error)
      alert('UUID生成中にエラーが発生しました')
    }
  }

  const copyAllUUIDs = () => {
    const allUuids = uuids.join('\n')
    navigator.clipboard.writeText(allUuids)
  }

  const formatExamples = {
    default: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    uppercase: 'F47AC10B-58CC-4372-A567-0E02B2C3D479',
    'no-hyphens': 'f47ac10b58cc4372a5670e02b2c3d479',
    braces: '{f47ac10b-58cc-4372-a567-0e02b2c3d479}'
  }

  return (
    <ToolLayout
      title="UUID生成"
      description="UUID v1、v4を生成します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">UUIDバージョン</label>
            <Select value={version} onValueChange={(value: 'v1' | 'v4') => setVersion(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4">v4 (ランダム)</SelectItem>
                <SelectItem value="v1">v1 (タイムベース)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">生成個数</label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">フォーマット</label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">標準形式</SelectItem>
                <SelectItem value="uppercase">大文字</SelectItem>
                <SelectItem value="no-hyphens">ハイフンなし</SelectItem>
                <SelectItem value="braces">ブレース付き</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <strong>プレビュー:</strong> {formatExamples[format]}
        </div>

        <Button onClick={generateUUIDs} className="w-full">
          UUID生成
        </Button>

        {uuids.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成されたUUID ({uuids.length}個)</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAllUUIDs}>
                    全てコピー
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setUuids([])}>
                    クリア
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <code className="font-mono text-sm flex-1 mr-4">{uuid}</code>
                    <CopyButton text={uuid} className="flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>UUIDバージョンの違い</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">UUID v4 (推奨)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>完全にランダムな値を使用</li>
                  <li>個人情報や機器情報を含まない</li>
                  <li>最も一般的で安全な選択肢</li>
                  <li>データベースの主キー、セッションIDなどに適用</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">UUID v1</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>タイムスタンプとMACアドレスベース</li>
                  <li>時系列順序が保証される</li>
                  <li>生成時刻と機器の特定が可能</li>
                  <li>ログファイル、監査記録などに適用</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">データベース</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(255)
);`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">JavaScript/API</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`const sessionId = generateUUID(); // セッション識別子
const requestId = generateUUID();  // リクエスト追跡
const fileId = generateUUID();     // ファイル識別子`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">設定ファイル</h4>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "instanceId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "apiKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>注意事項</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>セキュリティ:</strong> UUID v4は暗号学的に安全なランダム値を使用</li>
                <li><strong>一意性:</strong> 実質的に重複の可能性はゼロ（2^122の組み合わせ）</li>
                <li><strong>パフォーマンス:</strong> インデックス性能を考慮する場合はULID等も検討</li>
                <li><strong>プライバシー:</strong> UUID v1はMACアドレスを含むため注意が必要</li>
                <li><strong>フォーマット:</strong> RFC 4122に準拠した標準形式を推奨</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}