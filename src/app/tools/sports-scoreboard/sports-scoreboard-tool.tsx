'use client'

import { useState, useEffect } from 'react'
import { ToolLayout } from '@/components/layout/tool-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Maximize, Minimize, RotateCcw, Play, Pause, Plus, Minus, Timer } from 'lucide-react'

type SportType = 'basketball' | 'volleyball' | 'tennis' | 'ping-pong'

interface SportsConfig {
  name: string
  maxSets: number
  winCondition: 'points' | 'games'
  maxPoints: number
  advantage?: boolean
  quarters?: number
}

interface Team {
  name: string
  sets: number
  currentScore: number
}

interface SetResult {
  set: number
  team1Score: number
  team2Score: number
  winner: 1 | 2
}

interface GameState {
  sport: SportType
  team1: Team
  team2: Team
  setHistory: SetResult[]
  currentSet: number
  isGameStarted: boolean
  isGameFinished: boolean
  setTimeLimit?: number
  setTimeRemaining?: number
  isTimerRunning: boolean
}

const sportsConfigs: Record<SportType, SportsConfig> = {
  basketball: {
    name: 'バスケットボール',
    maxSets: 4,
    winCondition: 'points',
    maxPoints: 100,
    quarters: 4
  },
  volleyball: {
    name: 'バレーボール',
    maxSets: 5,
    winCondition: 'points',
    maxPoints: 25,
    advantage: true
  },
  tennis: {
    name: 'テニス',
    maxSets: 3,
    winCondition: 'games',
    maxPoints: 6,
    advantage: true
  },
  'ping-pong': {
    name: '卓球',
    maxSets: 5,
    winCondition: 'points',
    maxPoints: 11,
    advantage: true
  }
}

export default function SportsScoreboardTool() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [setTimeLimit, setSetTimeLimit] = useState('')
  const [gameState, setGameState] = useState<GameState>({
    sport: 'basketball',
    team1: { name: 'チーム A', sets: 0, currentScore: 0 },
    team2: { name: 'チーム B', sets: 0, currentScore: 0 },
    setHistory: [],
    currentSet: 1,
    isGameStarted: false,
    isGameFinished: false,
    isTimerRunning: false
  })

  const config = sportsConfigs[gameState.sport]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen])

  // タイマー機能
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (gameState.isTimerRunning && gameState.setTimeRemaining && gameState.setTimeRemaining > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.setTimeRemaining && prev.setTimeRemaining > 0) {
            const newTime = prev.setTimeRemaining - 1
            if (newTime === 0) {
              // 時間終了時の処理
              return { ...prev, setTimeRemaining: 0, isTimerRunning: false }
            }
            return { ...prev, setTimeRemaining: newTime }
          }
          return prev
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState.isTimerRunning, gameState.setTimeRemaining])

  const updateTeamName = (team: 1 | 2, name: string) => {
    setGameState(prev => {
      if (team === 1) {
        return {
          ...prev,
          team1: { ...prev.team1, name }
        }
      } else {
        return {
          ...prev,
          team2: { ...prev.team2, name }
        }
      }
    })
  }

  const updateScore = (team: 1 | 2, increment: number) => {
    if (gameState.isGameFinished) return

    setGameState(prev => {
      const teamKey = `team${team}` as 'team1' | 'team2'
      const currentTeam = prev[teamKey]
      const newScore = Math.max(0, currentTeam.currentScore + increment)
      
      const newState = {
        ...prev,
        [teamKey]: { ...currentTeam, currentScore: newScore },
        isGameStarted: true
      }

      // チェック：セット終了条件
      if (checkSetEnd(newState, team)) {
        return finishSet(newState, team)
      }

      return newState
    })
  }

  const checkSetEnd = (state: GameState, scoringTeam: 1 | 2): boolean => {
    const team1Score = state.team1.currentScore
    const team2Score = state.team2.currentScore
    const config = sportsConfigs[state.sport]

    if (config.advantage) {
      // アドバンテージルール（バレー、テニス、卓球）
      const maxScore = Math.max(team1Score, team2Score)
      const minScore = Math.min(team1Score, team2Score)
      return maxScore >= config.maxPoints && (maxScore - minScore) >= 2
    } else {
      // 通常ルール（バスケ）
      return team1Score >= config.maxPoints || team2Score >= config.maxPoints
    }
  }

  const finishSet = (state: GameState, winner: 1 | 2): GameState => {
    const setResult: SetResult = {
      set: state.currentSet,
      team1Score: state.team1.currentScore,
      team2Score: state.team2.currentScore,
      winner
    }

    const newTeam1Sets = state.team1.sets + (winner === 1 ? 1 : 0)
    const newTeam2Sets = state.team2.sets + (winner === 2 ? 1 : 0)

    const setsToWin = Math.ceil(config.maxSets / 2)
    const isGameFinished = newTeam1Sets >= setsToWin || newTeam2Sets >= setsToWin

    return {
      ...state,
      team1: { ...state.team1, sets: newTeam1Sets, currentScore: 0 },
      team2: { ...state.team2, sets: newTeam2Sets, currentScore: 0 },
      setHistory: [...state.setHistory, setResult],
      currentSet: isGameFinished ? state.currentSet : state.currentSet + 1,
      isGameFinished
    }
  }

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      team1: { ...prev.team1, sets: 0, currentScore: 0 },
      team2: { ...prev.team2, sets: 0, currentScore: 0 },
      setHistory: [],
      currentSet: 1,
      isGameStarted: false,
      isGameFinished: false,
      setTimeRemaining: prev.setTimeLimit,
      isTimerRunning: false
    }))
  }

  const manualSetChange = (increment: number) => {
    setGameState(prev => {
      const newSet = Math.max(1, Math.min(config.maxSets, prev.currentSet + increment))
      if (newSet !== prev.currentSet) {
        return {
          ...prev,
          currentSet: newSet,
          team1: { ...prev.team1, currentScore: 0 },
          team2: { ...prev.team2, currentScore: 0 },
          setTimeRemaining: prev.setTimeLimit,
          isTimerRunning: false
        }
      }
      return prev
    })
  }

  const toggleTimer = () => {
    setGameState(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }))
  }

  const setTimer = () => {
    const timeInSeconds = parseInt(setTimeLimit) * 60
    if (timeInSeconds > 0) {
      setGameState(prev => ({
        ...prev,
        setTimeLimit: timeInSeconds,
        setTimeRemaining: timeInSeconds
      }))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetCurrentSet = () => {
    setGameState(prev => ({
      ...prev,
      team1: { ...prev.team1, currentScore: 0 },
      team2: { ...prev.team2, currentScore: 0 }
    }))
  }

  const getWinnerMessage = () => {
    if (!gameState.isGameFinished) return ''
    const winner = gameState.team1.sets > gameState.team2.sets ? gameState.team1.name : gameState.team2.name
    return `🏆 ${winner} の勝利！`
  }

  const FullscreenScoreboard = () => (
    <div className="fixed inset-0 bg-black text-white z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900">
        <div className="text-xl font-bold">{config.name}</div>
        <div className="flex gap-2 items-center">
          {/* タイマー表示 */}
          {gameState.setTimeRemaining && (
            <div className="text-lg font-mono bg-gray-800 px-3 py-1 rounded">
              {formatTime(gameState.setTimeRemaining)}
            </div>
          )}
          <Button onClick={() => setIsFullscreen(false)} className="bg-red-600 hover:bg-red-700" size="sm">
            <Minimize className="w-4 h-4 mr-2" />
            終了
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl px-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* チーム1 */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-4">{gameState.team1.name}</div>
              <div className="text-8xl md:text-9xl font-bold mb-4">{gameState.team1.currentScore}</div>
              <div className="text-2xl md:text-3xl mb-4">セット: {gameState.team1.sets}</div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => updateScore(1, 1)} 
                  disabled={gameState.isGameFinished}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-6 h-6" />
                </Button>
                <Button 
                  onClick={() => updateScore(1, -1)} 
                  disabled={gameState.isGameFinished}
                  size="lg"
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  <Minus className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* 中央情報 */}
            <div className="text-center">
              <div className="text-xl md:text-2xl mb-4">第{gameState.currentSet}セット</div>
              {gameState.isGameFinished && (
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">
                  {getWinnerMessage()}
                </div>
              )}
              <div className="text-lg mb-4">
                {config.maxPoints}点先取
                {config.advantage && '（2点差）'}
              </div>
              {/* セット手動変更とタイマー制御 */}
              <div className="flex gap-2 justify-center items-center">
                <Button 
                  onClick={() => manualSetChange(-1)} 
                  disabled={gameState.currentSet <= 1}
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  前セット
                </Button>
                <Button 
                  onClick={() => manualSetChange(1)} 
                  disabled={gameState.currentSet >= config.maxSets}
                  size="sm"
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  次セット
                </Button>
                {gameState.setTimeRemaining && (
                  <Button 
                    onClick={toggleTimer}
                    size="sm"
                    className={`${gameState.isTimerRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {gameState.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* チーム2 */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-4">{gameState.team2.name}</div>
              <div className="text-8xl md:text-9xl font-bold mb-4">{gameState.team2.currentScore}</div>
              <div className="text-2xl md:text-3xl mb-4">セット: {gameState.team2.sets}</div>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => updateScore(2, 1)} 
                  disabled={gameState.isGameFinished}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="w-6 h-6" />
                </Button>
                <Button 
                  onClick={() => updateScore(2, -1)} 
                  disabled={gameState.isGameFinished}
                  size="lg"
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  <Minus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <ToolLayout
        title="スポーツスコアボード"
        description="バスケ・バレー・テニス・卓球のスコア管理"
      >
        <div className="space-y-6">
          {/* ゲーム設定 */}
          <Card>
            <CardHeader>
              <CardTitle>ゲーム設定</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">スポーツ</label>
                  <Select 
                    value={gameState.sport} 
                    onValueChange={(value: SportType) => setGameState(prev => ({ ...prev, sport: value }))}
                    disabled={gameState.isGameStarted}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basketball">🏀 バスケットボール</SelectItem>
                      <SelectItem value="volleyball">🏐 バレーボール</SelectItem>
                      <SelectItem value="tennis">🎾 テニス</SelectItem>
                      <SelectItem value="ping-pong">🏓 卓球</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">チーム A</label>
                  <Input
                    value={gameState.team1.name}
                    onChange={(e) => updateTeamName(1, e.target.value)}
                    placeholder="チーム名"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">チーム B</label>
                  <Input
                    value={gameState.team2.name}
                    onChange={(e) => updateTeamName(2, e.target.value)}
                    placeholder="チーム名"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">セットタイマー（分）</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={setTimeLimit}
                      onChange={(e) => setSetTimeLimit(e.target.value)}
                      placeholder="例: 20"
                      className="flex-1"
                    />
                    <Button onClick={setTimer} size="sm">
                      <Timer className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {gameState.setTimeRemaining && (
                  <div>
                    <label className="block text-sm font-medium mb-2">残り時間</label>
                    <div className="flex gap-2 items-center">
                      <div className="text-2xl font-mono bg-gray-100 px-3 py-1 rounded">
                        {formatTime(gameState.setTimeRemaining)}
                      </div>
                      <Button onClick={toggleTimer} size="sm">
                        {gameState.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setIsFullscreen(true)} className="flex items-center gap-2">
                  <Maximize className="w-4 h-4" />
                  フルスクリーン
                </Button>
                
                <Button onClick={resetCurrentSet} variant="outline" disabled={!gameState.isGameStarted}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  セットリセット
                </Button>
                
                <Button onClick={() => manualSetChange(-1)} variant="outline" disabled={gameState.currentSet <= 1}>
                  前セット
                </Button>
                
                <Button onClick={() => manualSetChange(1)} variant="outline" disabled={gameState.currentSet >= config.maxSets}>
                  次セット
                </Button>
                
                <Button onClick={resetGame} variant="outline">
                  新しいゲーム
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* スコアボード */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{config.name} - 第{gameState.currentSet}セット</CardTitle>
                  {gameState.setTimeRemaining && (
                    <div className="text-lg font-mono text-gray-600 mt-1">
                      残り時間: {formatTime(gameState.setTimeRemaining)}
                    </div>
                  )}
                </div>
                {gameState.isGameFinished && (
                  <div className="text-xl font-bold text-green-600">
                    {getWinnerMessage()}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                {/* チーム1 */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{gameState.team1.name}</h3>
                  <div className="text-6xl font-bold mb-4">{gameState.team1.currentScore}</div>
                  <div className="text-lg mb-4">セット: {gameState.team1.sets}</div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => updateScore(1, 1)} 
                      disabled={gameState.isGameFinished}
                      size="lg"
                    >
                      +1
                    </Button>
                    <Button 
                      onClick={() => updateScore(1, -1)} 
                      variant="outline"
                      disabled={gameState.isGameFinished}
                    >
                      -1
                    </Button>
                  </div>
                </div>

                {/* チーム2 */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{gameState.team2.name}</h3>
                  <div className="text-6xl font-bold mb-4">{gameState.team2.currentScore}</div>
                  <div className="text-lg mb-4">セット: {gameState.team2.sets}</div>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => updateScore(2, 1)} 
                      disabled={gameState.isGameFinished}
                      size="lg"
                    >
                      +1
                    </Button>
                    <Button 
                      onClick={() => updateScore(2, -1)} 
                      variant="outline"
                      disabled={gameState.isGameFinished}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 text-sm text-gray-600">
                {config.maxPoints}点先取{config.advantage && '（2点差必要）'} | {Math.ceil(config.maxSets / 2)}セット先取
              </div>
            </CardContent>
          </Card>

          {/* セット履歴 */}
          {gameState.setHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>セット履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameState.setHistory.map((set, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">第{set.set}セット</span>
                      <span className="text-lg">
                        {set.team1Score} - {set.team2Score}
                      </span>
                      <span className={`font-bold ${set.winner === 1 ? 'text-blue-600' : 'text-red-600'}`}>
                        {set.winner === 1 ? gameState.team1.name : gameState.team2.name} 勝利
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 説明 */}
          <Card>
            <CardHeader>
              <CardTitle>スポーツ別ルール</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🏀 バスケットボール</h4>
                  <p>時間制限なし、得点上限なし</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏐 バレーボール</h4>
                  <p>25点先取（2点差必要）、5セットマッチ（3セット先取）</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎾 テニス</h4>
                  <p>6ゲーム先取（2ゲーム差必要）、3セットマッチ（2セット先取）</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏓 卓球</h4>
                  <p>11点先取（2点差必要）、5ゲームマッチ（3ゲーム先取）</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {isFullscreen && <FullscreenScoreboard />}
    </>
  )
}