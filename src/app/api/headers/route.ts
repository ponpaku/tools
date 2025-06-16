import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URLが必要です' },
        { status: 400 }
      )
    }

    // URL形式チェック
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch (error) {
      return NextResponse.json(
        { error: '有効なURLを入力してください' },
        { status: 400 }
      )
    }

    // HTTPSまたはHTTPのみ許可
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'HTTPまたはHTTPSのURLのみサポートされています' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // サーバー側でHEADリクエストを実行
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HTTPHeaderViewer/1.0)',
      },
      // タイムアウト設定
      signal: AbortSignal.timeout(10000) // 10秒
    }).catch(async (headError) => {
      // HEADが失敗したらGETを試行
      return fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; HTTPHeaderViewer/1.0)',
        },
        signal: AbortSignal.timeout(10000)
      })
    })

    const endTime = Date.now()
    const responseTime = endTime - startTime

    // レスポンスヘッダーを取得
    const headers: Array<{ name: string; value: string }> = []
    response.headers.forEach((value, name) => {
      headers.push({ name, value })
    })

    return NextResponse.json({
      url,
      status: response.status,
      statusText: response.statusText,
      headers,
      timestamp: new Date().toISOString(),
      responseTime
    })

  } catch (error) {
    console.error('Header fetch error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return NextResponse.json(
          { error: 'リクエストがタイムアウトしました' },
          { status: 408 }
        )
      }
      
      return NextResponse.json(
        { error: `リクエストエラー: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: '不明なエラーが発生しました' },
      { status: 500 }
    )
  }
}