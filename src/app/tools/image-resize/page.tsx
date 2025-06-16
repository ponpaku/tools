"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ImageInfo {
  file: File;
  width: number;
  height: number;
  url: string;
}

interface ResizeSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

export default function ImageResizePage() {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 0.9,
    format: 'jpeg'
  });
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("");
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
          url
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('画像の読み込みに失敗しました'));
      };
      
      img.src = url;
    });
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      
      const info = await loadImage(file);
      setImageInfo(info);
      
      // 初期リサイズ設定を画像サイズに合わせる
      setResizeSettings(prev => ({
        ...prev,
        width: info.width,
        height: info.height
      }));
      
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
      
      const info = await loadImage(file);
      setImageInfo(info);
      
      setResizeSettings(prev => ({
        ...prev,
        width: info.width,
        height: info.height
      }));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };


  const updateAspectRatio = (newWidth: number, newHeight: number, changedDimension: 'width' | 'height') => {
    if (!imageInfo || !resizeSettings.maintainAspectRatio) return { width: newWidth, height: newHeight };
    
    const aspectRatio = imageInfo.width / imageInfo.height;
    
    if (changedDimension === 'width') {
      return { width: newWidth, height: Math.round(newWidth / aspectRatio) };
    } else {
      return { width: Math.round(newHeight * aspectRatio), height: newHeight };
    }
  };

  const processImage = useCallback(async () => {
    if (!imageInfo || !canvasRef.current) return;

    try {
      setLoading(true);
      setError("");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context を取得できませんでした');

      const img = new Image();
      img.src = imageInfo.url;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // キャンバスサイズを設定
      canvas.width = resizeSettings.width;
      canvas.height = resizeSettings.height;

      // 画像を描画
      ctx.drawImage(
        img,
        0, 0, imageInfo.width, imageInfo.height,
        0, 0, resizeSettings.width, resizeSettings.height
      );

      // 画像をエクスポート
      const mimeType = resizeSettings.format === 'jpeg' ? 'image/jpeg' : 
                      resizeSettings.format === 'png' ? 'image/png' : 'image/webp';
      
      const dataUrl = canvas.toDataURL(mimeType, resizeSettings.quality);
      setProcessedImageUrl(dataUrl);

    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の処理に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [imageInfo, resizeSettings]);

  const downloadImage = () => {
    if (!processedImageUrl || !imageInfo) return;

    const link = document.createElement('a');
    link.href = processedImageUrl;
    const fileName = imageInfo.file.name.replace(/\.[^/.]+$/, '');
    link.download = `${fileName}_processed.${resizeSettings.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearData = () => {
    if (imageInfo) {
      URL.revokeObjectURL(imageInfo.url);
    }
    if (processedImageUrl) {
      URL.revokeObjectURL(processedImageUrl);
    }
    setImageInfo(null);
    setProcessedImageUrl("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter (Cmd+Enter) で画像処理実行
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && imageInfo && !loading) {
        processImage();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageInfo, loading, processImage]);

  return (
    <ToolLayout
      title="画像リサイズツール"
      description="画像のサイズ変更を簡単に行えるツール"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>画像ファイル選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-3">
                  <div className="text-5xl group-hover:scale-110 transition-transform">🖼️</div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-700 group-hover:text-blue-600">
                      画像をドラッグ&ドロップ
                    </p>
                    <p className="text-sm text-gray-500">
                      またはクリックしてファイルを選択
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full inline-block">
                    JPEG, PNG, WebP, GIF 対応
                  </div>
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
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="text-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <div className="absolute inset-0 w-10 h-10 border-4 border-blue-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-blue-700">画像を処理中...</p>
                  <p className="text-sm text-blue-600">
                    {imageInfo ? '画像の処理とリサイズを実行しています' : '画像を読み込んでいます'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-4">
              <div className="flex items-start space-x-3">
                <div className="text-red-500 text-xl">⚠️</div>
                <div className="flex-1">
                  <p className="text-red-700 font-medium mb-2">
                    エラーが発生しました
                  </p>
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                  <div className="text-xs text-red-500 space-y-1">
                    <p>・ ファイルが破損している可能性があります</p>
                    <p>・ サポートされていないファイル形式かもしれません</p>
                    <p>・ ファイルサイズが大きすぎる可能性があります</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-red-600 border-red-300 hover:bg-red-100"
                    onClick={() => setError("")}
                  >
                    エラーを閉じる
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {imageInfo && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>元画像プレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <img
                      src={imageInfo.url}
                      alt="元画像"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    <p>{imageInfo.file.name}</p>
                    <p>サイズ: {imageInfo.width} × {imageInfo.height} px</p>
                    <p>ファイルサイズ: {(imageInfo.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader>
                <CardTitle>リサイズ設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">出力サイズ</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">幅 (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={resizeSettings.width}
                          onChange={(e) => {
                            const newWidth = parseInt(e.target.value) || 0;
                            const dimensions = updateAspectRatio(newWidth, resizeSettings.height, 'width');
                            setResizeSettings(prev => ({ ...prev, ...dimensions }));
                          }}
                          min="1"
                          max="10000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">高さ (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={resizeSettings.height}
                          onChange={(e) => {
                            const newHeight = parseInt(e.target.value) || 0;
                            const dimensions = updateAspectRatio(resizeSettings.width, newHeight, 'height');
                            setResizeSettings(prev => ({ ...prev, ...dimensions }));
                          }}
                          min="1"
                          max="10000"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aspectRatio"
                        checked={resizeSettings.maintainAspectRatio}
                        onCheckedChange={(checked) => 
                          setResizeSettings(prev => ({ ...prev, maintainAspectRatio: !!checked }))
                        }
                      />
                      <Label htmlFor="aspectRatio">縦横比を維持</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setResizeSettings(prev => ({ ...prev, width: imageInfo.width, height: imageInfo.height }));
                        }}
                      >
                        元サイズ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const scale = 0.5;
                          setResizeSettings(prev => ({ 
                            ...prev, 
                            width: Math.round(imageInfo.width * scale), 
                            height: Math.round(imageInfo.height * scale) 
                          }));
                        }}
                      >
                        50%縮小
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">出力形式・画質</h4>
                    <div>
                      <Label>出力形式</Label>
                      <Select
                        value={resizeSettings.format}
                        onValueChange={(value) => 
                          setResizeSettings(prev => ({ ...prev, format: value as 'jpeg' | 'png' | 'webp' }))
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

                    {resizeSettings.format !== 'png' && (
                      <div>
                        <Label>画質: {Math.round(resizeSettings.quality * 100)}%</Label>
                        <Slider
                          value={[resizeSettings.quality]}
                          onValueChange={([value]) => 
                            setResizeSettings(prev => ({ ...prev, quality: value }))
                          }
                          min={0.1}
                          max={1}
                          step={0.1}
                          className="mt-2"
                        />
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      元画像: {imageInfo.width} × {imageInfo.height} px
                      <br />
                      出力予定: {resizeSettings.width} × {resizeSettings.height} px
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center py-6">
                <Button onClick={processImage} disabled={loading} size="lg">
                  {loading ? '処理中...' : '画像を処理'}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {processedImageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>処理済み画像</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={processedImageUrl}
                    alt="処理済み画像"
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    サイズ: {resizeSettings.width} × {resizeSettings.height} px
                  </p>
                  <Button onClick={downloadImage}>
                    画像をダウンロード
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">基本的な使い方</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>画像ファイルを選択またはドラッグ&ドロップ</li>
                  <li>リサイズ設定で希望のサイズを入力</li>
                  <li>縦横比維持のチェックボックスで比率を制御</li>
                  <li>出力形式と画質を選択</li>
                  <li>「画像を処理」ボタンをクリック（Ctrl+Enter）</li>
                  <li>処理済み画像をダウンロード</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>リサイズ</strong>: 画像のサイズを任意の寸法に変更</li>
                  <li><strong>縦横比維持</strong>: 元画像の比率を保ったままリサイズ</li>
                  <li><strong>形式変換</strong>: JPEG、PNG、WebP形式で出力</li>
                  <li><strong>画質調整</strong>: JPEG/WebPの圧縮率を調整</li>
                  <li><strong>クイックサイズ</strong>: 元サイズや50%縮小のワンクリック設定</li>
                  <li><strong>リアルタイムプレビュー</strong>: 設定変更を即座に反映</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">キーボードショートカット</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Ctrl+Enter (Cmd+Enter)</strong>: 画像処理を実行</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">注意事項</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>すべての処理はブラウザ内で実行されます</li>
                  <li>画像はサーバーに送信されません</li>
                  <li>大きなサイズの画像では処理に時間がかかる場合があります</li>
                  <li>ブラウザのメモリ制限により、非常に大きな画像は処理できない場合があります</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}