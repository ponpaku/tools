'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CharacterCounterTool() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    const lines = text.split('\n')
    const nonEmptyLines = lines.filter(line => line.trim() !== '')
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim() !== '').length
    
    // 文字種別カウント
    const hiragana = (text.match(/[\u3041-\u3096]/g) || []).length
    const katakana = (text.match(/[\u30A1-\u30F6]/g) || []).length
    const kanji = (text.match(/[\u4E00-\u9FAF]/g) || []).length
    const alphabets = (text.match(/[a-zA-Z]/g) || []).length
    const numbers = (text.match(/[0-9]/g) || []).length
    const symbols = (text.match(/[^\w\s\u3041-\u3096\u30A1-\u30F6\u4E00-\u9FAF]/g) || []).length
    const spaces = (text.match(/\s/g) || []).length

    // バイト数計算
    const utf8Bytes = new TextEncoder().encode(text).length
    const sjisBytes = text.length * 2 // 概算（正確にはShift_JISエンコーディングが必要）

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      lines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      words,
      paragraphs,
      hiragana,
      katakana,
      kanji,
      alphabets,
      numbers,
      symbols,
      spaces,
      utf8Bytes,
      sjisBytes
    }
  }, [text])

  const resultText = `文字数統計
============
総文字数: ${stats.characters}
文字数（空白除く）: ${stats.charactersNoSpaces}
行数: ${stats.lines}
非空行数: ${stats.nonEmptyLines}
単語数: ${stats.words}
段落数: ${stats.paragraphs}

文字種別
--------
ひらがな: ${stats.hiragana}
カタカナ: ${stats.katakana}
漢字: ${stats.kanji}
英字: ${stats.alphabets}
数字: ${stats.numbers}
記号: ${stats.symbols}
空白: ${stats.spaces}

バイト数
--------
UTF-8: ${stats.utf8Bytes} bytes
Shift_JIS (概算): ${stats.sjisBytes} bytes`

  return (
    <ToolLayout
      title="文字数計測ツール"
      description="文字数、行数、バイト数などを詳細に計測します"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">テキスト入力</label>
          <Textarea
            placeholder="計測したいテキストを入力してください..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{stats.characters.toLocaleString()}</p>
              <p className="text-sm text-blue-600">総文字数</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{stats.charactersNoSpaces.toLocaleString()}</p>
              <p className="text-sm text-green-600">文字数（空白除く）</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-700">{stats.lines.toLocaleString()}</p>
              <p className="text-sm text-purple-600">行数</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-700">{stats.words.toLocaleString()}</p>
              <p className="text-sm text-orange-600">単語数</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>基本統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>総文字数:</span>
                <span className="font-mono">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>文字数（空白除く）:</span>
                <span className="font-mono">{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>行数:</span>
                <span className="font-mono">{stats.lines.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>非空行数:</span>
                <span className="font-mono">{stats.nonEmptyLines.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>単語数:</span>
                <span className="font-mono">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>段落数:</span>
                <span className="font-mono">{stats.paragraphs.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>文字種別統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>ひらがな:</span>
                <span className="font-mono">{stats.hiragana.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>カタカナ:</span>
                <span className="font-mono">{stats.katakana.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>漢字:</span>
                <span className="font-mono">{stats.kanji.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>英字:</span>
                <span className="font-mono">{stats.alphabets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>数字:</span>
                <span className="font-mono">{stats.numbers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>記号:</span>
                <span className="font-mono">{stats.symbols.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>空白:</span>
                <span className="font-mono">{stats.spaces.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>バイト数</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>UTF-8:</span>
              <span className="font-mono">{stats.utf8Bytes.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span>Shift_JIS (概算):</span>
              <span className="font-mono">{stats.sjisBytes.toLocaleString()} bytes</span>
            </div>
          </CardContent>
        </Card>

        {text && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>統計結果</CardTitle>
                <CopyButton text={resultText} />
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {resultText}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>テキストエリアに文字を入力すると、リアルタイムで統計が更新されます</li>
              <li>文字種別（ひらがな、カタカナ、漢字等）の詳細な分析を行います</li>
              <li>UTF-8とShift_JISのバイト数を表示します</li>
              <li>統計結果をコピーボタンでクリップボードにコピーできます</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                このツールは<strong>numMoji</strong>や<strong>RAKKOTOOLS</strong>、<strong>字数カウンター</strong>の代替として使える高機能な文字数計測ツールです。
              </p>
              <div>
                <h4 className="font-semibold mb-2">主な特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>リアルタイム文字数カウント・計測</li>
                  <li>日本語文字種別（ひらがな・カタカナ・漢字）の詳細分析</li>
                  <li>UTF-8/Shift_JISバイト数表示</li>
                  <li>行数・段落数・単語数の統計</li>
                  <li>完全無料・登録不要・オフライン対応</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>原稿・レポート・論文の執筆時の文字数確認</li>
                  <li>Twitter・SNS投稿の文字数制限チェック</li>
                  <li>ブログ記事・SEOライティングの文字数管理</li>
                  <li>データベース・フォーム入力の文字数制限確認</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}