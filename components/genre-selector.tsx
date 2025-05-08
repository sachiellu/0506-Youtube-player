"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shuffle } from "lucide-react"
import { motion } from "framer-motion"

interface Genre {
  id: string
  name: string
  description: string
  videos: Array<{ id: string; title: string }>
}

interface GenreSelectorProps {
  genres: Genre[]
  selectedGenre: string | null
  onSelectGenre: (genre: string) => void
  onGetRandom: () => void
  isLoading: boolean
}

export function GenreSelector({ genres, selectedGenre, onSelectGenre, onGetRandom, isLoading }: GenreSelectorProps) {
  const [activeTab, setActiveTab] = useState("all")

  // 按字母排序的曲風
  const alphabeticalGenres = [...genres].sort((a, b) => a.name.localeCompare(b.name))

  // 按類別分組的曲風
  const categories = [
    { id: "popular", name: "熱門曲風" },
    { id: "electronic", name: "電子音樂" },
    { id: "acoustic", name: "原聲音樂" },
    { id: "other", name: "其他曲風" },
  ]

  // 模擬分類（實際應用中應該有更準確的分類）
  const getCategoryGenres = (categoryId: string) => {
    if (categoryId === "popular") {
      return genres.filter((g) => ["pop", "rock", "hiphop", "jazz"].includes(g.id))
    } else if (categoryId === "electronic") {
      return genres.filter((g) => ["electronic", "techno", "house", "trance", "dubstep"].includes(g.id))
    } else if (categoryId === "acoustic") {
      return genres.filter((g) => ["classical", "folk", "acoustic", "country"].includes(g.id))
    } else {
      return genres.filter(
        (g) =>
          ![
            "pop",
            "rock",
            "hiphop",
            "jazz",
            "electronic",
            "techno",
            "house",
            "trance",
            "dubstep",
            "classical",
            "folk",
            "acoustic",
            "country",
          ].includes(g.id),
      )
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>選擇音樂曲風</CardTitle>
          <CardDescription>選擇一個曲風，我們將為您隨機播放相關音樂</CardDescription>
        </div>
        <Button onClick={onGetRandom} disabled={!selectedGenre || isLoading} className="ml-4 flex-shrink-0" size="sm">
          <Shuffle className="mr-2 h-4 w-4" />
          {isLoading ? "載入中..." : "隨機播放"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[280px] pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {alphabeticalGenres.map((genre) => (
                  <GenreButton
                    key={genre.id}
                    genre={genre}
                    isSelected={selectedGenre === genre.id}
                    onClick={() => onSelectGenre(genre.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <ScrollArea className="h-[280px] pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {getCategoryGenres(category.id).map((genre) => (
                    <GenreButton
                      key={genre.id}
                      genre={genre}
                      isSelected={selectedGenre === genre.id}
                      onClick={() => onSelectGenre(genre.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface GenreButtonProps {
  genre: Genre
  isSelected: boolean
  onClick: () => void
}

function GenreButton({ genre, isSelected, onClick }: GenreButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Button
        variant={isSelected ? "default" : "outline"}
        className={`w-full h-auto py-3 px-4 justify-start ${
          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"
        }`}
        onClick={onClick}
      >
        <div className="text-left">
          <div className="font-medium">{genre.name}</div>
        </div>
      </Button>
    </motion.div>
  )
}
