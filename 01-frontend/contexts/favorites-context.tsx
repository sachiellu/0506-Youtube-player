"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface FavoriteItem {
  id: string
  title: string
  genre: string
  timestamp: number
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addFavorite: (id: string, title: string, genre: string) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  // 從本地存儲加載收藏
  useEffect(() => {
    const storedFavorites = localStorage.getItem("music-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
      }
    }
  }, [])

  // 保存收藏到本地存儲
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("music-favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  // 添加收藏
  const addFavorite = (id: string, title: string, genre: string) => {
    setFavorites((prev) => {
      // 檢查是否已經收藏
      if (prev.some((item) => item.id === id)) {
        return prev
      }

      return [
        ...prev,
        {
          id,
          title,
          genre,
          timestamp: Date.now(),
        },
      ]
    })
  }

  // 移除收藏
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))

    // 如果收藏列表為空，清除本地存儲
    if (favorites.length === 1) {
      localStorage.removeItem("music-favorites")
    }
  }

  // 檢查是否已收藏
  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
