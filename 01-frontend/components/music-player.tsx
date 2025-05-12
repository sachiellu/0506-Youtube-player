"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, Heart, SkipForward, SkipBack, Minimize2, Maximize2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useFavorites } from "@/contexts/favorites-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MusicPlayerProps {
  videoId: string | null
  isLoading: boolean
  onVideoEnd: () => void
  onPreviousVideo: () => void
  currentVideoTitle?: string
  currentVideoGenre?: string
  hasPreviousVideo?: boolean
}

export function MusicPlayer({
  videoId,
  isLoading,
  onVideoEnd,
  onPreviousVideo,
  currentVideoTitle = "未知歌曲",
  currentVideoGenre = "未知曲風",
  hasPreviousVideo = false,
}: MusicPlayerProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  const isFavorited = videoId ? isFavorite(videoId) : false

  // 切換收藏狀態
  const toggleFavorite = () => {
    if (!videoId) return

    if (isFavorited) {
      removeFavorite(videoId)
    } else {
      addFavorite(videoId, currentVideoTitle, currentVideoGenre)
    }
  }

  // 切換靜音
  const toggleMute = () => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe")
    if (iframe) {
      // 在實際應用中，這裡會使用 YouTube API 控制音量
      // 這裡只是切換狀態
      setIsMuted(!isMuted)
    }
  }

  // 切換最小化狀態
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  // 渲染YouTube播放器
  const renderYouTubePlayer = () => {
    if (!videoId) return null

    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    )
  }

  if (isMinimized) {
    // 簡易播放視窗 (固定在右下角)
    return (
      <Card className="fixed bottom-4 right-4 z-50 w-80 shadow-lg overflow-hidden">
        <div className="relative">
          {/* 縮小模式下的視頻播放器 (高度較小) */}
          <div className="h-24 bg-black">{videoId && renderYouTubePlayer()}</div>

          <div className="bg-card p-3 flex items-center">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <Music className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentVideoTitle}</p>
              <p className="text-xs text-muted-foreground truncate">{currentVideoGenre}</p>
            </div>
          </div>

          <div className="p-2 bg-card border-t flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute} disabled={!videoId}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${isFavorited ? "text-red-500" : ""}`}
                onClick={toggleFavorite}
                disabled={!videoId}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onPreviousVideo}
                disabled={!videoId || isLoading || !hasPreviousVideo}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onVideoEnd}
                disabled={!videoId || isLoading}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMinimized}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // 正常播放器視圖
  return (
    <Card className="overflow-hidden mb-6 shadow-md">
      <div ref={playerRef} className="relative aspect-video bg-black">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Music className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <p className="text-lg font-medium text-white">正在載入音樂...</p>
              </div>
            </motion.div>
          ) : !videoId ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80"
            >
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">選擇一個音樂曲風開始</h3>
                <p className="text-gray-300">從左側選擇您喜愛的曲風，我們將為您隨機播放相關音樂</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={videoId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              {renderYouTubePlayer()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CardContent className="p-4 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMute} disabled={!videoId}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? "取消靜音" : "靜音"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMinimized} disabled={!videoId}>
                    <Minimize2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>縮小播放器</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {videoId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavorited ? "text-red-500" : ""}
                    >
                      <Heart className={`h-5 w-5 transition-all ${isFavorited ? "fill-red-500" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorited ? "取消收藏" : "收藏"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex-1 min-w-0 px-2">
            {videoId && (
              <div>
                <p className="text-sm font-medium truncate">{currentVideoTitle}</p>
                <p className="text-xs text-muted-foreground">{currentVideoGenre}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPreviousVideo}
                    disabled={!videoId || isLoading || !hasPreviousVideo}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>前一首</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onVideoEnd} disabled={!videoId || isLoading}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>下一首</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
