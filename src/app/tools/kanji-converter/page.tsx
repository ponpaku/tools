'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ConversionType = 'toEn' | 'toJa' | 'inComma'
type ToEnOption = 'normal' | 'withComma' | 'withScale'
type ToJaOption = 'noScale' | 'withScale' | 'onlyScale'

export default function KanjiConverterPage() {
  const [inputText, setInputText] = useState('')
  const [conversionType, setConversionType] = useState<ConversionType>('toEn')
  const [toEnOption, setToEnOption] = useState<ToEnOption>('normal')
  const [toJaOption, setToJaOption] = useState<ToJaOption>('withScale')

  // 基本定数の定義
  const numbers = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
  const units = ["", "一", "十", "百", "千"]
  const scales = ["", "万", "億", "兆", "京"]

  // 年月日の西暦表記と日本語表記にマッチするパターン
  const datePattern = /\b\d{4}([-\/])\d{1,2}\1\d{1,2}\b/g
  const jaDatePattern = /（?(?:(..)(\d+)年)?(\d+)月(\d+)日）?/g

  // 全角数字→半角数字
  const zen2Han = (text: string): string => {
    return text.replace(/[０-９]/g, (n) => 
      String("０１２３４５６７８９".indexOf(n))
    )
  }

  // 年月日漢数字→半角数字
  const kan2Han = (text: string): string => {
    return text.replace(/[〇一二三四五六七八九]/g, (n) =>
      String("〇一二三四五六七八九".indexOf(n))
    )
  }

  // 半角数字→漢数字
  const han2Kan = (text: string): string => {
    return text.replace(/[0-9]/g, (n) => numbers[parseInt(n)])
  }

  // 日付を日本表記に変換
  const convert2JaDate = (text: string): string => {
    return text.replace(datePattern, (match) => {
      const date = new Date(match)
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      return `${y}年${m}月${d}日`
    })
  }

  // 数字に含まれるカンマを削除
  const delComma = (text: string): string => {
    return text.replace(/(\d),(?=\d)/g, "$1")
  }

  // 単位のみ漢数字で挿入
  const insertKansujiUnits = (number: string): string => {
    const numStr = String(number).split("").reverse().join("")
    let result = ""

    for (let i = 0; i < numStr.length; i++) {
      const digit = numStr[i]
      if (i % 4 === 0 && i > 0) {
        result = scales[i / 4] + result
      }
      result = digit + result
    }
    return result
  }

  // 3文字ごとにカンマを挿入
  const splitComma = (text: string): string => {
    let placeholders: string[] = []
    let tempText = text

    // 年月日表記にマッチする部分を一時的に置換
    tempText = tempText.replace(datePattern, (match) => {
      placeholders.push(match)
      return "DATE_PLACEHOLDER"
    })
    tempText = tempText.replace(jaDatePattern, (match) => {
      placeholders.push(match)
      return "DATE_PLACEHOLDER"
    })

    // 数値に3桁ごとにカンマを挿入
    tempText = tempText.replace(/[1-9][0-9]*/gm, (num) => {
      return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    })

    // 年月日の表記のプレースホルダーを元に戻す
    placeholders.forEach((placeholder) => {
      tempText = tempText.replace("DATE_PLACEHOLDER", placeholder)
    })

    return tempText
  }

  // 漢数字変換のメインロジック
  const han2KanWithScaleMainLogic = (text: string): string => {
    let result = text

    // 万、億、兆、京の単位を処理
    result = result.replace(
      /(?<=[〇一二三四五六七八九十百千])[万億兆京]/gm,
      (t, offset, txt) => {
        const digits = "一万億兆京"
        let output = t
        for (let i = 0; i < digits.indexOf(t); i++) {
          if (
            i !== digits.indexOf(t) - 1 &&
            !txt.includes(digits.at(digits.indexOf(t) - i - 1)!)
          ) {
            output += "0000" + digits.at(digits.indexOf(t) - i - 1)
          } else if (
            i === digits.indexOf(t) - 1 &&
            !txt
              .substring(offset + 1)
              .match(/[〇一二三四五六七八九十百千万億兆京]/)
          ) {
            output += "0000"
          } else {
            break
          }
        }
        return output
      }
    )

    // 千、百、十、一の桁を処理
    result = result.replace(
      /([〇一二三四五六七八九](?=千))?(千)?([〇一二三四五六七八九](?=百))?(百)?([〇一二三四五六七八九](?=十))?(十)?([〇一二三四五六七八九])?/gm,
      (str, n0, d0, n1, d1, n2, d2, n3) => {
        const n = [n0, n1, n2, n3]
        const d = [d0, d1, d2, ""]
        const resultArray = [0, 0, 0, 0]
        
        // 数字がない場合は0を追加
        if (!d0 && !d1 && !d2 && !n3) {
          return ""
        }
        
        for (let i = 0; i < 4; i++) {
          if (n[i]) {
            resultArray[i] = "〇一二三四五六七八九".indexOf(n[i])
          } else if (d[i]) {
            resultArray[i] = 1
          } else if (!n[i] && !d[i]) {
            resultArray[i] = 0
          }
        }
        return resultArray.join("")
      }
    )

    // 万、億、兆、京の単位を削除
    result = result.replace(/(?<=[0-9])[万億兆京]/gm, () => "")
    // 不要なゼロを削除
    result = result.replace(/(?<![0-9万億兆京])0+/gm, () => "")
    return result
  }

  // 漢数字→英数字
  const kan2HanWithScale = (text: string, option: string): string => {
    let result = text

    // 年を変換
    result = result.replace(/[一二三四五六七八九〇]{2,4}年/g, (match) => {
      return kan2Han(match)
    })
    // 月を変換
    result = result.replace(/[一二三四五六七八九〇十]{1,2}月/g, (match) => {
      return kan2Han(match)
    })
    // 日を変換
    result = result.replace(/[一二三四五六七八九〇十]{1,3}日/g, (match) => {
      return kan2Han(match)
    })

    // 漢数字を塊ごとに置換
    result = result.replace(
      /([一二三四五六七八九〇]{0,4}千?[一二三四五六七八九〇]{0,4}百?([一二三四五六七八九〇]{0,4}十?[一二三四五六七八九〇]{0,4})?[万億兆京]?)+/gm,
      (t) => {
        // 不正な並びがないかを確認（例：六五万(正：六十五万)）
        if (!t.match(/(?:[一二三四五六七八九]{2,})[万億兆京]/)) {
          // 適切な塊は置換に回す
          let temp = han2KanWithScaleMainLogic(t)
          if (option === "withComma") {
            temp = splitComma(temp)
          } else if (option === "withScale") {
            temp = insertKansujiUnits(temp)
          }
          return temp
        }
        return t
      }
    )

    return result
  }

  // 数字→単位なし漢数字（一二三四五）
  const han2KanNoScale = (text: string): string => {
    let result = zen2Han(text)
    result = convert2JaDate(result)
    result = delComma(result)

    return result.replace(/[0-9]+/g, (num) => {
      let output = ""
      for (let i = 0; i < num.length; i++) {
        output += numbers[parseInt(num.charAt(i))]
      }
      return output
    })
  }

  // 数字→単位あり漢数字（一万二千三百四十五）
  const han2KanWithScale = (text: string): string => {
    let result = zen2Han(text)
    result = convert2JaDate(result)
    result = delComma(result)

    // 先に年数のみ変換する
    result = result.replace(jaDatePattern, (match) => {
      return match.replace(/[0-9]{2,4}年/g, (y) => {
        return han2Kan(y)
      })
    })

    return result.replace(/[1-9][0-9]*/gm, (num) => {
      // 変換後の文字列を格納する変数
      let output = ""

      // 20桁以上の数値は変換せずにそのまま返す
      if (num.length > 20) return num

      // 数値を4桁ごとに分割して処理(ブロック)
      for (let i = 0; i < Math.ceil(num.length / 4); i++) {
        // i個目の4桁を取得
        const num4 = num.substring(num.length - 4 * i - 4, num.length - 4 * i) || ""
        if (num4.length === 0) continue

        // '0000'以外の場合に変換
        if (num4 !== "0000") {
          // 1ブロックごとに変換
          let blockResult = ""
          for (let j = 0; j < num4.length; j++) {
            const digit = num4.length - j // 桁数（何桁目か）
            const n = parseInt(num4[j])

            if (n === 0) {
              // '0'は無視
              continue
            } else if (n === 1 && digit > 1) {
              // '1'の場合は桁の単位のみを使用（ただし一の位は「一」と表記）
              blockResult += units[digit]
            } else {
              // それ以外の数字は通常通り変換
              blockResult += numbers[n] + (digit > 1 ? units[digit] : "")
            }
          }
          // 変換したブロックを繋げる
          output = blockResult + (i > 0 ? scales[i] : "") + output
        }
      }

      // 最終的な変換結果を返す（空の場合は「〇」）
      return output || "〇"
    })
  }

  // 数字→位あり半角数字（1万2345）
  const han2WithScale = (text: string): string => {
    let result = zen2Han(text)
    result = convert2JaDate(result)
    result = delComma(result)

    return result.replace(/[1-9][0-9]*/gm, (num) => {
      // 変換後の文字列を格納する変数
      let output = ""

      // 20桁以上の数値は変換せずにそのまま返す
      if (num.length > 20) return num

      // 数値を4桁ごとに分割して処理(ブロック)
      for (let i = 0; i < Math.ceil(num.length / 4); i++) {
        // i個目の4桁を取得
        const num4 = num.substring(num.length - 4 * i - 4, num.length - 4 * i)
        if (num4.length === 0) continue

        output = num4 + (i > 0 ? scales[i] : "") + output
      }
      // 最終的な変換結果を返す
      return output
    })
  }

  // メイン変換関数
  const convertText = useMemo(() => {
    if (!inputText.trim()) return ''

    try {
      switch (conversionType) {
        case 'toEn':
          return kan2HanWithScale(inputText, toEnOption)
        case 'toJa':
          switch (toJaOption) {
            case 'noScale':
              return han2KanNoScale(inputText)
            case 'withScale':
              return han2KanWithScale(inputText)
            case 'onlyScale':
              return han2WithScale(inputText)
            default:
              return inputText
          }
        case 'inComma':
          return splitComma(inputText)
        default:
          return inputText
      }
    } catch (error) {
      console.error('変換エラー:', error)
      return '変換エラーが発生しました'
    }
  }, [inputText, conversionType, toEnOption, toJaOption])

  const swapTexts = () => {
    setInputText(convertText)
  }

  const clearTexts = () => {
    setInputText('')
  }

  const examples = [
    {
      name: '基本的な漢数字変換',
      input: '一万二千三百四十五',
      description: '漢数字を数字に変換'
    },
    {
      name: '大きな数の変換',
      input: '十二億三千四百五十六万七千八百九十',
      description: '億単位の漢数字変換'
    },
    {
      name: '数字を漢数字に変換',
      input: '123456789',
      description: '数字を単位付き漢数字に変換'
    },
    {
      name: '日付を含むテキスト',
      input: '令和五年十二月三十一日',
      description: '日付の自動認識と変換'
    },
    {
      name: '西暦日付の変換',
      input: '2024/01/15の会議',
      description: '西暦形式の日付変換'
    },
    {
      name: '混在テキスト',
      input: '売上は一億二千万円、前年比十五％増',
      description: '文章中の数字変換'
    }
  ]

  return (
    <ToolLayout
      title="高精度漢数字変換ツール"
      description="日本語の漢数字と算用数字を相互変換する高機能ツール"
    >
      <div className="space-y-6">
        {/* 変換設定 */}
        <Card>
          <CardHeader>
            <CardTitle>変換設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">変換タイプ</label>
              <Tabs value={conversionType} onValueChange={(value) => setConversionType(value as ConversionType)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="toEn">漢数字→数字</TabsTrigger>
                  <TabsTrigger value="toJa">数字→漢数字</TabsTrigger>
                  <TabsTrigger value="inComma">カンマ挿入</TabsTrigger>
                </TabsList>
                
                <TabsContent value="toEn" className="mt-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">出力オプション</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="normal"
                          name="toEnOption"
                          value="normal"
                          checked={toEnOption === 'normal'}
                          onChange={(e) => setToEnOption(e.target.value as ToEnOption)}
                          className="rounded"
                        />
                        <label htmlFor="normal" className="text-sm">通常変換</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="withComma"
                          name="toEnOption"
                          value="withComma"
                          checked={toEnOption === 'withComma'}
                          onChange={(e) => setToEnOption(e.target.value as ToEnOption)}
                          className="rounded"
                        />
                        <label htmlFor="withComma" className="text-sm">カンマ付き</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="withScale"
                          name="toEnOption"
                          value="withScale"
                          checked={toEnOption === 'withScale'}
                          onChange={(e) => setToEnOption(e.target.value as ToEnOption)}
                          className="rounded"
                        />
                        <label htmlFor="withScale" className="text-sm">単位付き</label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="toJa" className="mt-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">出力オプション</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="noScale"
                          name="toJaOption"
                          value="noScale"
                          checked={toJaOption === 'noScale'}
                          onChange={(e) => setToJaOption(e.target.value as ToJaOption)}
                          className="rounded"
                        />
                        <label htmlFor="noScale" className="text-sm">単位なし（一二三四五）</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="withScale"
                          name="toJaOption"
                          value="withScale"
                          checked={toJaOption === 'withScale'}
                          onChange={(e) => setToJaOption(e.target.value as ToJaOption)}
                          className="rounded"
                        />
                        <label htmlFor="withScale" className="text-sm">完全漢数字（一万二千三百四十五）</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="onlyScale"
                          name="toJaOption"
                          value="onlyScale"
                          checked={toJaOption === 'onlyScale'}
                          onChange={(e) => setToJaOption(e.target.value as ToJaOption)}
                          className="rounded"
                        />
                        <label htmlFor="onlyScale" className="text-sm">単位のみ漢字（1万2345）</label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="inComma" className="mt-4">
                  <p className="text-sm text-gray-600">
                    数字に3桁ごとのカンマを挿入します。日付表記は保護されます。
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* 操作ボタン */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={swapTexts} variant="outline" disabled={!convertText}>
            結果を入力に移動
          </Button>
          <Button onClick={clearTexts} variant="outline" disabled={!inputText}>
            入力をクリア
          </Button>
        </div>

        {/* テキスト入力・出力 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              入力テキスト - {inputText.length} 文字
            </label>
            <Textarea
              placeholder="変換したいテキストを入力してください..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              変換結果 - {convertText.length} 文字
            </label>
            <div className="relative">
              <Textarea
                value={convertText}
                readOnly
                className="min-h-[200px] font-mono text-sm bg-gray-50"
              />
              {convertText && (
                <div className="absolute top-2 right-2">
                  <CopyButton text={convertText} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用例 */}
        <Card>
          <CardHeader>
            <CardTitle>使用例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{example.name}</h4>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setInputText(example.input)}
                    >
                      使用
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm font-mono">{example.input}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ヘルプ情報 */}
        <Card>
          <CardHeader>
            <CardTitle>高精度漢数字変換ツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">主要機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>漢数字→数字変換</strong>: 一万二千三百四十五 → 12345</li>
                  <li><strong>数字→漢数字変換</strong>: 12345 → 一万二千三百四十五</li>
                  <li><strong>カンマ挿入</strong>: 1234567 → 1,234,567</li>
                  <li><strong>日付自動認識</strong>: 2024/01/15 ↔ 2024年1月15日</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">変換オプション詳細</h4>
                <div className="space-y-2">
                  <div>
                    <strong>漢数字→数字:</strong>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>通常変換: そのまま数字に変換</li>
                      <li>カンマ付き: 3桁ごとにカンマを挿入</li>
                      <li>単位付き: 万・億などの単位を漢字で保持</li>
                    </ul>
                  </div>
                  <div>
                    <strong>数字→漢数字:</strong>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>単位なし: 一二三四五（各桁をそのまま漢数字に）</li>
                      <li>完全漢数字: 一万二千三百四十五（正式な漢数字表記）</li>
                      <li>単位のみ漢字: 1万2345（単位だけ漢字）</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">高度な処理機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>4桁ブロック処理</strong>: 万・億・兆・京単位での正確な変換</li>
                  <li><strong>日付認識</strong>: 西暦と年月日表記の自動変換</li>
                  <li><strong>文脈保持</strong>: 文章中の数字のみを変換</li>
                  <li><strong>20桁制限</strong>: 極端に大きな数値の処理制限</li>
                  <li><strong>全角数字対応</strong>: ０１２３４５６７８９の自動変換</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">活用シーン</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>公的文書や契約書の作成</li>
                  <li>日本の伝統的な表記での文書作成</li>
                  <li>データ入力作業の効率化</li>
                  <li>多言語翻訳での数字表記統一</li>
                  <li>学習・教育での漢数字理解支援</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}