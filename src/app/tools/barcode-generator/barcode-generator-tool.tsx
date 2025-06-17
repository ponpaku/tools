'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type BarcodeType = 'code128' | 'code39' | 'ean13' | 'ean8'

export default function BarcodeGeneratorTool() {
  const [inputText, setInputText] = useState('')
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128')
  const [barcodeData, setBarcodeData] = useState('')
  const [error, setError] = useState('')

  // CODE 128 エンコーディング（簡略版）
  const generateCode128 = (data: string): string => {
    if (!data) return ''
    
    // CODE 128の基本パターン（簡略化）
    const patterns: Record<string, string> = {
      '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
      '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
      '8': '10001100100', '9': '11001001000', 'A': '11001000100', 'B': '11000100100',
      'C': '10110011100', 'D': '10011011100', 'E': '10011001110', 'F': '10111001000'
    }
    
    let result = '11010000100' // Start Code B
    
    for (const char of data.toUpperCase()) {
      result += patterns[char] || patterns['0']
    }
    
    result += '1100011101011' // Stop pattern
    return result
  }

  // CODE 39 エンコーディング
  const generateCode39 = (data: string): string => {
    if (!data) return ''
    
    const patterns: Record<string, string> = {
      '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
      '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
      '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
      'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
      'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
      'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
      'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
      'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
      'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
      ' ': '100101011011', '*': '100101101101'
    }
    
    let result = patterns['*'] // Start character
    
    for (const char of data.toUpperCase()) {
      result += patterns[char] || patterns['0']
      result += '0' // Inter-character gap
    }
    
    result += patterns['*'] // Stop character
    return result
  }

  // EAN-13 エンコーディング（簡略版）
  const generateEAN13 = (data: string): string => {
    if (data.length !== 13) return ''
    
    // EAN-13のパターン（簡略化）
    const leftOddPatterns: Record<string, string> = {
      '0': '0001101', '1': '0011001', '2': '0010011', '3': '0111101',
      '4': '0100011', '5': '0110001', '6': '0101111', '7': '0111011',
      '8': '0110111', '9': '0001011'
    }
    
    const leftEvenPatterns: Record<string, string> = {
      '0': '0100111', '1': '0110011', '2': '0011011', '3': '0100001',
      '4': '0011101', '5': '0111001', '6': '0000101', '7': '0010001',
      '8': '0001001', '9': '0010111'
    }
    
    const rightPatterns: Record<string, string> = {
      '0': '1110010', '1': '1100110', '2': '1101100', '3': '1000010',
      '4': '1011100', '5': '1001110', '6': '1010000', '7': '1000100',
      '8': '1001000', '9': '1110100'
    }
    
    let result = '101' // Start guard
    
    // 左側6桁
    for (let i = 1; i <= 6; i++) {
      const digit = data[i]
      if (i % 2 === 1) {
        result += leftOddPatterns[digit] || leftOddPatterns['0']
      } else {
        result += leftEvenPatterns[digit] || leftEvenPatterns['0']
      }
    }
    
    result += '01010' // Center guard
    
    // 右側6桁
    for (let i = 7; i <= 12; i++) {
      const digit = data[i]
      result += rightPatterns[digit] || rightPatterns['0']
    }
    
    result += '101' // End guard
    return result
  }

  const generateBarcode = () => {
    setError('')
    
    if (!inputText.trim()) {
      setError('テキストを入力してください')
      return
    }

    try {
      let barcodePattern = ''
      
      switch (barcodeType) {
        case 'code128':
          if (!/^[A-Za-z0-9\s]+$/.test(inputText)) {
            setError('CODE 128では英数字とスペースのみ使用できます')
            return
          }
          barcodePattern = generateCode128(inputText)
          break
          
        case 'code39':
          if (!/^[A-Z0-9\s\*]+$/.test(inputText.toUpperCase())) {
            setError('CODE 39では英大文字、数字、スペース、*のみ使用できます')
            return
          }
          barcodePattern = generateCode39(inputText)
          break
          
        case 'ean13':
          if (!/^\d{13}$/.test(inputText)) {
            setError('EAN-13では13桁の数字を入力してください')
            return
          }
          barcodePattern = generateEAN13(inputText)
          break
          
        case 'ean8':
          if (!/^\d{8}$/.test(inputText)) {
            setError('EAN-8では8桁の数字を入力してください')
            return
          }
          // EAN-8は簡略化のためEAN-13と同様の処理
          barcodePattern = generateEAN13(inputText.padStart(13, '0'))
          break
      }
      
      setBarcodeData(barcodePattern)
    } catch (err) {
      setError(`バーコード生成エラー: ${(err as Error).message}`)
    }
  }

  const renderBarcode = (pattern: string) => {
    if (!pattern) return null
    
    return (
      <div className="flex items-end justify-center bg-white p-4 border-2 border-gray-200 rounded-lg overflow-x-auto">
        {pattern.split('').map((bit, index) => (
          <div
            key={index}
            className={`inline-block ${bit === '1' ? 'bg-black' : 'bg-white'}`}
            style={{
              width: '2px',
              height: '60px',
              minWidth: '2px'
            }}
          />
        ))}
      </div>
    )
  }

  const downloadBarcode = () => {
    if (!barcodeData) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const barWidth = 2
    const barHeight = 60
    canvas.width = barcodeData.length * barWidth
    canvas.height = barHeight + 40
    
    // 背景を白に
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // バーコード描画
    ctx.fillStyle = 'black'
    barcodeData.split('').forEach((bit, index) => {
      if (bit === '1') {
        ctx.fillRect(index * barWidth, 20, barWidth, barHeight)
      }
    })
    
    // テキスト描画
    ctx.fillStyle = 'black'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(inputText, canvas.width / 2, canvas.height - 5)
    
    // ダウンロード
    const link = document.createElement('a')
    link.download = `barcode-${barcodeType}-${inputText}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const examples = {
    code128: '123456789',
    code39: 'HELLO123',
    ean13: '4901234567890',
    ean8: '12345678'
  }

  return (
    <ToolLayout
      title="バーコード生成"
      description="CODE128・CODE39・EAN13・EAN8バーコードを生成します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">バーコード形式</label>
            <Select value={barcodeType} onValueChange={(value: BarcodeType) => setBarcodeType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code128">CODE 128</SelectItem>
                <SelectItem value="code39">CODE 39</SelectItem>
                <SelectItem value="ean13">EAN-13</SelectItem>
                <SelectItem value="ean8">EAN-8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">データ入力</label>
            <Input
              placeholder={`例: ${examples[barcodeType]}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateBarcode} className="flex-1" disabled={!inputText.trim()}>
            バーコード生成
          </Button>
          <Button 
            onClick={() => setInputText(examples[barcodeType])} 
            variant="outline"
          >
            サンプル使用
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {barcodeData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>生成されたバーコード</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={downloadBarcode} size="sm" variant="outline">
                    PNG保存
                  </Button>
                  <CopyButton text={inputText} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderBarcode(barcodeData)}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">データ: {inputText}</p>
                <p className="text-sm text-gray-600">形式: {barcodeType.toUpperCase()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>バーコード形式について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">CODE 128</h4>
                <p>英数字と記号に対応した高密度バーコード。物流や製造業で広く使用。</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">CODE 39</h4>
                <p>英大文字、数字、一部記号に対応。工業用途で多用される古典的な形式。</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">EAN-13</h4>
                <p>13桁の数字による商品識別コード。JANコードとして日本で広く使用。</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">EAN-8</h4>
                <p>8桁の数字による短縮版商品コード。小さなパッケージ用。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}