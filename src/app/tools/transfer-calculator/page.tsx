'use client'

import { useState } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CalculationResult {
  fileSize: number
  fileSizeUnit: string
  speed: number
  speedUnit: string
  results: {
    efficiency: number
    time: string
    actualSpeed: number
  }[]
}

export default function TransferCalculatorPage() {
  const [fileSize, setFileSize] = useState('')
  const [fileSizeUnit, setFileSizeUnit] = useState('MB')
  const [speed, setSpeed] = useState('')
  const [speedUnit, setSpeedUnit] = useState('Mbps')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const fileSizeUnits = [
    { value: 'KB', multiplier: 1024 },
    { value: 'MB', multiplier: 1024 * 1024 },
    { value: 'GB', multiplier: 1024 * 1024 * 1024 },
    { value: 'TB', multiplier: 1024 * 1024 * 1024 * 1024 }
  ]

  const speedUnits = [
    { value: 'bps', multiplier: 1 },
    { value: 'Kbps', multiplier: 1000 },
    { value: 'Mbps', multiplier: 1000 * 1000 },
    { value: 'Gbps', multiplier: 1000 * 1000 * 1000 }
  ]

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}秒`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}分${remainingSeconds}秒`
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}時間${minutes}分`
    } else {
      const days = Math.floor(seconds / 86400)
      const hours = Math.floor((seconds % 86400) / 3600)
      return `${days}日${hours}時間`
    }
  }

  const formatSpeed = (bps: number): string => {
    if (bps < 1000) {
      return `${bps.toFixed(1)} bps`
    } else if (bps < 1000000) {
      return `${(bps / 1000).toFixed(1)} Kbps`
    } else if (bps < 1000000000) {
      return `${(bps / 1000000).toFixed(1)} Mbps`
    } else {
      return `${(bps / 1000000000).toFixed(1)} Gbps`
    }
  }

  const calculate = () => {
    const fileSizeNum = parseFloat(fileSize)
    const speedNum = parseFloat(speed)

    if (isNaN(fileSizeNum) || isNaN(speedNum) || fileSizeNum <= 0 || speedNum <= 0) {
      alert('有効な数値を入力してください')
      return
    }

    // ファイルサイズをバイトに変換
    const selectedFileSizeUnit = fileSizeUnits.find(unit => unit.value === fileSizeUnit)
    const fileSizeBytes = fileSizeNum * (selectedFileSizeUnit?.multiplier || 1)

    // 転送速度をbpsに変換
    const selectedSpeedUnit = speedUnits.find(unit => unit.value === speedUnit)
    const speedBps = speedNum * (selectedSpeedUnit?.multiplier || 1)

    // 転送効率を10%から100%まで10%刻みで計算
    const efficiencyLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const results = efficiencyLevels.map(efficiency => {
      const actualSpeedBps = speedBps * (efficiency / 100)
      const timeSeconds = (fileSizeBytes * 8) / actualSpeedBps // 8倍してビットに変換
      
      return {
        efficiency,
        time: formatTime(timeSeconds),
        actualSpeed: actualSpeedBps
      }
    })

    setResult({
      fileSize: fileSizeNum,
      fileSizeUnit,
      speed: speedNum,
      speedUnit,
      results
    })
  }

  const formatResultText = () => {
    if (!result) return ''
    
    let text = `転送速度計算結果\n`
    text += `==================\n`
    text += `ファイルサイズ: ${result.fileSize} ${result.fileSizeUnit}\n`
    text += `理論転送速度: ${result.speed} ${result.speedUnit}\n\n`
    text += `転送効率別の所要時間:\n`
    
    result.results.forEach(r => {
      text += `${r.efficiency}%効率: ${r.time} (実効速度: ${formatSpeed(r.actualSpeed)})\n`
    })
    
    return text
  }

  const presets = [
    { name: '動画ファイル (1GB)', size: '1', unit: 'GB' },
    { name: 'OS イメージ (4GB)', size: '4', unit: 'GB' },
    { name: '写真アルバム (500MB)', size: '500', unit: 'MB' },
    { name: 'ドキュメント (10MB)', size: '10', unit: 'MB' },
    { name: 'バックアップ (100GB)', size: '100', unit: 'GB' }
  ]

  const speedPresets = [
    { name: '光回線 (1Gbps)', speed: '1', unit: 'Gbps' },
    { name: 'WiFi 6 (100Mbps)', speed: '100', unit: 'Mbps' },
    { name: 'LTE (50Mbps)', speed: '50', unit: 'Mbps' },
    { name: 'ADSL (10Mbps)', speed: '10', unit: 'Mbps' },
    { name: 'USB 3.0 (5Gbps)', speed: '5', unit: 'Gbps' }
  ]

  return (
    <ToolLayout
      title="転送速度計算器"
      description="ファイル転送にかかる時間を効率別に計算します"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ファイルサイズ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="1"
                  min="0"
                  step="0.1"
                />
                <Select value={fileSizeUnit} onValueChange={setFileSizeUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fileSizeUnits.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">プリセット:</p>
                <div className="flex flex-wrap gap-1">
                  {presets.map((preset, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFileSize(preset.size)
                        setFileSizeUnit(preset.unit)
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>転送速度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.1"
                />
                <Select value={speedUnit} onValueChange={setSpeedUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {speedUnits.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">プリセット:</p>
                <div className="flex flex-wrap gap-1">
                  {speedPresets.map((preset, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSpeed(preset.speed)
                        setSpeedUnit(preset.unit)
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={calculate} className="w-full" disabled={!fileSize || !speed}>
          転送時間を計算
        </Button>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>計算結果</CardTitle>
                <CopyButton text={formatResultText()} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center bg-blue-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-blue-800">
                  {result.fileSize} {result.fileSizeUnit} を {result.speed} {result.speedUnit} で転送
                </p>
              </div>
              
              <div className="space-y-3">
                {result.results.map((r, index) => {
                  const getColor = (efficiency: number) => {
                    if (efficiency >= 80) return 'bg-green-50 border-green-200'
                    if (efficiency >= 50) return 'bg-yellow-50 border-yellow-200'
                    return 'bg-red-50 border-red-200'
                  }
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${getColor(r.efficiency)}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">転送効率 {r.efficiency}%</p>
                          <p className="text-sm text-gray-600">
                            実効速度: {formatSpeed(r.actualSpeed)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{r.time}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>転送効率について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">転送効率とは</h4>
                <p>
                  理論上の最大転送速度に対する実際の転送速度の割合です。
                  ネットワークの混雑、プロトコルのオーバーヘッド、機器の性能などにより、
                  実際の転送速度は理論値を下回ります。
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">効率レベルの目安</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span><strong>10-30%</strong>: 混雑した無線環境、古い機器</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span><strong>40-70%</strong>: 一般的な家庭用ネットワーク</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span><strong>80-100%</strong>: 最適化された高性能環境</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">影響要因</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>ネットワーク混雑</strong>: 同時接続数、時間帯</li>
                  <li><strong>プロトコル</strong>: TCP/UDP、HTTP/FTP等のオーバーヘッド</li>
                  <li><strong>距離・経路</strong>: サーバーまでの物理的距離、中継点</li>
                  <li><strong>機器性能</strong>: ルーター、NIC、ストレージの処理能力</li>
                  <li><strong>ファイル特性</strong>: 小さなファイルの大量転送は効率が下がる</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">実用的な活用例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>クラウドバックアップの時間見積もり</li>
                  <li>動画配信サービスの帯域幅計画</li>
                  <li>システム移行の所要時間算出</li>
                  <li>リモートワーク環境の評価</li>
                  <li>データセンター間レプリケーション計画</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">計算式</h4>
                <p className="text-blue-700 font-mono text-xs">
                  転送時間 = (ファイルサイズ × 8) ÷ (転送速度 × 効率)
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  ※ ファイルサイズを8倍してビット単位に変換
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}