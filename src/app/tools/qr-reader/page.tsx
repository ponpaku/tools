"use client";

import { useState, useRef, useCallback } from "react";
import QrScanner from "qr-scanner";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Set up QR scanner worker
QrScanner.WORKER_PATH = "https://unpkg.com/qr-scanner/qr-scanner-worker.min.js";

interface QRResult {
  data: string;
  type: string;
  format: string;
}

interface AnalyzedContent {
  type: 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'geolocation' | 'text';
  title: string;
  data: any;
  rawData: string;
}

export default function QRReaderPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [qrText, setQrText] = useState<string>("");
  const [analyzedContent, setAnalyzedContent] = useState<AnalyzedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeQRContent = useCallback((data: string): AnalyzedContent => {
    // URL
    if (data.match(/^https?:\/\//i)) {
      return {
        type: 'url',
        title: 'Webサイト',
        data: { url: data },
        rawData: data
      };
    }

    // Email
    if (data.match(/^mailto:/i)) {
      const emailMatch = data.match(/^mailto:([^?]+)(?:\?(.+))?/i);
      if (emailMatch) {
        const email = emailMatch[1];
        const params = new URLSearchParams(emailMatch[2] || '');
        return {
          type: 'email',
          title: 'メール',
          data: {
            email,
            subject: params.get('subject') || '',
            body: params.get('body') || ''
          },
          rawData: data
        };
      }
    }

    // Phone
    if (data.match(/^tel:/i)) {
      const phoneMatch = data.match(/^tel:(.+)/i);
      return {
        type: 'phone',
        title: '電話番号',
        data: { phone: phoneMatch?.[1] || data },
        rawData: data
      };
    }

    // SMS
    if (data.match(/^sms:/i)) {
      const smsMatch = data.match(/^sms:([^?]+)(?:\?(.+))?/i);
      if (smsMatch) {
        const phone = smsMatch[1];
        const params = new URLSearchParams(smsMatch[2] || '');
        return {
          type: 'sms',
          title: 'SMS',
          data: {
            phone,
            body: params.get('body') || ''
          },
          rawData: data
        };
      }
    }

    // WiFi
    if (data.startsWith('WIFI:')) {
      const wifiMatch = data.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);/);
      if (wifiMatch) {
        return {
          type: 'wifi',
          title: 'WiFi設定',
          data: {
            type: wifiMatch[1],
            ssid: wifiMatch[2],
            password: wifiMatch[3],
            hidden: wifiMatch[4] === 'true'
          },
          rawData: data
        };
      }
    }

    // vCard
    if (data.startsWith('BEGIN:VCARD')) {
      const lines = data.split('\n');
      const vcard: any = {};
      lines.forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          switch (key) {
            case 'FN':
              vcard.name = value;
              break;
            case 'ORG':
              vcard.organization = value;
              break;
            case 'TEL':
              vcard.phone = value;
              break;
            case 'EMAIL':
              vcard.email = value;
              break;
            case 'URL':
              vcard.url = value;
              break;
          }
        }
      });
      return {
        type: 'vcard',
        title: '連絡先',
        data: vcard,
        rawData: data
      };
    }

    // Geolocation
    if (data.match(/^geo:/i)) {
      const geoMatch = data.match(/^geo:([^,]+),([^,]+)(?:,([^?]+))?(?:\?(.+))?/i);
      if (geoMatch) {
        return {
          type: 'geolocation',
          title: '位置情報',
          data: {
            latitude: parseFloat(geoMatch[1]),
            longitude: parseFloat(geoMatch[2]),
            altitude: geoMatch[3] ? parseFloat(geoMatch[3]) : null,
            query: geoMatch[4] || ''
          },
          rawData: data
        };
      }
    }

    // Plain text
    return {
      type: 'text',
      title: 'テキスト',
      data: { text: data },
      rawData: data
    };
  }, []);

  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      setError("");
      setQrText("");
      setAnalyzedContent(null);

      const { data } = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      setQrText(data);
      setAnalyzedContent(analyzeQRContent(data));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    await handleFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    await handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearData = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(null);
    setImageUrl("");
    setQrText("");
    setAnalyzedContent(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderAnalyzedContent = () => {
    if (!analyzedContent) return null;

    const { type, title, data } = analyzedContent;

    switch (type) {
      case 'url':
        return (
          <div className="space-y-2">
            <p><strong>URL:</strong> {data.url}</p>
            <Button onClick={() => openLink(data.url)} size="sm">
              リンクを開く
            </Button>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2">
            <p><strong>メールアドレス:</strong> {data.email}</p>
            {data.subject && <p><strong>件名:</strong> {data.subject}</p>}
            {data.body && <p><strong>本文:</strong> {data.body}</p>}
            <Button onClick={() => openLink(`mailto:${data.email}`)} size="sm">
              メールを作成
            </Button>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2">
            <p><strong>電話番号:</strong> {data.phone}</p>
            <Button onClick={() => openLink(`tel:${data.phone}`)} size="sm">
              電話をかける
            </Button>
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-2">
            <p><strong>ネットワーク名 (SSID):</strong> {data.ssid}</p>
            <p><strong>セキュリティ:</strong> {data.type}</p>
            <p><strong>パスワード:</strong> {data.password}</p>
            <p><strong>非表示ネットワーク:</strong> {data.hidden ? 'はい' : 'いいえ'}</p>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-2">
            {data.name && <p><strong>名前:</strong> {data.name}</p>}
            {data.organization && <p><strong>組織:</strong> {data.organization}</p>}
            {data.phone && <p><strong>電話:</strong> {data.phone}</p>}
            {data.email && <p><strong>メール:</strong> {data.email}</p>}
            {data.url && <p><strong>ウェブサイト:</strong> {data.url}</p>}
          </div>
        );

      case 'geolocation':
        return (
          <div className="space-y-2">
            <p><strong>緯度:</strong> {data.latitude}</p>
            <p><strong>経度:</strong> {data.longitude}</p>
            {data.altitude && <p><strong>高度:</strong> {data.altitude}m</p>}
            <Button 
              onClick={() => openLink(`https://www.google.com/maps?q=${data.latitude},${data.longitude}`)} 
              size="sm"
            >
              Google Mapsで開く
            </Button>
          </div>
        );

      default:
        return (
          <div>
            <p><strong>テキスト:</strong> {data.text}</p>
          </div>
        );
    }
  };

  return (
    <ToolLayout
      title="QRコード読み取り・解析ツール"
      description="画像からQRコードを読み取り、内容を解析・表示"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>QRコード画像選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2">
                  <div className="text-4xl text-gray-400">📱</div>
                  <p className="text-lg font-medium">QRコード画像をドラッグ&ドロップ</p>
                  <p className="text-sm text-gray-600">
                    またはクリックしてファイルを選択
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="flex-1"
                  style={{ display: "none" }}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  ファイルを選択
                </Button>
                <Button onClick={clearData} variant="outline">
                  クリア
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p>対応形式: JPEG, PNG, WebP, GIF など</p>
                <p>注意: このツールはブラウザ内で処理し、画像をサーバーに送信しません</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>QRコードを読み取り中...</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-red-700">
                <strong>エラー:</strong> {error}
              </p>
            </CardContent>
          </Card>
        )}

        {imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>読み取り対象画像</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt="QRコード画像"
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                />
                {imageFile && (
                  <p className="text-sm text-gray-600 mt-2">{imageFile.name}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {qrText && (
          <Card>
            <CardHeader>
              <CardTitle>読み取り結果</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="analyzed" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analyzed">解析結果</TabsTrigger>
                  <TabsTrigger value="raw">生データ</TabsTrigger>
                </TabsList>

                <TabsContent value="analyzed" className="mt-4">
                  {analyzedContent && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{analyzedContent.title}</Badge>
                        <Badge variant="outline">{analyzedContent.type}</Badge>
                      </div>
                      
                      <Card>
                        <CardContent className="pt-4">
                          {renderAnalyzedContent()}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="raw" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">データ:</span>
                          <CopyButton text={qrText} />
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm break-all">
                          {qrText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}


        <Card>
          <CardHeader>
            <CardTitle>QRコード読み取りについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">対応コンテンツ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>URL</strong>: ウェブサイトへのリンク</li>
                  <li><strong>メール</strong>: メールアドレスと件名・本文</li>
                  <li><strong>電話番号</strong>: 電話番号情報</li>
                  <li><strong>SMS</strong>: SMS送信先と本文</li>
                  <li><strong>WiFi</strong>: WiFi接続情報（SSID、パスワードなど）</li>
                  <li><strong>連絡先</strong>: vCard形式の名刺情報</li>
                  <li><strong>位置情報</strong>: 緯度・経度情報</li>
                  <li><strong>テキスト</strong>: その他のテキストデータ</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">読み取りのコツ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>QRコードが画像内で鮮明に写っていることを確認</li>
                  <li>コントラストが十分で、QRコードが判別しやすい画像を使用</li>
                  <li>QRコード周辺に十分な余白があることを確認</li>
                  <li>斜めになっていない、正面から撮影された画像が最適</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>自動的なコンテンツタイプ識別</li>
                  <li>構造化されたデータ表示</li>
                  <li>直接アクション（リンクを開く、メール作成など）</li>
                  <li>生データの表示とコピー機能</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>すべての処理はブラウザ内で実行されます</li>
                  <li>画像やデータはサーバーに送信されません</li>
                  <li>このツールは基本的なQRコード検出・分析機能を提供します</li>
                  <li>複雑なQRコードや損傷した画像では読み取りに失敗する場合があります</li>
                  <li>最も正確な結果を得るには、鮮明で正面から撮影された画像を使用してください</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}