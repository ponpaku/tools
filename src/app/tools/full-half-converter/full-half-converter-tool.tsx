'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FullHalfConverterTool() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [direction, setDirection] = useState<'toHalf' | 'toFull'>('toHalf')
  const [targetType, setTargetType] = useState<'all' | 'alphanumeric' | 'katakana' | 'symbols'>('all')

  const convertText = () => {
    let result = inputText

    if (direction === 'toHalf') {
      if (targetType === 'all' || targetType === 'alphanumeric') {
        // 全角英数字を半角に変換
        result = result.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (char) => {
          return String.fromCharCode(char.charCodeAt(0) - 0xFEE0)
        })
      }
      
      if (targetType === 'all' || targetType === 'katakana') {
        // 全角カタカナを半角に変換
        const fullKana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ'
        const halfKana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ'
        
        for (let i = 0; i < fullKana.length; i++) {
          result = result.replace(new RegExp(fullKana[i], 'g'), halfKana[i])
        }

        // 濁点・半濁点の処理
        result = result.replace(/ガ/g, 'ｶﾞ').replace(/ギ/g, 'ｷﾞ').replace(/グ/g, 'ｸﾞ').replace(/ゲ/g, 'ｹﾞ').replace(/ゴ/g, 'ｺﾞ')
        result = result.replace(/ザ/g, 'ｻﾞ').replace(/ジ/g, 'ｼﾞ').replace(/ズ/g, 'ｽﾞ').replace(/ゼ/g, 'ｾﾞ').replace(/ゾ/g, 'ｿﾞ')
        result = result.replace(/ダ/g, 'ﾀﾞ').replace(/ヂ/g, 'ﾁﾞ').replace(/ヅ/g, 'ﾂﾞ').replace(/デ/g, 'ﾃﾞ').replace(/ド/g, 'ﾄﾞ')
        result = result.replace(/バ/g, 'ﾊﾞ').replace(/ビ/g, 'ﾋﾞ').replace(/ブ/g, 'ﾌﾞ').replace(/ベ/g, 'ﾍﾞ').replace(/ボ/g, 'ﾎﾞ')
        result = result.replace(/パ/g, 'ﾊﾟ').replace(/ピ/g, 'ﾋﾟ').replace(/プ/g, 'ﾌﾟ').replace(/ペ/g, 'ﾍﾟ').replace(/ポ/g, 'ﾎﾟ')
        result = result.replace(/ヴ/g, 'ｳﾞ')
      }
      
      if (targetType === 'all' || targetType === 'symbols') {
        // 全角記号を半角に変換
        const symbolMap: Record<string, string> = {
          '　': ' ', '！': '!', '"': '"', '＃': '#', '＄': '$', '％': '%', '＆': '&',
          "'": "'", '（': '(', '）': ')', '＊': '*', '＋': '+', '，': ',', '－': '-',
          '．': '.', '／': '/', '：': ':', '；': ';', '＜': '<', '＝': '=', '＞': '>',
          '？': '?', '＠': '@', '［': '[', '￥': '\\', '］': ']', '＾': '^', '＿': '_',
          '｀': '`', '｛': '{', '｜': '|', '｝': '}', '～': '~'
        }
        
        Object.entries(symbolMap).forEach(([full, half]) => {
          result = result.replace(new RegExp(full.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), half)
        })
      }
    } else {
      // 半角から全角への変換
      if (targetType === 'all' || targetType === 'alphanumeric') {
        result = result.replace(/[A-Za-z0-9]/g, (char) => {
          return String.fromCharCode(char.charCodeAt(0) + 0xFEE0)
        })
      }
      
      if (targetType === 'all' || targetType === 'katakana') {
        // 半角カタカナを全角に変換
        const halfKana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ'
        const fullKana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ'
        
        // 濁点・半濁点の処理（先に処理）
        result = result.replace(/ｶﾞ/g, 'ガ').replace(/ｷﾞ/g, 'ギ').replace(/ｸﾞ/g, 'グ').replace(/ｹﾞ/g, 'ゲ').replace(/ｺﾞ/g, 'ゴ')
        result = result.replace(/ｻﾞ/g, 'ザ').replace(/ｼﾞ/g, 'ジ').replace(/ｽﾞ/g, 'ズ').replace(/ｾﾞ/g, 'ゼ').replace(/ｿﾞ/g, 'ゾ')
        result = result.replace(/ﾀﾞ/g, 'ダ').replace(/ﾁﾞ/g, 'ヂ').replace(/ﾂﾞ/g, 'ヅ').replace(/ﾃﾞ/g, 'デ').replace(/ﾄﾞ/g, 'ド')
        result = result.replace(/ﾊﾞ/g, 'バ').replace(/ﾋﾞ/g, 'ビ').replace(/ﾌﾞ/g, 'ブ').replace(/ﾍﾞ/g, 'ベ').replace(/ﾎﾞ/g, 'ボ')
        result = result.replace(/ﾊﾟ/g, 'パ').replace(/ﾋﾟ/g, 'ピ').replace(/ﾌﾟ/g, 'プ').replace(/ﾍﾟ/g, 'ペ').replace(/ﾎﾟ/g, 'ポ')
        result = result.replace(/ｳﾞ/g, 'ヴ')
        
        for (let i = 0; i < halfKana.length; i++) {
          result = result.replace(new RegExp(halfKana[i], 'g'), fullKana[i])
        }
      }
      
      if (targetType === 'all' || targetType === 'symbols') {
        const symbolMap: Record<string, string> = {
          ' ': '　', '!': '！', '"': '"', '#': '＃', '$': '＄', '%': '％', '&': '＆',
          "'": "'", '(': '（', ')': '）', '*': '＊', '+': '＋', ',': '，', '-': '－',
          '.': '．', '/': '／', ':': '：', ';': '；', '<': '＜', '=': '＝', '>': '＞',
          '?': '？', '@': '＠', '[': '［', '\\': '￥', ']': '］', '^': '＾', '_': '＿',
          '`': '｀', '{': '｛', '|': '｜', '}': '｝', '~': '～'
        }
        
        Object.entries(symbolMap).forEach(([half, full]) => {
          result = result.replace(new RegExp(half.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), full)
        })
      }
    }

    setOutputText(result)
  }

  return (
    <ToolLayout
      title="全角半角変換"
      description="全角・半角文字の相互変換を行います"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">変換方向</label>
            <Select value={direction} onValueChange={(value: 'toHalf' | 'toFull') => setDirection(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toHalf">全角 → 半角</SelectItem>
                <SelectItem value="toFull">半角 → 全角</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">変換対象</label>
            <Select value={targetType} onValueChange={(value: any) => setTargetType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="alphanumeric">英数字のみ</SelectItem>
                <SelectItem value="katakana">カタカナのみ</SelectItem>
                <SelectItem value="symbols">記号のみ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">入力テキスト</label>
          <Textarea
            placeholder="変換したいテキストを入力してください..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button onClick={convertText} className="w-full" disabled={!inputText}>
          変換実行
        </Button>

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
                className="min-h-[120px] bg-gray-50"
              />
              <div className="mt-2 text-sm text-gray-600">
                入力: {inputText.length}文字 → 出力: {outputText.length}文字
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>変換例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">英数字</h4>
                <p><span className="bg-blue-100 px-2 py-1 rounded">ＡＢＣ１２３</span> ↔ <span className="bg-green-100 px-2 py-1 rounded">ABC123</span></p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">カタカナ</h4>
                <p><span className="bg-blue-100 px-2 py-1 rounded">アイウエオ</span> ↔ <span className="bg-green-100 px-2 py-1 rounded">ｱｲｳｴｵ</span></p>
                <p><span className="bg-blue-100 px-2 py-1 rounded">ガギグゲゴ</span> ↔ <span className="bg-green-100 px-2 py-1 rounded">ｶﾞｷﾞｸﾞｹﾞｺﾞ</span></p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">記号</h4>
                <p><span className="bg-blue-100 px-2 py-1 rounded">！？（）</span> ↔ <span className="bg-green-100 px-2 py-1 rounded">!?()</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                この全角半角変換ツールは、日本語入力でよく必要となる文字幅の統一作業を効率化します。
              </p>
              <div>
                <h4 className="font-semibold mb-2">主な特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>英数字・カタカナ・記号の全角⇔半角変換</li>
                  <li>濁点・半濁点付きカタカナの正確な変換</li>
                  <li>変換対象の種類別フィルタリング</li>
                  <li>リアルタイム文字数表示</li>
                  <li>完全無料・登録不要・オフライン対応</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>データ入力時の文字幅統一</li>
                  <li>フォーム入力の文字制限対応</li>
                  <li>プログラムコード・設定ファイルの整形</li>
                  <li>文書作成時の表記統一</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}