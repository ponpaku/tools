"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { ImageCropper } from "@/components/ui/image-cropper";

interface ImageInfo {
  file: File;
  width: number;
  height: number;
  url: string;
  originalSize: number;
  originalFormat: string;
  hasTransparency: boolean;
}

interface ConversionResult {
  url: string;
  size: number;
  format: string;
  quality: number;
  filename: string;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  enabled: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SUPPORTED_FORMATS = [
  { value: 'jpeg', label: 'JPEG', extension: 'jpg' },
  { value: 'png', label: 'PNG', extension: 'png' },
  { value: 'webp', label: 'WebP', extension: 'webp' }
] as const;

export default function ImageConvertPage() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [batchConvert, setBatchConvert] = useState(false);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    enabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkTransparency = useCallback((canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // アルファチャンネルをチェック
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true; // 透明度あり
      }
    }
    return false; // 透明度なし
  }, []);

  const loadImage = useCallback((file: File): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        // 透明度チェック用のcanvas作成
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) {
          URL.revokeObjectURL(url);
          reject(new Error('Canvas context を取得できませんでした'));
          return;
        }
        
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        tempCtx.drawImage(img, 0, 0);
        
        const hasTransparency = checkTransparency(tempCanvas);
        
        resolve({
          file,
          width: img.width,
          height: img.height,
          url,
          originalSize: file.size,
          originalFormat: file.type.split('/')[1] || 'unknown',
          hasTransparency
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('画像の読み込みに失敗しました'));
      };
      
      img.src = url;
    });
  }, [checkTransparency]);

  const convertImage = useCallback(async (
    imageInfo: ImageInfo, 
    format: string, 
    quality: number,
    bgColor?: string
  ): Promise<ConversionResult> => {
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
        canvas.width = imageInfo.width;
        canvas.height = imageInfo.height;
        
        // JPEGの場合は背景色を設定（透明度を除去）
        if (format === 'jpeg' && bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                        format === 'png' ? 'image/png' : 'image/webp';
        
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // データURLからファイルサイズを計算
        const base64 = dataUrl.split(',')[1];
        const size = Math.round(base64.length * 0.75);
        
        const originalName = imageInfo.file.name.replace(/\.[^/.]+$/, '');
        const extension = SUPPORTED_FORMATS.find(f => f.value === format)?.extension || format;
        const filename = `${originalName}.${extension}`;
        
        resolve({
          url: dataUrl,
          size,
          format: format.toUpperCase(),
          quality,
          filename
        });
      };
      
      img.onerror = () => reject(new Error('画像の変換に失敗しました'));
      img.src = imageInfo.url;
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      setConversionResults([]);
      
      const info = await loadImage(file);
      setImageInfo(info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      setConversionResults([]);
      
      const info = await loadImage(file);
      setImageInfo(info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const performSingleConversion = async () => {
    if (!imageInfo) return;

    try {
      setLoading(true);
      setError("");
      
      const bgColor = targetFormat === 'jpeg' && !preserveTransparency ? backgroundColor : undefined;
      const result = await convertImage(imageInfo, targetFormat, quality, bgColor);
      setConversionResults([result]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '変換処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const performBatchConversion = async () => {
    if (!imageInfo) return;

    try {
      setLoading(true);
      setError("");
      setConversionResults([]);
      
      const results: ConversionResult[] = [];
      
      for (const format of SUPPORTED_FORMATS) {
        const currentQuality = format.value === 'png' ? 1 : quality;
        const bgColor = format.value === 'jpeg' && !preserveTransparency ? backgroundColor : undefined;
        
        const result = await convertImage(imageInfo, format.value, currentQuality, bgColor);
        results.push(result);
      }
      
      setConversionResults(results);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '一括変換処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (result: ConversionResult) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    conversionResults.forEach(result => {
      setTimeout(() => downloadImage(result), 100);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearData = () => {
    if (imageInfo) {
      URL.revokeObjectURL(imageInfo.url);
    }
    conversionResults.forEach(result => {
      URL.revokeObjectURL(result.url);
    });
    setImageInfo(null);
    setConversionResults([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title="画像形式変換ツール"
      description="JPEG・PNG・WebP間の画像形式変換ツール"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>画像ファイル選択</CardTitle>
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
                  <div className="text-4xl text-gray-400">🔄</div>
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
              <p>画像を変換中...</p>
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

        {imageInfo && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>元画像情報</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <img
                      src={imageInfo.url}
                      alt="元画像"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>ファイル名:</strong> {imageInfo.file.name}</p>
                    <p><strong>現在の形式:</strong> {imageInfo.originalFormat.toUpperCase()}</p>
                    <p><strong>サイズ:</strong> {imageInfo.width} × {imageInfo.height} px</p>
                    <p><strong>ファイルサイズ:</strong> {formatFileSize(imageInfo.originalSize)}</p>
                    <p><strong>透明度:</strong> {imageInfo.hasTransparency ? 'あり' : 'なし'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>変換設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>変換先形式</Label>
                      <Select
                        value={targetFormat}
                        onValueChange={(value) => 
                          setTargetFormat(value as 'jpeg' | 'png' | 'webp')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_FORMATS.map(format => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {targetFormat !== 'png' && (
                      <div>
                        <Label>画質: {Math.round(quality * 100)}%</Label>
                        <Slider
                          value={[quality]}
                          onValueChange={([value]) => setQuality(value)}
                          min={0.1}
                          max={1}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {imageInfo.hasTransparency && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="preserveTransparency"
                            checked={preserveTransparency}
                            onCheckedChange={(checked) => 
                              setPreserveTransparency(!!checked)
                            }
                          />
                          <Label htmlFor="preserveTransparency">透明度を保持</Label>
                        </div>
                        
                        {!preserveTransparency && targetFormat === 'jpeg' && (
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
                    )}

                    {targetFormat === 'jpeg' && imageInfo.hasTransparency && preserveTransparency && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        ⚠️ JPEGは透明度をサポートしていません。透明部分は白色になります。
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={performSingleConversion} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? '変換中...' : `${targetFormat.toUpperCase()}に変換`}
                  </Button>
                  
                  <Button 
                    onClick={performBatchConversion} 
                    disabled={loading}
                    variant="outline"
                    className="flex-1"
                  >
                    {loading ? '一括変換中...' : '全形式に一括変換'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {conversionResults.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>変換結果</CardTitle>
                {conversionResults.length > 1 && (
                  <Button onClick={downloadAll} variant="outline" size="sm">
                    全てダウンロード
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conversionResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="text-center">
                      <img
                        src={result.url}
                        alt={`変換結果 ${result.format}`}
                        className="max-w-full max-h-32 mx-auto rounded border mb-2"
                      />
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{result.format}</p>
                        <p className="text-gray-600">
                          {formatFileSize(result.size)}
                        </p>
                        {result.format !== 'PNG' && (
                          <p className="text-gray-600">
                            品質: {Math.round(result.quality * 100)}%
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => downloadImage(result)}
                      className="w-full"
                      size="sm"
                    >
                      ダウンロード
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Card>
          <CardHeader>
            <CardTitle>画像形式変換について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">各形式の特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JPEG</strong>: 写真に最適。高い圧縮率だが透明度は非対応</li>
                  <li><strong>PNG</strong>: 透明度対応。鮮明なグラフィックに最適だがファイルサイズは大きめ</li>
                  <li><strong>WebP</strong>: 最新形式。高い圧縮率と透明度の両方をサポート</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">変換の用途</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JPEG → PNG</strong>: 透明度を追加したい場合</li>
                  <li><strong>PNG → JPEG</strong>: ファイルサイズを削減したい場合</li>
                  <li><strong>任意 → WebP</strong>: 最新の高効率圧縮を利用したい場合</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">透明度の処理</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>JPEGは透明度を保持できません（白色または指定背景色に変換）</li>
                  <li>PNGとWebPは透明度を完全に保持できます</li>
                  <li>透明度を除去したい場合は背景色を指定できます</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>すべての処理はブラウザ内で実行されます</li>
                  <li>画像はサーバーに送信されません</li>
                  <li>WebPは一部の古いブラウザで表示できない場合があります</li>
                  <li>変換により画質が劣化する場合があります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}