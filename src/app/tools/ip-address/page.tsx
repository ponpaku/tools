'use client'

import { useState, useEffect } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface IPInfo {
  ip: string
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  localTime: string
}

export default function IPAddressPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ページ読み込み時に基本情報を取得
    getBasicInfo()
  }, [])

  const getBasicInfo = () => {
    const info: IPInfo = {
      ip: 'N/A', // クライアントサイドでは取得不可
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}×${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      localTime: new Date().toLocaleString('ja-JP')
    }
    
    setIpInfo(info)
  }

  const getIPFromService = async () => {
    setLoading(true)
    try {
      // 複数のサービスを試行
      const services = [
        'https://api.ipify.org?format=json',
        'https://httpbin.org/ip',
        'https://jsonip.com'
      ]
      
      for (const service of services) {
        try {
          const response = await fetch(service)
          const data = await response.json()
          
          let ip = ''
          if (data.ip) {
            ip = data.ip
          } else if (data.origin) {
            ip = data.origin
          }
          
          if (ip) {
            setIpInfo(prev => prev ? { ...prev, ip } : null)
            break
          }
        } catch (error) {
          console.warn(`Service ${service} failed:`, error)
        }
      }
    } catch (error) {
      console.error('IP取得エラー:', error)
    }
    setLoading(false)
  }

  const infoText = ipInfo ? 
    `IPアドレス: ${ipInfo.ip}\n` +
    `ユーザーエージェント: ${ipInfo.userAgent}\n` +
    `言語: ${ipInfo.language}\n` +
    `プラットフォーム: ${ipInfo.platform}\n` +
    `画面解像度: ${ipInfo.screenResolution}\n` +
    `タイムゾーン: ${ipInfo.timezone}\n` +
    `ローカル時刻: ${ipInfo.localTime}`
    : ''

  return (
    <ToolLayout
      title="IPアドレス確認"
      description="アクセス元のIPアドレスとブラウザ情報を表示します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>アクセス情報</CardTitle>
              <div className="flex gap-2">
                <CopyButton text={infoText} />
                <Button 
                  onClick={getIPFromService} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                >
                  {loading ? '取得中...' : 'IP再取得'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ipInfo && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">IPアドレス</h3>
                    <p className="font-mono text-lg text-blue-700">
                      {ipInfo.ip === 'N/A' ? (
                        <span className="text-gray-500">
                          IPを取得するには「IP再取得」ボタンを押してください
                        </span>
                      ) : (
                        ipInfo.ip
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">ローカル時刻</h3>
                    <p className="text-lg text-green-700">{ipInfo.localTime}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium text-gray-700">言語:</span>
                    <span className="font-mono">{ipInfo.language}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium text-gray-700">プラットフォーム:</span>
                    <span className="font-mono">{ipInfo.platform}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium text-gray-700">画面解像度:</span>
                    <span className="font-mono">{ipInfo.screenResolution}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <span className="font-medium text-gray-700">タイムゾーン:</span>
                    <span className="font-mono">{ipInfo.timezone}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 mb-2">ユーザーエージェント:</span>
                    <span className="font-mono text-sm bg-gray-50 p-2 rounded break-all">
                      {ipInfo.userAgent}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>プライバシーについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">表示される情報</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>IPアドレス</strong>: インターネット上での識別番号</li>
                  <li><strong>ユーザーエージェント</strong>: ブラウザとOSの情報</li>
                  <li><strong>言語設定</strong>: ブラウザの優先言語</li>
                  <li><strong>画面解像度</strong>: モニターの解像度</li>
                  <li><strong>タイムゾーン</strong>: 地域の時間帯設定</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">IPアドレスでわかること</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>おおよその地理的位置（国、地域）</li>
                  <li>インターネットサービスプロバイダ（ISP）</li>
                  <li>接続タイプ（光回線、モバイル等）</li>
                  <li>組織や企業の情報（法人回線の場合）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">プライバシー保護</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>VPNサービスでIPアドレスを隠すことができます</li>
                  <li>Torブラウザで匿名性を高めることができます</li>
                  <li>プロキシサーバー経由でアクセスする方法もあります</li>
                  <li>このツールでは情報の保存や外部送信は行いません</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">重要な注意</h4>
                <p className="text-yellow-700">
                  このツールは教育・検証目的で作成されています。
                  取得した情報は適切に管理し、他人のプライバシーを侵害する用途には使用しないでください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>技術的な詳細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">IPアドレスの種類</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>IPv4</strong>: 192.168.1.1 のような形式（4つの数字）</li>
                  <li><strong>IPv6</strong>: 2001:db8::1 のような形式（16進数とコロン）</li>
                  <li><strong>プライベートIP</strong>: ローカルネットワーク内でのみ有効</li>
                  <li><strong>パブリックIP</strong>: インターネット上で一意の識別子</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">取得方法</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>外部APIサービス（ipify.org等）を使用</li>
                  <li>JavaScriptで利用可能なブラウザ情報を取得</li>
                  <li>セキュリティ上、一部情報は取得できません</li>
                  <li>正確なIP取得には外部サービスが必要</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}