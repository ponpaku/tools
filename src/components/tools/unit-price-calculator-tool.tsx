'use client'

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ToolLayout } from '@/components/layout/tool-layout'
import { ShoppingCart, Plus, Trash2, Crown, TrendingDown, TrendingUp } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  amount: number
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs'
}

interface CalculatedProduct extends Product {
  unitPrice: number
  isLowestPrice: boolean
}

const unitLabels = {
  'g': 'グラム',
  'kg': 'キログラム', 
  'ml': 'ミリリットル',
  'l': 'リットル',
  'pcs': '個'
}

const unitPriceLabels = {
  'g': '1gあたり',
  'kg': '1kgあたり',
  'ml': '1mlあたり',
  'l': '1lあたり',
  'pcs': '1個あたり'
}

export default function UnitPriceCalculatorTool() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: '', price: 0, amount: 0, unit: 'g' }
  ])

  const calculatedProducts = useMemo(() => {
    const calculated: CalculatedProduct[] = products
      .filter(product => product.price > 0 && product.amount > 0)
      .map(product => {
        // 単位を統一して計算（gまたはmlベース）
        let normalizedAmount = product.amount
        if (product.unit === 'kg') normalizedAmount *= 1000
        if (product.unit === 'l') normalizedAmount *= 1000
        
        const unitPrice = product.price / normalizedAmount
        
        return {
          ...product,
          unitPrice,
          isLowestPrice: false
        }
      })

    // 最安値を特定
    if (calculated.length > 0) {
      const lowestPrice = Math.min(...calculated.map(p => p.unitPrice))
      calculated.forEach(product => {
        product.isLowestPrice = Math.abs(product.unitPrice - lowestPrice) < 0.0001
      })
    }

    return calculated.sort((a, b) => a.unitPrice - b.unitPrice)
  }, [products])

  const addProduct = useCallback(() => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      amount: 0,
      unit: 'g'
    }
    setProducts(prev => [...prev, newProduct])
  }, [])

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }, [])

  const updateProduct = useCallback((id: string, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, [field]: value }
        : product
    ))
  }, [])

  const clearAll = useCallback(() => {
    setProducts([{ id: '1', name: '', price: 0, amount: 0, unit: 'g' }])
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price)
  }

  const formatUnitPrice = (price: number, unit: 'g' | 'kg' | 'ml' | 'l' | 'pcs') => {
    const displayUnit = unit === 'kg' ? 'g' : unit === 'l' ? 'ml' : unit
    return `${formatPrice(price)} / ${displayUnit}`
  }

  return (
    <ToolLayout
      title="単価比較電卓"
      description="複数商品の単価を計算・比較して、最もお得な商品を見つけます。"
    >
      <div className="grid gap-6">
        {/* 商品入力 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              商品情報入力
            </CardTitle>
            <CardDescription>
              比較したい商品の価格と容量・重量を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">商品名</label>
                  <Input
                    placeholder={`商品${index + 1}`}
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">価格（円）</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={product.price || ''}
                    onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">容量・重量</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={product.amount || ''}
                    onChange={(e) => updateProduct(product.id, 'amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">単位</label>
                  <Select
                    value={product.unit}
                    onValueChange={(value) => updateProduct(product.id, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">g（グラム）</SelectItem>
                      <SelectItem value="kg">kg（キログラム）</SelectItem>
                      <SelectItem value="ml">ml（ミリリットル）</SelectItem>
                      <SelectItem value="l">l（リットル）</SelectItem>
                      <SelectItem value="pcs">個</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={() => removeProduct(product.id)}
                    variant="outline"
                    size="sm"
                    disabled={products.length === 1}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button onClick={addProduct} variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                商品を追加
              </Button>
              <Button onClick={clearAll} variant="ghost">
                すべてクリア
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 計算結果 */}
        {calculatedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                単価比較結果
              </CardTitle>
              <CardDescription>
                単価の安い順に表示されています（最安値商品には王冠マークが付きます）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calculatedProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      product.isLowestPrice 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded min-w-[2rem] text-center">
                            {index + 1}
                          </span>
                          {product.isLowestPrice && (
                            <Crown className="h-5 w-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">
                            {product.name || `商品${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatPrice(product.price)} / {product.amount}{unitLabels[product.unit]}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          product.isLowestPrice ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {formatUnitPrice(product.unitPrice, product.unit)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {unitPriceLabels[product.unit === 'kg' ? 'g' : product.unit === 'l' ? 'ml' : product.unit]}
                        </div>
                      </div>
                    </div>
                    
                    {product.isLowestPrice && (
                      <Badge className="mt-2 bg-green-500 text-white">
                        最安値
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 節約情報 */}
        {calculatedProducts.length >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                節約情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  最安値商品を選ぶことで、最も高い商品と比べて
                  <span className="font-bold text-green-600 mx-1">
                    {(((calculatedProducts[calculatedProducts.length - 1].unitPrice - calculatedProducts[0].unitPrice) / calculatedProducts[calculatedProducts.length - 1].unitPrice) * 100).toFixed(1)}%
                  </span>
                  お得になります！
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* 使用方法 */}
        <Card>
          <CardHeader>
            <CardTitle>使用方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold">1. 商品情報を入力</h4>
              <p className="text-sm text-gray-600">
                比較したい商品の名前、価格、容量・重量、単位を入力します。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. 商品を追加</h4>
              <p className="text-sm text-gray-600">
                「商品を追加」ボタンで複数の商品を比較できます。
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. 単価を確認</h4>
              <p className="text-sm text-gray-600">
                自動計算された単価を比較して、最もお得な商品を見つけましょう。
              </p>
            </div>
            
            <Alert className="mt-4">
              <AlertDescription>
                <strong>計算例：</strong> 商品A（100g・200円）と商品B（150g・280円）の場合、
                商品Aは1gあたり2円、商品Bは1gあたり約1.87円となり、商品Bの方がお得です。
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}