"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Play, Trash2 } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface FavoritesListProps {
  onSelect: (id: string) => void
  currentVideo: string | null
}

export function FavoritesList({ onSelect, currentVideo }: FavoritesListProps) {
  const { favorites, removeFavorite } = useFavorites()
  const [sortBy, setSortBy] = useState<"recent" | "title">("recent")

  // 排序收藏
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "recent") {
      return b.timestamp - a.timestamp
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  if (favorites.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            我的收藏
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>尚無收藏音樂</p>
            <p className="text-sm mt-1">點擊播放器中的心形圖標收藏音樂</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            我的收藏 ({favorites.length})
          </CardTitle>
          <div className="flex gap-1 text-xs">
            <Button
              variant={sortBy === "recent" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSortBy("recent")}
            >
              最近添加
            </Button>
            <Button
              variant={sortBy === "title" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSortBy("title")}
            >
              按標題
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <AnimatePresence>
            <ul className="divide-y">
              {sortedFavorites.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="p-3 hover:bg-muted/50 group">
                    <div className="flex items-start gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`mt-0.5 flex-shrink-0 ${currentVideo === item.id ? "text-primary" : ""}`}
                        onClick={() => onSelect(item.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.genre}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFavorite(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
