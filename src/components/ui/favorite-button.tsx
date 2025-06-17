'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FavoriteButtonProps {
  toolId: string
  className?: string
}

export function FavoriteButton({ toolId, className = "" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // ローカルストレージからお気に入り状態を読み込み
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorite-tools')
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites)
        setIsFavorite(Array.isArray(favorites) && favorites.includes(toolId))
      } catch (error) {
        console.error('Failed to parse favorite tools from localStorage:', error)
      }
    }
  }, [toolId])

  // お気に入りの追加/削除
  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('favorite-tools')
    let favorites: string[] = []
    
    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites)
        if (!Array.isArray(favorites)) {
          favorites = []
        }
      } catch (error) {
        console.error('Failed to parse favorite tools from localStorage:', error)
        favorites = []
      }
    }

    const newFavorites = isFavorite
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId]
    
    localStorage.setItem('favorite-tools', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  return (
    <Button
      onClick={toggleFavorite}
      variant="outline"
      size="sm"
      className={`${className} ${isFavorite ? 'border-pink-400 bg-pink-50 hover:bg-pink-100' : 'hover:border-pink-400 hover:bg-pink-50'}`}
    >
      <Heart className={`mr-2 h-4 w-4 ${
        isFavorite 
          ? "text-pink-500 fill-current" 
          : "text-gray-400"
      }`} />
      {isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
    </Button>
  )
}