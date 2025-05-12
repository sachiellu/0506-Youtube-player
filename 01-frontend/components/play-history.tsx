"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Play } from "lucide-react"

interface PlayHistoryProps {
  history: Array<{ id: string; title: string; genre: string }>
  onSelect: (id: string) => void
  currentVideo: string | null
}

export function PlayHistory({ history, onSelect, currentVideo }: PlayHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            播放歷史
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>尚無播放記錄</p>
            <p className="text-sm mt-1">選擇曲風開始探索音樂</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          播放歷史
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <ul className="divide-y">
            {history.map((item, index) => (
              <li key={`${item.id}-${index}`} className="p-3 hover:bg-muted/50">
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
