'use client'

import { useState, useMemo } from 'react'
import { ToolLayout, CopyButton } from '@/components/layout/tool-layout'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, AlertTriangle, CheckCircle, Copy } from 'lucide-react'

interface JwtDecoded {
  header: any
  payload: any
  signature: string
  isValid: boolean
  error?: string
  exp?: number
  iat?: number
  nbf?: number
}

interface PasetoDecoded {
  version: string
  purpose: string
  payload: any
  footer?: any
  isValid: boolean
  error?: string
}

// Base64 URL decode function
function base64UrlDecode(str: string): string {
  try {
    // Convert base64url to base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    
    // Pad with = characters if needed
    while (base64.length % 4) {
      base64 += '='
    }
    
    return atob(base64)
  } catch {
    throw new Error('Invalid base64url encoding')
  }
}

// JWT Decoder
function decodeJWT(token: string): JwtDecoded {
  try {
    const parts = token.split('.')
    
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: '',
        isValid: false,
        error: 'Invalid JWT format. JWT should have 3 parts separated by dots.'
      }
    }

    const [headerPart, payloadPart, signaturePart] = parts

    // Decode header
    const headerJson = base64UrlDecode(headerPart)
    const header = JSON.parse(headerJson)

    // Decode payload
    const payloadJson = base64UrlDecode(payloadPart)
    const payload = JSON.parse(payloadJson)

    // Get signature (keep as base64url)
    const signature = signaturePart

    return {
      header,
      payload,
      signature,
      isValid: true,
      exp: payload.exp,
      iat: payload.iat,
      nbf: payload.nbf
    }
  } catch (error) {
    return {
      header: null,
      payload: null,
      signature: '',
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to decode JWT'
    }
  }
}

// PASETO Decoder (basic v4.public parsing)
function decodePASETO(token: string): PasetoDecoded {
  try {
    if (!token.startsWith('v4.public.')) {
      return {
        version: '',
        purpose: '',
        payload: null,
        isValid: false,
        error: 'Only PASETO v4.public tokens are supported'
      }
    }

    // Remove the v4.public prefix
    const withoutPrefix = token.substring(10)
    
    // Split by dots (payload.footer or just payload)
    const parts = withoutPrefix.split('.')
    
    if (parts.length === 0 || parts.length > 2) {
      return {
        version: 'v4',
        purpose: 'public',
        payload: null,
        isValid: false,
        error: 'Invalid PASETO format'
      }
    }

    // Decode payload
    const payloadBase64 = parts[0]
    const payloadJson = base64UrlDecode(payloadBase64)
    const payload = JSON.parse(payloadJson)

    // Decode footer if present
    let footer = null
    if (parts.length === 2 && parts[1]) {
      try {
        const footerJson = base64UrlDecode(parts[1])
        footer = JSON.parse(footerJson)
      } catch {
        footer = parts[1] // Keep as string if not JSON
      }
    }

    return {
      version: 'v4',
      purpose: 'public',
      payload,
      footer,
      isValid: true
    }
  } catch (error) {
    return {
      version: '',
      purpose: '',
      payload: null,
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to decode PASETO'
    }
  }
}

// Time format utility
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

// Check if JWT is expired
function isExpired(exp?: number): boolean {
  if (!exp) return false
  return Date.now() / 1000 > exp
}

// Check if JWT is not yet valid
function isNotYetValid(nbf?: number): boolean {
  if (!nbf) return false
  return Date.now() / 1000 < nbf
}

export default function JwtDecoderTool() {
  const [inputToken, setInputToken] = useState('')
  const [tokenType, setTokenType] = useState<'auto' | 'jwt' | 'paseto'>('auto')

  // Detect token type
  const detectedType = useMemo(() => {
    if (!inputToken.trim()) return null
    
    if (inputToken.startsWith('v1.') || inputToken.startsWith('v2.') || 
        inputToken.startsWith('v3.') || inputToken.startsWith('v4.')) {
      return 'paseto'
    }
    
    if (inputToken.split('.').length === 3) {
      return 'jwt'
    }
    
    return 'unknown'
  }, [inputToken])

  // Decode result
  const decodeResult = useMemo(() => {
    if (!inputToken.trim()) return null

    const actualType = tokenType === 'auto' ? detectedType : tokenType

    if (actualType === 'jwt') {
      return { type: 'jwt' as const, data: decodeJWT(inputToken) }
    } else if (actualType === 'paseto') {
      return { type: 'paseto' as const, data: decodePASETO(inputToken) }
    }

    return null
  }, [inputToken, tokenType, detectedType])

  // Type guards
  const jwtData = decodeResult?.type === 'jwt' ? decodeResult.data : null
  const pasetoData = decodeResult?.type === 'paseto' ? decodeResult.data : null

  const sampleTokens = {
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.Rwkdm6JF2blW-66RP63NiCY8VIDhLXQIjJE0K-UXCQw',
    paseto: 'v4.public.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9'
  }

  return (
    <ToolLayout
      title="JWT/PASTOデコーダ"
      description="JWT（JSON Web Token）とPASETOの解析・デコードツール"
    >
      <div className="space-y-6">
        {/* Token Input */}
        <Card>
          <CardHeader>
            <CardTitle>トークンを入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="JWT または PASETO トークンを入力してください..."
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            
            {detectedType && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">検出されたトークン形式:</span>
                <Badge variant={detectedType === 'jwt' ? 'default' : detectedType === 'paseto' ? 'secondary' : 'destructive'}>
                  {detectedType === 'jwt' ? 'JWT' : detectedType === 'paseto' ? 'PASETO' : '不明'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Tokens */}
        <Card>
          <CardHeader>
            <CardTitle>サンプルトークン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>JWT</Badge>
                  <span className="text-sm text-gray-600">JSON Web Token サンプル</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 p-2 rounded text-xs font-mono break-all flex-1">
                    {sampleTokens.jwt}
                  </code>
                  <button
                    onClick={() => setInputToken(sampleTokens.jwt)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    使用
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">PASETO</Badge>
                  <span className="text-sm text-gray-600">PASETO v4.public サンプル</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 p-2 rounded text-xs font-mono break-all flex-1">
                    {sampleTokens.paseto}
                  </code>
                  <button
                    onClick={() => setInputToken(sampleTokens.paseto)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    使用
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decode Results */}
        {decodeResult && (
          <div className="space-y-6">
            {!decodeResult.data.isValid ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800">
                      <strong>エラー:</strong> {decodeResult.data.error}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Validation Status */}
                {decodeResult.type === 'jwt' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>検証結果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">トークン形式: 有効</span>
                        </div>
                        
                        {jwtData?.exp && (
                          <div className="flex items-center gap-2">
                            {isExpired(jwtData.exp) ? (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600">期限切れ</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm">有効期限内</span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {jwtData?.nbf && isNotYetValid(jwtData.nbf) && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-600">まだ有効になっていません</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* JWT Results */}
                {jwtData?.isValid && (
                  <Tabs defaultValue="header">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="header">ヘッダー</TabsTrigger>
                      <TabsTrigger value="payload">ペイロード</TabsTrigger>
                      <TabsTrigger value="signature">署名</TabsTrigger>
                    </TabsList>

                    <TabsContent value="header">
                      <Card>
                        <CardHeader>
                          <CardTitle>ヘッダー (Header)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">JSON</span>
                                <CopyButton text={JSON.stringify(jwtData.header, null, 2)} />
                              </div>
                              <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(jwtData.header, null, 2)}
                              </pre>
                            </div>
                            
                            {/* Header fields explanation */}
                            <div className="space-y-2">
                              {jwtData.header.alg && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-blue-50 rounded">
                                  <div className="font-medium">アルゴリズム (alg)</div>
                                  <div className="md:col-span-2">{jwtData.header.alg}</div>
                                </div>
                              )}
                              {jwtData.header.typ && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-blue-50 rounded">
                                  <div className="font-medium">タイプ (typ)</div>
                                  <div className="md:col-span-2">{jwtData.header.typ}</div>
                                </div>
                              )}
                              {jwtData.header.kid && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-blue-50 rounded">
                                  <div className="font-medium">キーID (kid)</div>
                                  <div className="md:col-span-2 font-mono text-sm">{jwtData.header.kid}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="payload">
                      <Card>
                        <CardHeader>
                          <CardTitle>ペイロード (Payload)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">JSON</span>
                                <CopyButton text={JSON.stringify(jwtData.payload, null, 2)} />
                              </div>
                              <pre className="text-sm overflow-x-auto">
                                {JSON.stringify(jwtData.payload, null, 2)}
                              </pre>
                            </div>

                            {/* Standard claims */}
                            <div className="space-y-2">
                              {jwtData.payload.iss && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">発行者 (iss)</div>
                                  <div className="md:col-span-2">{jwtData.payload.iss}</div>
                                </div>
                              )}
                              {jwtData.payload.sub && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">主体 (sub)</div>
                                  <div className="md:col-span-2">{jwtData.payload.sub}</div>
                                </div>
                              )}
                              {jwtData.payload.aud && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">対象者 (aud)</div>
                                  <div className="md:col-span-2">
                                    {Array.isArray(jwtData.payload.aud) 
                                      ? jwtData.payload.aud.join(', ')
                                      : jwtData.payload.aud
                                    }
                                  </div>
                                </div>
                              )}
                              {jwtData.exp && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">有効期限 (exp)</div>
                                  <div className="md:col-span-2">
                                    {formatTimestamp(jwtData.exp)}
                                    {isExpired(jwtData.exp) && (
                                      <Badge variant="destructive" className="ml-2">期限切れ</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              {jwtData.iat && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">発行日時 (iat)</div>
                                  <div className="md:col-span-2">{formatTimestamp(jwtData.iat)}</div>
                                </div>
                              )}
                              {jwtData.nbf && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-50 rounded">
                                  <div className="font-medium">有効開始日時 (nbf)</div>
                                  <div className="md:col-span-2">
                                    {formatTimestamp(jwtData.nbf)}
                                    {isNotYetValid(jwtData.nbf) && (
                                      <Badge variant="secondary" className="ml-2">まだ無効</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="signature">
                      <Card>
                        <CardHeader>
                          <CardTitle>署名 (Signature)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Base64URL</span>
                                <CopyButton text={jwtData.signature} />
                              </div>
                              <div className="font-mono text-sm break-all">
                                {jwtData.signature}
                              </div>
                            </div>
                            
                            <Card className="border-blue-200 bg-blue-50">
                              <CardContent className="pt-6">
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-blue-600" />
                                  <span className="text-blue-800">
                                    署名の検証には秘密鍵や公開鍵が必要です。このツールは署名の表示のみを行い、検証は行いません。
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}

                {/* PASETO Results */}
                {pasetoData?.isValid && (
                  <Card>
                    <CardHeader>
                      <CardTitle>PASETO 解析結果</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="font-medium mb-1">バージョン</div>
                            <div>{pasetoData.version}</div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded">
                            <div className="font-medium mb-1">目的</div>
                            <div>{pasetoData.purpose}</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium mb-2">ペイロード</div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">JSON</span>
                              <CopyButton text={JSON.stringify(pasetoData.payload, null, 2)} />
                            </div>
                            <pre className="text-sm overflow-x-auto">
                              {JSON.stringify(pasetoData.payload, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {pasetoData.footer && (
                          <div>
                            <div className="font-medium mb-2">フッター</div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  {typeof pasetoData.footer === 'object' ? 'JSON' : 'Text'}
                                </span>
                                <CopyButton text={
                                  typeof pasetoData.footer === 'object' 
                                    ? JSON.stringify(pasetoData.footer, null, 2)
                                    : pasetoData.footer
                                } />
                              </div>
                              <pre className="text-sm overflow-x-auto">
                                {typeof pasetoData.footer === 'object' 
                                  ? JSON.stringify(pasetoData.footer, null, 2)
                                  : pasetoData.footer
                                }
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>このツールについて</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">対応形式</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>JWT (JSON Web Token)</strong> - RFC 7519準拠のトークン形式</li>
                  <li><strong>PASETO v4.public</strong> - Platform-Agnostic Security Tokens</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">主な機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>JWTのヘッダー・ペイロード・署名の分離表示</li>
                  <li>標準クレーム（iss, sub, aud, exp, iat, nbf）の解析</li>
                  <li>トークンの有効期限チェック</li>
                  <li>PASETOのペイロード・フッター解析</li>
                  <li>JSON形式での整形表示</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">利用場面</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>API認証トークンのデバッグ</li>
                  <li>JWTの内容確認・検証</li>
                  <li>トークンの有効期限確認</li>
                  <li>セキュリティ研究・学習</li>
                  <li>Web開発でのトークン分析</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">セキュリティについて</h4>
                <p className="text-red-600">
                  <strong>注意:</strong> このツールは署名の検証は行いません。機密情報が含まれる本番環境のトークンは使用しないでください。
                  すべての処理はブラウザ内で行われ、データは外部に送信されません。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}