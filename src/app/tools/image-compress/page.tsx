"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
// import { ImageCropper } from "@/components/ui/image-cropper";

interface ImageInfo {
  file: File;
  width: number;
  height: number;
  url: string;
  originalSize: number;
}

interface CompressionResult {
  url: string;
  size: number;
  compressionRatio: number;
  quality: number;
  format: string;
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

export default function ImageCompressPage() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [compressionResults, setCompressionResults] = useState<CompressionResult[]>([]);
  const [selectedQuality, setSelectedQuality] = useState(0.8);
  const [selectedFormat, setSelectedFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
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

  const loadImage = useCallback((file: File): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        resolve({
          file,
          width: img.width,
          height: img.height,
          url,
          originalSize: file.size
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('画像の読み込みに失敗しました'));
      };
      
      img.src = url;
    });
  }, []);

  const compressImage = useCallback(async (imageInfo: ImageInfo, quality: number, format: string, cropSettings?: CropSettings): Promise<CompressionResult> => {
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
        // トリミングが有効な場合の処理
        if (cropSettings?.enabled && cropSettings.width > 0 && cropSettings.height > 0) {
          canvas.width = cropSettings.width;
          canvas.height = cropSettings.height;
          
          // 切り抜き領域から描画
          ctx.drawImage(
            img,
            cropSettings.x,
            cropSettings.y,
            cropSettings.width,
            cropSettings.height,
            0,
            0,
            cropSettings.width,
            cropSettings.height
          );
        } else {
          // 通常の圧縮処理
          canvas.width = imageInfo.width;
          canvas.height = imageInfo.height;
          
          ctx.drawImage(img, 0, 0);
        }
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : 
                        format === 'png' ? 'image/png' : 'image/webp';
        
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // データURLからファイルサイズを計算
        const base64 = dataUrl.split(',')[1];
        const size = Math.round(base64.length * 0.75);
        const compressionRatio = (1 - (size / imageInfo.originalSize)) * 100;
        
        resolve({
          url: dataUrl,
          size,
          compressionRatio,
          quality,
          format
        });
      };
      
      img.onerror = () => reject(new Error('画像の処理に失敗しました'));
      img.src = imageInfo.url;
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      setCompressionResults([]);
      
      const info = await loadImage(file);
      setImageInfo(info);
      
      // 初期切り抜き設定
      setCropSettings({
        x: 0,
        y: 0,
        width: info.width,
        height: info.height,
        enabled: false
      });
      
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
      setCompressionResults([]);
      
      const info = await loadImage(file);
      setImageInfo(info);
      
      // 初期切り抜き設定
      setCropSettings({
        x: 0,
        y: 0,
        width: info.width,
        height: info.height,
        enabled: false
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleCropChange = useCallback((cropArea: CropArea) => {
    setCropSettings(prev => ({
      ...prev,
      x: cropArea.x,
      y: cropArea.y,
      width: cropArea.width,
      height: cropArea.height
    }));
  }, []);

  const performSingleCompression = async () => {
    if (!imageInfo) return;

    try {
      setLoading(true);
      setError("");
      
      const result = await compressImage(imageInfo, selectedQuality, selectedFormat, cropSettings);
      setCompressionResults([result]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '圧縮処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const performBatchCompression = async () => {
    if (!imageInfo) return;

    try {
      setLoading(true);
      setError("");
      setCompressionResults([]);
      
      const qualityLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2];
      const formats = ['jpeg', 'webp', 'png'];
      const results: CompressionResult[] = [];
      
      for (const format of formats) {
        if (format === 'png') {
          // PNGは品質設定がないので1つだけ
          const result = await compressImage(imageInfo, 1, format, cropSettings);
          results.push(result);
        } else {
          // JPEG, WebPは複数の品質レベルでテスト
          for (const quality of qualityLevels) {
            const result = await compressImage(imageInfo, quality, format, cropSettings);
            results.push(result);
          }
        }
      }
      
      // 圧縮率でソート
      results.sort((a, b) => b.compressionRatio - a.compressionRatio);
      setCompressionResults(results);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '一括圧縮処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (result: CompressionResult) => {
    if (!imageInfo) return;

    const link = document.createElement('a');
    link.href = result.url;
    const fileName = imageInfo.file.name.replace(/\.[^/.]+$/, '');
    const quality = result.format === 'png' ? '' : `_q${Math.round(result.quality * 100)}`;
    link.download = `${fileName}_compressed${quality}.${result.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    compressionResults.forEach(result => {
      URL.revokeObjectURL(result.url);
    });
    setImageInfo(null);
    setCompressionResults([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <ToolLayout
      title="画像圧縮ツール"
      description="JPEG・PNG・WebP画像のファイルサイズを効率的に圧縮"
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
                  <div className="text-4xl text-gray-400">📦</div>
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
              <p>画像を圧縮中...</p>
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
                    <p><strong>サイズ:</strong> {imageInfo.width} × {imageInfo.height} px</p>
                    <p><strong>ファイルサイズ:</strong> {formatFileSize(imageInfo.originalSize)}</p>
                    <p><strong>形式:</strong> {imageInfo.file.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>トリミング設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableCrop"
                    checked={cropSettings.enabled}
                    onCheckedChange={(checked) => 
                      setCropSettings(prev => ({ ...prev, enabled: !!checked }))
                    }
                  />
                  <Label htmlFor="enableCrop">トリミングを有効にする</Label>
                </div>

                {cropSettings.enabled && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      画像上でドラッグして切り抜き範囲を選択してください
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {/* <ImageCropper
                        imageUrl={imageInfo.url}
                        onCropChange={handleCropChange}
                        className="max-w-full"
                      /> */}
                      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500">画像クロップ機能は準備中です</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label>X座標</Label>
                        <div className="font-mono">{cropSettings.x}px</div>
                      </div>
                      <div>
                        <Label>Y座標</Label>
                        <div className="font-mono">{cropSettings.y}px</div>
                      </div>
                      <div>
                        <Label>幅</Label>
                        <div className="font-mono">{cropSettings.width}px</div>
                      </div>
                      <div>
                        <Label>高さ</Label>
                        <div className="font-mono">{cropSettings.height}px</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>個別圧縮設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>出力形式</Label>
                    <Select
                      value={selectedFormat}
                      onValueChange={(value) => 
                        setSelectedFormat(value as 'jpeg' | 'png' | 'webp')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFormat !== 'png' && (
                    <div>
                      <Label>画質: {Math.round(selectedQuality * 100)}%</Label>
                      <Slider
                        value={[selectedQuality]}
                        onValueChange={([value]) => setSelectedQuality(value)}
                        min={0.1}
                        max={1}
                        step={0.1}
                        className="mt-2"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={performSingleCompression} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? '圧縮中...' : '圧縮実行'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>一括圧縮比較</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    複数の形式・品質レベルで一括圧縮し、
                    最適な設定を比較できます。
                  </p>
                  
                  <Button 
                    onClick={performBatchCompression} 
                    disabled={loading}
                    className="w-full"
                    variant="outline"
                  >
                    {loading ? '一括圧縮中...' : '一括圧縮実行'}
                  </Button>
                  
                  <div className="text-xs text-gray-500">
                    ※ JPEG, WebP各8段階 + PNG で計17種類の圧縮を実行
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {compressionResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>圧縮結果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compressionResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">
                            {result.format.toUpperCase()}
                          </span>
                          {result.format !== 'png' && (
                            <span className="text-sm text-gray-600">
                              品質: {Math.round(result.quality * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>ファイルサイズ: {formatFileSize(result.size)}</p>
                          <p>圧縮率: {result.compressionRatio.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => downloadImage(result)}
                        size="sm"
                      >
                        ダウンロード
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>圧縮効果</span>
                        <span>{result.compressionRatio.toFixed(1)}%</span>
                      </div>
                      <Progress value={result.compressionRatio} className="h-2" />
                    </div>
                    
                    <div className="flex justify-center">
                      <img
                        src={result.url}
                        alt={`圧縮結果 ${result.format}`}
                        className="max-w-full max-h-32 rounded border"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Card>
          <CardHeader>
            <CardTitle>画像圧縮について</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">形式別の特徴</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JPEG</strong>: 写真に最適。高い圧縮率を実現できるが、透明度は非対応</li>
                  <li><strong>PNG</strong>: 透明度や鮮明なグラフィックに最適。可逆圧縮のためファイルサイズは大きめ</li>
                  <li><strong>WebP</strong>: 最新形式。JPEGとPNGの長所を併せ持つ。最も効率的な圧縮が可能</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">圧縮のコツ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>写真: JPEG または WebP を品質80-90%で使用</li>
                  <li>透明度が必要: PNG または WebP を使用</li>
                  <li>アイコンやシンプルな画像: PNG を使用</li>
                  <li>最高効率: WebP を使用（ブラウザ対応を確認）</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">使用シーン</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>ウェブサイト用の画像最適化</li>
                  <li>メール添付ファイルのサイズ削減</li>
                  <li>ストレージ容量の節約</li>
                  <li>SNSアップロード用の画像調整</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>すべての処理はブラウザ内で実行されます</li>
                  <li>画像はサーバーに送信されません</li>
                  <li>品質を下げすぎると画像が劣化します</li>
                  <li>元画像より大きくなる場合もあります（特に小さなPNG）</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}