'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Language = 'javascript' | 'html' | 'css' | 'json' | 'xml'
type Mode = 'format' | 'minify'

export default function CodeFormatterTool() {
  const [inputCode, setInputCode] = useState('')
  const [outputCode, setOutputCode] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [mode, setMode] = useState<Mode>('format')
  const [indentSize, setIndentSize] = useState('2')
  const [error, setError] = useState('')

  const formatJavaScript = (code: string, indent: number): string => {
    // 基本的なJavaScript整形（簡易版）
    let formatted = code
    let indentLevel = 0
    let result = ''
    let inString = false
    let stringChar = ''
    
    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]
      const prevChar = formatted[i - 1]
      const nextChar = formatted[i + 1]
      
      // 文字列の開始・終了を追跡
      if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
          stringChar = ''
        }
      }
      
      if (!inString) {
        if (char === '{' || char === '[') {
          result += char
          if (nextChar !== '}' && nextChar !== ']') {
            result += '\n' + ' '.repeat((indentLevel + 1) * indent)
            indentLevel++
          }
        } else if (char === '}' || char === ']') {
          if (prevChar !== '{' && prevChar !== '[') {
            indentLevel--
            result += '\n' + ' '.repeat(indentLevel * indent)
          }
          result += char
        } else if (char === ';') {
          result += char
          if (nextChar && nextChar !== '\n' && nextChar !== '}') {
            result += '\n' + ' '.repeat(indentLevel * indent)
          }
        } else if (char === ',') {
          result += char
          if (nextChar && nextChar !== '\n' && nextChar !== ' ') {
            result += '\n' + ' '.repeat(indentLevel * indent)
          }
        } else if (char === '\n' || char === '\t') {
          // 既存の改行やタブをスキップ
          continue
        } else {
          result += char
        }
      } else {
        result += char
      }
    }
    
    return result.trim()
  }

  const formatHTML = (code: string, indent: number): string => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(code, 'text/html')
      
      if (doc.querySelector('parsererror')) {
        throw new Error('HTML parsing failed')
      }
      
      const formatElement = (element: Element, level: number = 0): string => {
        const tagName = element.tagName.toLowerCase()
        const attributes = Array.from(element.attributes)
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ')
        
        const indent_str = ' '.repeat(level * indent)
        let result = `${indent_str}<${tagName}`
        
        if (attributes) {
          result += ` ${attributes}`
        }
        
        if (element.children.length === 0 && !element.textContent?.trim()) {
          return `${result} />`
        }
        
        result += '>'
        
        if (element.textContent?.trim() && element.children.length === 0) {
          result += element.textContent.trim()
        } else {
          result += '\n'
          
          Array.from(element.children).forEach(child => {
            result += formatElement(child, level + 1) + '\n'
          })
          
          result += indent_str
        }
        
        result += `</${tagName}>`
        return result
      }
      
      if (doc.documentElement) {
        return formatElement(doc.documentElement)
      }
      
      return code
    } catch (error) {
      throw new Error('HTML整形に失敗しました')
    }
  }

  const formatCSS = (code: string, indent: number): string => {
    let formatted = code
    let result = ''
    let indentLevel = 0
    let inRule = false
    
    // 基本的なCSS整形
    formatted = formatted.replace(/\s+/g, ' ').trim()
    
    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i]
      const nextChar = formatted[i + 1]
      
      if (char === '{') {
        inRule = true
        result += ' {\n'
        indentLevel++
      } else if (char === '}') {
        inRule = false
        indentLevel--
        result += '\n' + ' '.repeat(indentLevel * indent) + '}'
        if (nextChar && nextChar !== '}') {
          result += '\n\n'
        }
      } else if (char === ';' && inRule) {
        result += ';\n' + ' '.repeat(indentLevel * indent)
      } else if (char === ',' && !inRule) {
        result += ',\n' + ' '.repeat(indentLevel * indent)
      } else if (char === ' ' && (result.endsWith('\n') || result.endsWith(' '))) {
        // 連続するスペースをスキップ
        continue
      } else {
        if (result.endsWith('\n') && char !== ' ') {
          result += ' '.repeat(indentLevel * indent)
        }
        result += char
      }
    }
    
    return result.trim()
  }

  const formatJSON = (code: string, indent: number): string => {
    const parsed = JSON.parse(code)
    return JSON.stringify(parsed, null, indent)
  }

  const formatXML = (code: string, indent: number): string => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(code, 'application/xml')
      
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('XML parsing failed')
      }
      
      const formatXMLElement = (element: Element, level: number = 0): string => {
        const tagName = element.tagName
        const attributes = Array.from(element.attributes)
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ')
        
        const indent_str = ' '.repeat(level * indent)
        let result = `${indent_str}<${tagName}`
        
        if (attributes) {
          result += ` ${attributes}`
        }
        
        if (element.children.length === 0 && !element.textContent?.trim()) {
          return `${result} />`
        }
        
        result += '>'
        
        if (element.textContent?.trim() && element.children.length === 0) {
          result += element.textContent.trim()
        } else {
          result += '\n'
          
          Array.from(element.children).forEach(child => {
            result += formatXMLElement(child, level + 1) + '\n'
          })
          
          result += indent_str
        }
        
        result += `</${tagName}>`
        return result
      }
      
      if (xmlDoc.documentElement) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + formatXMLElement(xmlDoc.documentElement)
      }
      
      return code
    } catch (error) {
      throw new Error('XML整形に失敗しました')
    }
  }

  const minifyCode = (code: string, lang: Language): string => {
    switch (lang) {
      case 'javascript':
        return code.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim()
      case 'html':
        return code.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
      case 'css':
        return code.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').replace(/{\s*/g, '{').trim()
      case 'json':
        return JSON.stringify(JSON.parse(code))
      case 'xml':
        return code.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
      default:
        return code
    }
  }

  const processCode = () => {
    setError('')
    
    if (!inputCode.trim()) {
      setOutputCode('')
      return
    }

    try {
      const indent = parseInt(indentSize)
      let result = ''
      
      if (mode === 'format') {
        switch (language) {
          case 'javascript':
            result = formatJavaScript(inputCode, indent)
            break
          case 'html':
            result = formatHTML(inputCode, indent)
            break
          case 'css':
            result = formatCSS(inputCode, indent)
            break
          case 'json':
            result = formatJSON(inputCode, indent)
            break
          case 'xml':
            result = formatXML(inputCode, indent)
            break
        }
      } else {
        result = minifyCode(inputCode, language)
      }
      
      setOutputCode(result)
    } catch (err) {
      setError(`${language.toUpperCase()}処理エラー: ${(err as Error).message}`)
      setOutputCode('')
    }
  }

  const examples = {
    javascript: `function calculateTotal(items) {
const total = items.reduce((sum, item) => {
return sum + item.price * item.quantity;
}, 0);
return total;
}`,
    html: `<!DOCTYPE html>
<html><head><title>Sample</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML.</p></div></body></html>`,
    css: `.container { display: flex; justify-content: center; align-items: center; height: 100vh; } h1 { color: #333; font-size: 2rem; }`,
    json: `{"name":"田中太郎","age":30,"address":{"city":"東京","country":"Japan"},"hobbies":["読書","映画鑑賞"]}`,
    xml: `<?xml version="1.0"?><root><person><name>田中太郎</name><age>30</age></person></root>`
  }

  return (
    <ToolLayout
      title="コード整形ツール"
      description="JavaScript・HTML・CSS・JSON・XMLコードの整形・縮小を行います"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">言語</label>
            <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">処理モード</label>
            <Select value={mode} onValueChange={(value: Mode) => setMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="format">整形（フォーマット）</SelectItem>
                <SelectItem value="minify">縮小（ミニファイ）</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {mode === 'format' && (
            <div>
              <label className="block text-sm font-medium mb-2">インデントサイズ</label>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2スペース</SelectItem>
                  <SelectItem value="4">4スペース</SelectItem>
                  <SelectItem value="8">8スペース</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">コード入力</label>
          <Textarea
            placeholder={`${language.toUpperCase()}コードを入力してください...`}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={processCode} className="flex-1" disabled={!inputCode.trim()}>
            {mode === 'format' ? '整形実行' : '縮小実行'}
          </Button>
          <Button 
            onClick={() => setInputCode(examples[language])} 
            variant="outline"
          >
            サンプル使用
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {outputCode && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{mode === 'format' ? '整形結果' : '縮小結果'}</CardTitle>
                <CopyButton text={outputCode} />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={outputCode}
                readOnly
                className="min-h-[200px] bg-gray-50 font-mono text-sm"
              />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>入力: {inputCode.length.toLocaleString()}文字</span>
                <span>出力: {outputCode.length.toLocaleString()}文字</span>
                <span>
                  {mode === 'format' 
                    ? `+${(outputCode.length - inputCode.length).toLocaleString()}文字`
                    : `${(inputCode.length - outputCode.length).toLocaleString()}文字削減`
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>サンプルコード</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{language.toUpperCase()}サンプル</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInputCode(examples[language])}
                  >
                    使用
                  </Button>
                </div>
                <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                  <code>{examples[language]}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">対応言語</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>JavaScript - 関数やオブジェクトの基本的な整形</li>
                  <li>HTML - タグの階層構造に基づく整形</li>
                  <li>CSS - セレクタとプロパティの整形</li>
                  <li>JSON - 標準的なJSON整形・縮小</li>
                  <li>XML - タグ構造に基づくXML整形</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">整形機能</h4>
                <p>
                  コードを読みやすい形式に整形します。
                  インデントサイズを選択して、一貫したコードスタイルを適用できます。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">縮小機能</h4>
                <p>
                  不要な空白や改行を削除してコードサイズを最小化します。
                  本番環境での配信やストレージ節約に使用します。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}