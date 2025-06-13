'use client'

import { useState, useEffect } from 'react'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Player {
  id: string
  name: string
  score: number
}

interface GameSession {
  id: string
  name: string
  players: Player[]
  maxScore?: number
  gameType: 'highest' | 'lowest' | 'target'
}

export default function ScoreboardPage() {
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [newSessionName, setNewSessionName] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [gameType, setGameType] = useState<'highest' | 'lowest' | 'target'>('highest')
  const [targetScore, setTargetScore] = useState('')

  // ローカルストレージから読み込み
  useEffect(() => {
    const savedSessions = localStorage.getItem('scoreboardSessions')
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions)
      setSessions(parsedSessions)
      if (parsedSessions.length > 0) {
        setCurrentSession(parsedSessions[0])
      }
    }
  }, [])

  // ローカルストレージに保存
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('scoreboardSessions', JSON.stringify(sessions))
    }
  }, [sessions])

  const createSession = () => {
    if (!newSessionName.trim()) {
      alert('セッション名を入力してください')
      return
    }

    const newSession: GameSession = {
      id: Date.now().toString(),
      name: newSessionName,
      players: [],
      gameType,
      maxScore: gameType === 'target' ? parseInt(targetScore) : undefined
    }

    setSessions([newSession, ...sessions])
    setCurrentSession(newSession)
    setNewSessionName('')
    setTargetScore('')
  }

  const addPlayer = () => {
    if (!currentSession || !newPlayerName.trim()) {
      alert('プレイヤー名を入力してください')
      return
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      score: 0
    }

    const updatedSession = {
      ...currentSession,
      players: [...currentSession.players, newPlayer]
    }

    updateSession(updatedSession)
    setNewPlayerName('')
  }

  const updatePlayerScore = (playerId: string, newScore: number) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      players: currentSession.players.map(player =>
        player.id === playerId ? { ...player, score: newScore } : player
      )
    }

    updateSession(updatedSession)
  }

  const removePlayer = (playerId: string) => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      players: currentSession.players.filter(player => player.id !== playerId)
    }

    updateSession(updatedSession)
  }

  const updateSession = (updatedSession: GameSession) => {
    setSessions(sessions.map(session =>
      session.id === updatedSession.id ? updatedSession : session
    ))
    setCurrentSession(updatedSession)
  }

  const deleteSession = (sessionId: string) => {
    const filteredSessions = sessions.filter(session => session.id !== sessionId)
    setSessions(filteredSessions)
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(filteredSessions.length > 0 ? filteredSessions[0] : null)
    }
  }

  const resetScores = () => {
    if (!currentSession) return

    const updatedSession = {
      ...currentSession,
      players: currentSession.players.map(player => ({ ...player, score: 0 }))
    }

    updateSession(updatedSession)
  }

  const getSortedPlayers = () => {
    if (!currentSession) return []

    const players = [...currentSession.players]
    
    switch (currentSession.gameType) {
      case 'highest':
        return players.sort((a, b) => b.score - a.score)
      case 'lowest':
        return players.sort((a, b) => a.score - b.score)
      case 'target':
        const target = currentSession.maxScore || 0
        return players.sort((a, b) => 
          Math.abs(a.score - target) - Math.abs(b.score - target)
        )
      default:
        return players
    }
  }

  const getPlayerRank = (player: Player, sortedPlayers: Player[]) => {
    return sortedPlayers.findIndex(p => p.id === player.id) + 1
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 2: return 'bg-gray-100 border-gray-300 text-gray-800'
      case 3: return 'bg-orange-100 border-orange-300 text-orange-800'
      default: return 'bg-white border-gray-200'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `${rank}位`
    }
  }

  const sortedPlayers = getSortedPlayers()

  return (
    <ToolLayout
      title="スコアボード"
      description="ゲームの点数を記録・管理します"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>新しいゲームセッション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">セッション名</label>
                  <Input
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="例: ポーカーナイト"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ゲームタイプ</label>
                  <Select value={gameType} onValueChange={(value: any) => setGameType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest">高得点が勝ち</SelectItem>
                      <SelectItem value="lowest">低得点が勝ち</SelectItem>
                      <SelectItem value="target">目標点に近い方が勝ち</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {gameType === 'target' && (
                <div>
                  <label className="block text-sm font-medium mb-2">目標点数</label>
                  <Input
                    type="number"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="100"
                  />
                </div>
              )}
              
              <Button onClick={createSession} className="w-full">
                セッション作成
              </Button>
            </div>
          </CardContent>
        </Card>

        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>セッション選択</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      currentSession?.id === session.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{session.name}</h4>
                        <p className="text-sm text-gray-600">
                          {session.players.length}人 | {
                            session.gameType === 'highest' ? '高得点勝ち' :
                            session.gameType === 'lowest' ? '低得点勝ち' :
                            `目標${session.maxScore}点`
                          }
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentSession && (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{currentSession.name}</CardTitle>
                  <Button onClick={resetScores} variant="outline" size="sm">
                    スコアリセット
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">新しいプレイヤー</label>
                    <Input
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="プレイヤー名"
                      onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addPlayer} className="w-full">
                      プレイヤー追加
                    </Button>
                  </div>
                </div>

                {sortedPlayers.length > 0 && (
                  <div className="space-y-3">
                    {sortedPlayers.map((player) => {
                      const rank = getPlayerRank(player, sortedPlayers)
                      return (
                        <div
                          key={player.id}
                          className={`p-4 rounded-lg border ${getRankColor(rank)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getRankIcon(rank)}</span>
                              <div>
                                <h4 className="font-semibold text-lg">{player.name}</h4>
                                <p className="text-sm opacity-75">
                                  {currentSession.gameType === 'target' && currentSession.maxScore
                                    ? `目標まで ${Math.abs(player.score - currentSession.maxScore)} ポイント`
                                    : `${rank}位`
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <Input
                                  type="number"
                                  value={player.score}
                                  onChange={(e) => updatePlayerScore(player.id, parseInt(e.target.value) || 0)}
                                  className="w-24 text-right text-xl font-bold"
                                />
                              </div>
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removePlayer(player.id)}
                              >
                                削除
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {currentSession.players.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    プレイヤーを追加してゲームを始めましょう
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>使い方</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold mb-2">基本的な使い方</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>新しいゲームセッションを作成</li>
                  <li>ゲームタイプを選択（高得点勝ち、低得点勝ち、目標点勝ち）</li>
                  <li>プレイヤーを追加</li>
                  <li>ゲーム進行に合わせてスコアを更新</li>
                  <li>リアルタイムで順位が更新されます</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">ゲームタイプ</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>高得点が勝ち</strong>: 点数が高い順に順位付け</li>
                  <li><strong>低得点が勝ち</strong>: 点数が低い順に順位付け（ゴルフなど）</li>
                  <li><strong>目標点に近い方が勝ち</strong>: 設定した目標点に最も近い順に順位付け</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">活用例</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>カードゲーム（ポーカー、ブラックジャック等）</li>
                  <li>ボードゲーム</li>
                  <li>ダーツやビリヤード</li>
                  <li>クイズ大会</li>
                  <li>スポーツの得点管理</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">機能</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>複数のゲームセッションを管理</li>
                  <li>自動順位計算と表示</li>
                  <li>ローカルストレージでデータ保存</li>
                  <li>スコアのリアルタイム更新</li>
                  <li>上位3位には特別なアイコン表示</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}