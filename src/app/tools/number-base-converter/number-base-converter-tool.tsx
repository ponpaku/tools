'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type NumberBase = 'binary' | 'octal' | 'decimal' | 'hexadecimal'

interface ConversionState {
  binary: string
  octal: string
  decimal: string
  hexadecimal: string
  error: string
}

export default function NumberBaseConverterTool() {
  const [values, setValues] = useState<ConversionState>({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
    error: ''
  })

  const validateInput = (value: string, base: NumberBase): boolean => {
    if (!value.trim()) return true
    
    switch (base) {
      case 'binary':
        return /^[01]+$/.test(value)
      case 'octal':
        return /^[0-7]+$/.test(value)
      case 'decimal':
        return /^\d+$/.test(value)
      case 'hexadecimal':
        return /^[0-9A-Fa-f]+$/.test(value)
      default:
        return false
    }
  }

  const convertFromDecimal = (decimal: number): Omit<ConversionState, 'error'> => {
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hexadecimal: decimal.toString(16).toUpperCase()
    }
  }

  const convertToDecimal = (value: string, base: NumberBase): number | null => {
    if (!value.trim()) return null
    
    try {
      switch (base) {
        case 'binary':
          return parseInt(value, 2)
        case 'octal':
          return parseInt(value, 8)
        case 'decimal':
          return parseInt(value, 10)
        case 'hexadecimal':
          return parseInt(value, 16)
        default:
          return null
      }
    } catch {
      return null
    }
  }

  const handleInputChange = (value: string, base: NumberBase) => {
    // 入力値の検証
    if (!validateInput(value, base)) {
      setValues(prev => ({
        ...prev,
        [base]: value,
        error: `無効な${getBaseName(base)}です`
      }))
      return
    }

    // 空の場合は全てクリア
    if (!value.trim()) {
      setValues({
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: '',
        error: ''
      })
      return
    }

    // 10進数に変換
    const decimal = convertToDecimal(value, base)
    if (decimal === null || decimal < 0) {
      setValues(prev => ({
        ...prev,
        [base]: value,
        error: '変換できない値です'
      }))
      return
    }

    // 大きすぎる数値のチェック（JavaScriptの安全な整数範囲）
    if (!Number.isSafeInteger(decimal)) {
      setValues(prev => ({
        ...prev,
        [base]: value,
        error: '数値が大きすぎます'
      }))
      return
    }

    // 他の進数に変換
    const converted = convertFromDecimal(decimal)
    setValues({
      ...converted,
      error: ''
    })
  }

  const getBaseName = (base: NumberBase): string => {
    const names = {
      binary: '2進数',
      octal: '8進数',
      decimal: '10進数',
      hexadecimal: '16進数'
    }
    return names[base]
  }

  const getBaseInfo = (base: NumberBase) => {
    const info = {
      binary: { label: '2進数 (Binary)', placeholder: '1010', description: '0と1のみ' },
      octal: { label: '8進数 (Octal)', placeholder: '12', description: '0-7の数字のみ' },
      decimal: { label: '10進数 (Decimal)', placeholder: '10', description: '0-9の数字のみ' },
      hexadecimal: { label: '16進数 (Hexadecimal)', placeholder: 'A', description: '0-9とA-Fの文字' }
    }
    return info[base]
  }

  const clearAll = () => {
    setValues({
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: '',
      error: ''
    })
  }

  return (
    <ToolLayout
      title="進数変換"
      description="2進数・8進数・10進数・16進数の相互変換"
    >
      <div className="space-y-6">
        {/* 変換フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['binary', 'octal', 'decimal', 'hexadecimal'] as NumberBase[]).map((base) => {
            const info = getBaseInfo(base)
            return (
              <Card key={base}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{info.label}</CardTitle>
                    {values[base] && (
                      <CopyButton text={values[base]} />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardHeader>
                <CardContent>
                  <Input
                    value={values[base]}
                    onChange={(e) => handleInputChange(e.target.value, base)}
                    placeholder={info.placeholder}
                    className="font-mono text-lg"
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* エラー表示 */}
        {values.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{values.error}</p>
            </CardContent>
          </Card>
        )}

        {/* 操作ボタン */}
        <div className="flex justify-center">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            全てクリア
          </button>
        </div>

        {/* 使用例 */}
        <Card>
          <CardHeader>
            <CardTitle>変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="font-semibold">10進数</div>
                <div className="font-semibold">2進数</div>
                <div className="font-semibold">8進数</div>
                <div className="font-semibold">16進数</div>
              </div>
              
              {[
                { dec: '10', bin: '1010', oct: '12', hex: 'A' },
                { dec: '255', bin: '11111111', oct: '377', hex: 'FF' },
                { dec: '1024', bin: '10000000000', oct: '2000', hex: '400' },
                { dec: '65535', bin: '1111111111111111', oct: '177777', hex: 'FFFF' }
              ].map((example, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 text-sm bg-gray-50 p-2 rounded">
                  <div className="font-mono">{example.dec}</div>
                  <div className="font-mono text-blue-600">{example.bin}</div>
                  <div className="font-mono text-green-600">{example.oct}</div>
                  <div className="font-mono text-purple-600">{example.hex}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>進数変換について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">各進数の特徴</h4>
                <ul className="space-y-2">
                  <li><strong>2進数 (Binary)</strong>: コンピュータの基本。0と1のみで表現</li>
                  <li><strong>8進数 (Octal)</strong>: 3ビットずつグループ化。0-7の数字を使用</li>
                  <li><strong>10進数 (Decimal)</strong>: 日常的に使用する数字システム</li>
                  <li><strong>16進数 (Hexadecimal)</strong>: プログラミングでよく使用。0-9とA-Fを使用</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">使用場面</h4>
                <ul className="space-y-1">
                  <li>• プログラミング（メモリアドレス、カラーコード）</li>
                  <li>• デジタル回路設計</li>
                  <li>• コンピュータサイエンス学習</li>
                  <li>• システム管理（ファイル権限など）</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">使い方</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>任意の進数フィールドに数値を入力</li>
                  <li>他の進数への変換が自動的に実行されます</li>
                  <li>コピーボタンで結果をクリップボードにコピー可能</li>
                  <li>無効な文字が入力された場合はエラーが表示されます</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}