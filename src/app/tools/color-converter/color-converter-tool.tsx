'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
  cmyk: { c: number; m: number; y: number; k: number }
}

// HSL to RGB conversion
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360
  s = s / 100
  l = l / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  }
}

// RGB to HSL conversion
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

// RGB to HSV conversion
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const v = max
  const s = max === 0 ? 0 : (max - min) / max

  if (max === min) {
    h = 0
  } else {
    const d = max - min
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  }
}

// RGB to CMYK conversion
function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rPercent = r / 255
  const gPercent = g / 255
  const bPercent = b / 255

  const k = 1 - Math.max(rPercent, gPercent, bPercent)
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  const c = Math.round(((1 - rPercent - k) / (1 - k)) * 100)
  const m = Math.round(((1 - gPercent - k) / (1 - k)) * 100)
  const y = Math.round(((1 - bPercent - k) / (1 - k)) * 100)

  return { c, m, y, k: Math.round(k * 100) }
}

// HEX to RGB conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// RGB to HEX conversion
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export default function ColorConverterTool() {
  const [activeTab, setActiveTab] = useState('hex')
  const [hexInput, setHexInput] = useState('#3B82F6')
  const [rgbInput, setRgbInput] = useState({ r: 59, g: 130, b: 246 })
  const [hslInput, setHslInput] = useState({ h: 217, s: 91, l: 60 })

  const colorValues = useMemo((): ColorValues | null => {
    let rgb: { r: number; g: number; b: number }

    if (activeTab === 'hex') {
      const result = hexToRgb(hexInput)
      if (!result) return null
      rgb = result
    } else if (activeTab === 'rgb') {
      rgb = rgbInput
    } else if (activeTab === 'hsl') {
      rgb = hslToRgb(hslInput.h, hslInput.s, hslInput.l)
    } else {
      return null
    }

    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

    return { hex, rgb, hsl, hsv, cmyk }
  }, [activeTab, hexInput, rgbInput, hslInput])

  const presetColors = [
    { name: 'レッド', hex: '#EF4444' },
    { name: 'オレンジ', hex: '#F97316' },
    { name: 'イエロー', hex: '#EAB308' },
    { name: 'グリーン', hex: '#22C55E' },
    { name: 'ブルー', hex: '#3B82F6' },
    { name: 'インディゴ', hex: '#6366F1' },
    { name: 'パープル', hex: '#A855F7' },
    { name: 'ピンク', hex: '#EC4899' },
    { name: 'グレー', hex: '#6B7280' },
    { name: 'ブラック', hex: '#000000' },
    { name: 'ホワイト', hex: '#FFFFFF' },
    { name: 'スレート', hex: '#475569' }
  ]

  return (
    <ToolLayout
      title="カラーコード変換"
      description="HEX・RGB・HSL・HSV・CMYK形式の色変換ツール"
    >
      <div className="space-y-6">
        {/* カラー表示 */}
        {colorValues && (
          <Card>
            <CardHeader>
              <CardTitle>カラープレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-32 h-32 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: colorValues.hex }}
                />
                <div className="flex-1">
                  <div className="text-2xl font-bold" style={{ color: colorValues.hex }}>
                    カラーサンプル
                  </div>
                  <div className="text-lg text-gray-600 mt-1">
                    {colorValues.hex.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    RGB({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 入力タブ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hex">HEX入力</TabsTrigger>
            <TabsTrigger value="rgb">RGB入力</TabsTrigger>
            <TabsTrigger value="hsl">HSL入力</TabsTrigger>
          </TabsList>

          {/* HEX入力 */}
          <TabsContent value="hex" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HEXカラーコードを入力</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="#3B82F6"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    className="font-mono text-lg"
                  />
                  <input
                    type="color"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RGB入力 */}
          <TabsContent value="rgb" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RGB値を入力</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Red (0-255)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[rgbInput.r]}
                        onValueChange={(value) => setRgbInput(prev => ({ ...prev, r: value[0] }))}
                        max={255}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.r}
                        onChange={(e) => setRgbInput(prev => ({ ...prev, r: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Green (0-255)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[rgbInput.g]}
                        onValueChange={(value) => setRgbInput(prev => ({ ...prev, g: value[0] }))}
                        max={255}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.g}
                        onChange={(e) => setRgbInput(prev => ({ ...prev, g: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Blue (0-255)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[rgbInput.b]}
                        onValueChange={(value) => setRgbInput(prev => ({ ...prev, b: value[0] }))}
                        max={255}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={rgbInput.b}
                        onChange={(e) => setRgbInput(prev => ({ ...prev, b: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HSL入力 */}
          <TabsContent value="hsl" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HSL値を入力</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hue (0-360°)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[hslInput.h]}
                        onValueChange={(value) => setHslInput(prev => ({ ...prev, h: value[0] }))}
                        max={360}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="360"
                        value={hslInput.h}
                        onChange={(e) => setHslInput(prev => ({ ...prev, h: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Saturation (0-100%)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[hslInput.s]}
                        onValueChange={(value) => setHslInput(prev => ({ ...prev, s: value[0] }))}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hslInput.s}
                        onChange={(e) => setHslInput(prev => ({ ...prev, s: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Lightness (0-100%)</label>
                    <div className="flex space-x-4 items-center">
                      <Slider
                        value={[hslInput.l]}
                        onValueChange={(value) => setHslInput(prev => ({ ...prev, l: value[0] }))}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hslInput.l}
                        onChange={(e) => setHslInput(prev => ({ ...prev, l: parseInt(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 変換結果 */}
        {colorValues && (
          <Card>
            <CardHeader>
              <CardTitle>変換結果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">HEX</div>
                      <div className="font-mono text-lg font-bold">{colorValues.hex.toUpperCase()}</div>
                    </div>
                    <CopyButton text={colorValues.hex.toUpperCase()} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">RGB</div>
                      <div className="font-mono text-lg font-bold">
                        {colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b}
                      </div>
                    </div>
                    <CopyButton text={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">HSL</div>
                      <div className="font-mono text-lg font-bold">
                        {colorValues.hsl.h}°, {colorValues.hsl.s}%, {colorValues.hsl.l}%
                      </div>
                    </div>
                    <CopyButton text={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">HSV</div>
                      <div className="font-mono text-lg font-bold">
                        {colorValues.hsv.h}°, {colorValues.hsv.s}%, {colorValues.hsv.v}%
                      </div>
                    </div>
                    <CopyButton text={`hsv(${colorValues.hsv.h}, ${colorValues.hsv.s}%, ${colorValues.hsv.v}%)`} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">CMYK</div>
                      <div className="font-mono text-lg font-bold">
                        {colorValues.cmyk.c}%, {colorValues.cmyk.m}%, {colorValues.cmyk.y}%, {colorValues.cmyk.k}%
                      </div>
                    </div>
                    <CopyButton text={`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-600">CSS RGB</div>
                      <div className="font-mono text-sm font-bold">
                        rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
                      </div>
                    </div>
                    <CopyButton text={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* プリセットカラー */}
        <Card>
          <CardHeader>
            <CardTitle>プリセットカラー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {presetColors.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 rounded-lg border cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => {
                    setHexInput(color.hex)
                    setActiveTab('hex')
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg border mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-sm font-medium text-center">{color.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{color.hex}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 説明 */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">対応形式</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>HEX</strong> - #RRGGBB形式（Webでよく使用）</li>
                  <li><strong>RGB</strong> - Red, Green, Blue（0-255）</li>
                  <li><strong>HSL</strong> - Hue, Saturation, Lightness</li>
                  <li><strong>HSV</strong> - Hue, Saturation, Value</li>
                  <li><strong>CMYK</strong> - Cyan, Magenta, Yellow, Key（印刷用）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Web デザイン・開発</li>
                  <li>グラフィックデザイン</li>
                  <li>CSS・HTMLのカラー指定</li>
                  <li>印刷物のカラーマッチング</li>
                  <li>ブランドカラーの統一管理</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>各形式間の高精度変換</li>
                  <li>リアルタイムカラープレビュー</li>
                  <li>スライダーによる直感的操作</li>
                  <li>カラーピッカー対応</li>
                  <li>プリセットカラー集</li>
                  <li>変換結果のワンクリックコピー</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}