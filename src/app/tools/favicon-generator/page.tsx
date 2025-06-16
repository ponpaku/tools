"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FaviconSize {
  size: number;
  name: string;
  description: string;
  format: 'png';
}

interface GeneratedFavicon {
  size: number;
  name: string;
  url: string;
  filename: string;
  format: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, name: 'favicon-16x16.png', description: 'ブラウザタブ用', format: 'png' },
  { size: 32, name: 'favicon-32x32.png', description: 'ブラウザタブ用（高解像度）', format: 'png' },
  { size: 48, name: 'favicon-48x48.png', description: 'Windowsタスクバー用', format: 'png' },
  { size: 64, name: 'favicon-64x64.png', description: 'Windowsショートカット用', format: 'png' },
  { size: 96, name: 'favicon-96x96.png', description: 'Androidホーム画面用', format: 'png' },
  { size: 128, name: 'favicon-128x128.png', description: 'Chrome Webストア用', format: 'png' },
  { size: 180, name: 'apple-touch-icon.png', description: 'iOS Safari用', format: 'png' },
  { size: 192, name: 'android-chrome-192x192.png', description: 'Android Chrome用', format: 'png' },
  { size: 256, name: 'favicon-256x256.png', description: '高解像度ディスプレイ用', format: 'png' },
  { size: 512, name: 'android-chrome-512x512.png', description: 'Android Chrome用（大）', format: 'png' }
];

export default function FaviconGeneratorPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 180, 192]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [useBackground, setUseBackground] = useState(false);
  const [cropMode, setCropMode] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFavicon = useCallback(async (
    imageFile: File,
    size: number,
    bgColor?: string,
    mode: 'contain' | 'cover' | 'fill' = 'contain'
  ): Promise<GeneratedFavicon> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error('Canvas が利用できません'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context を取得できませんでした'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        
        // 背景色を設定
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
        } else {
          ctx.clearRect(0, 0, size, size);
        }
        
        // 画像の描画計算
        let drawX = 0;
        let drawY = 0;
        let drawWidth = size;
        let drawHeight = size;
        
        const imgAspect = img.width / img.height;
        const canvasAspect = 1; // 正方形
        
        switch (mode) {
          case 'contain':
            // 画像全体が見える様にリサイズ
            if (imgAspect > canvasAspect) {
              drawHeight = size / imgAspect;
              drawY = (size - drawHeight) / 2;
            } else {
              drawWidth = size * imgAspect;
              drawX = (size - drawWidth) / 2;
            }
            break;
            
          case 'cover':
            // キャンバス全体を覆うようにリサイズ（一部切り取られる可能性）
            if (imgAspect > canvasAspect) {
              drawWidth = size;
              drawHeight = size / imgAspect;
              drawY = (size - drawHeight) / 2;
            } else {
              drawWidth = size * imgAspect;
              drawHeight = size;
              drawX = (size - drawWidth) / 2;
            }
            break;
            
          case 'fill':
            // キャンバス全体に引き伸ばし
            drawX = 0;
            drawY = 0;
            drawWidth = size;
            drawHeight = size;
            break;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        const dataUrl = canvas.toDataURL('image/png');
        const sizeInfo = FAVICON_SIZES.find(s => s.size === size) || 
                        { name: `favicon-${size}x${size}.png`, description: `${size}x${size}`, format: 'png' as const };
        
        resolve({
          size,
          name: sizeInfo.description,
          url: dataUrl,
          filename: sizeInfo.name,
          format: 'PNG'
        });
      };
      
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = URL.createObjectURL(imageFile);
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setGeneratedFavicons([]);
    setError("");
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setGeneratedFavicons([]);
    setError("");
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const generateAllFavicons = async () => {
    if (!imageFile) return;

    try {
      setLoading(true);
      setError("");
      setGeneratedFavicons([]);
      
      const results: GeneratedFavicon[] = [];
      const bgColor = useBackground ? backgroundColor : undefined;
      
      for (const size of selectedSizes) {
        const favicon = await generateFavicon(imageFile, size, bgColor, cropMode);
        results.push(favicon);
      }
      
      setGeneratedFavicons(results);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Favicon生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.href = favicon.url;
    link.download = favicon.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    generatedFavicons.forEach((favicon, index) => {
      setTimeout(() => downloadFavicon(favicon), index * 100);
    });
  };


  const generateHTMLCode = (): string => {
    if (generatedFavicons.length === 0) return '';
    
    let html = '<!-- Favicon links -->\n';
    
    generatedFavicons.forEach(favicon => {
      if (favicon.filename.includes('apple-touch-icon')) {
        html += `<link rel="apple-touch-icon" sizes="${favicon.size}x${favicon.size}" href="/${favicon.filename}">\n`;
      } else if (favicon.filename.includes('android-chrome')) {
        // manifest.json で使用されるため、HTMLには直接記載しない
      } else {
        html += `<link rel="icon" type="image/png" sizes="${favicon.size}x${favicon.size}" href="/${favicon.filename}">\n`;
      }
    });
    
    return html;
  };

  const generateManifestJSON = (): string => {
    const icons = generatedFavicons
      .filter(favicon => favicon.filename.includes('android-chrome'))
      .map(favicon => ({
        src: `/${favicon.filename}`,
        sizes: `${favicon.size}x${favicon.size}`,
        type: 'image/png'
      }));
    
    const manifest = {
      name: "Your App Name",
      short_name: "App",
      icons,
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };
    
    return JSON.stringify(manifest, null, 2);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const clearData = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    generatedFavicons.forEach(favicon => {
      URL.revokeObjectURL(favicon.url);
    });
    setImageFile(null);
    setImageUrl("");
    setGeneratedFavicons([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title="Favicon生成ツール"
      description="画像からWebサイト用のFaviconを複数サイズで生成"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>元画像選択</CardTitle>
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
                  <div className="text-4xl text-gray-400">🌐</div>
                  <p className="text-lg font-medium">画像をドラッグ&ドロップ</p>
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
                <p>推奨: 正方形の画像（256x256px以上）</p>
                <p>対応形式: JPEG, PNG, WebP, SVG など</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {imageUrl && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>元画像プレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <img
                    src={imageUrl}
                    alt="元画像"
                    className="max-w-48 max-h-48 mx-auto rounded-lg shadow-lg"
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>生成設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>サイズ調整モード</Label>
                    <Select value={cropMode} onValueChange={(value: any) => setCropMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contain">全体表示（余白あり）</SelectItem>
                        <SelectItem value="cover">画面いっぱい（一部切り取り）</SelectItem>
                        <SelectItem value="fill">引き伸ばし（変形あり）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useBackground"
                        checked={useBackground}
                        onCheckedChange={(checked) => setUseBackground(!!checked)}
                      />
                      <Label htmlFor="useBackground">背景色を設定</Label>
                    </div>
                    
                    {useBackground && (
                      <div>
                        <Label htmlFor="backgroundColor">背景色</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="backgroundColor"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-16 h-8 p-1"
                          />
                          <Input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>生成サイズ選択</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {FAVICON_SIZES.map(sizeInfo => (
                      <div key={sizeInfo.size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${sizeInfo.size}`}
                          checked={selectedSizes.includes(sizeInfo.size)}
                          onCheckedChange={() => toggleSize(sizeInfo.size)}
                        />
                        <Label 
                          htmlFor={`size-${sizeInfo.size}`}
                          className="flex-1 text-sm cursor-pointer"
                        >
                          <span className="font-mono">{sizeInfo.size}x{sizeInfo.size}</span>
                          <span className="text-gray-600 ml-2">{sizeInfo.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedSizes(FAVICON_SIZES.map(s => s.size))}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        全選択
                      </Button>
                      <Button 
                        onClick={() => setSelectedSizes([])}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        全解除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="text-center py-6">
                <Button 
                  onClick={generateAllFavicons} 
                  disabled={loading || selectedSizes.length === 0}
                  size="lg"
                >
                  {loading ? 'Favicon生成中...' : `${selectedSizes.length}種類のFaviconを生成`}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {loading && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Faviconを生成中...</p>
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

        {generatedFavicons.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>生成されたFavicon</CardTitle>
                  <Button onClick={downloadAll}>
                    全てダウンロード
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generatedFavicons.map((favicon, index) => (
                    <div key={index} className="border rounded-lg p-3 text-center space-y-2">
                      <img
                        src={favicon.url}
                        alt={`Favicon ${favicon.size}x${favicon.size}`}
                        className="w-16 h-16 mx-auto border rounded"
                        style={{ imageRendering: 'pixelated' }}
                      />
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold">{favicon.size}x{favicon.size}</p>
                        <p className="text-gray-600">{favicon.name}</p>
                      </div>
                      <Button
                        onClick={() => downloadFavicon(favicon)}
                        size="sm"
                        className="w-full"
                      >
                        ダウンロード
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>HTMLコード</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>HTMLの&lt;head&gt;タグ内に追加:</Label>
                    <div className="relative">
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        <code>{generateHTMLCode()}</code>
                      </pre>
                      <div className="absolute top-2 right-2">
                        <CopyButton text={generateHTMLCode()} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>manifest.json</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>PWA用のmanifest.json:</Label>
                    <div className="relative">
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-48">
                        <code>{generateManifestJSON()}</code>
                      </pre>
                      <div className="absolute top-2 right-2">
                        <CopyButton text={generateManifestJSON()} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

          </>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Card>
          <CardHeader>
            <CardTitle>Favicon生成について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">各サイズの用途</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>16x16, 32x32</strong>: ブラウザタブ、ブックマーク</li>
                  <li><strong>48x48</strong>: Windowsタスクバー、ショートカット</li>
                  <li><strong>96x96</strong>: Androidホーム画面</li>
                  <li><strong>180x180</strong>: iOS Safari（apple-touch-icon）</li>
                  <li><strong>192x192, 512x512</strong>: Android Chrome（PWA）</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">最適化のコツ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>正方形の画像を使用する</li>
                  <li>シンプルで認識しやすいデザインにする</li>
                  <li>小さいサイズでも視認できるよう太い線を使用</li>
                  <li>背景が透明な場合は適切な背景色を設定</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">設置方法</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>各Faviconファイルを個別にダウンロード</li>
                  <li>画像ファイルをWebサイトのルートディレクトリに配置</li>
                  <li>HTMLコードを&lt;head&gt;タグ内に追加</li>
                  <li>PWA対応の場合はmanifest.jsonも配置して参照を追加</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>すべての処理はブラウザ内で実行されます</li>
                  <li>画像はサーバーに送信されません</li>
                  <li>PNG形式での出力となります</li>
                  <li>ブラウザによってはキャッシュの影響で変更が反映されない場合があります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}