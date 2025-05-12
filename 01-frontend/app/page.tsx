"use client"

import { useState, useEffect, useRef } from "react"
import YouTubePlayer from '@/components/YouTubePlayer';
import CustomPlayerControls from '@/components/CustomPlayerControls';
import { MusicPlayer } from "@/components/music-player"
import { GenreSelector } from "@/components/genre-selector"
import { PlayHistory } from "@/components/play-history"
import { FavoritesList } from "@/components/favorites-list"
import { MotionScroll } from "@/components/motion-scroll"
import { musicGenres } from "@/data/music-genres"
import { Leaf } from "lucide-react"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YouTubePlayer as PlayerInstanceType } from 'react-youtube'; // 確保引入了 PlayerInstanceType

const BACKEND_API_BASE_URL = 'http://localhost:3001';
// const BACKEND_API_BASE_URL = 'https://youtube-music-project.fly.dev';

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>("未知歌曲")
  const [currentVideoGenre, setCurrentVideoGenre] = useState<string>("未知曲風")
  const [history, setHistory] = useState<Array<{ id: string; title: string; genre: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playHistory, setPlayHistory] = useState<string[]>([]) // 用於記錄播放過的視頻ID
  const [historyIndex, setHistoryIndex] = useState(-1) // 當前在播放歷史中的位置
  const [isCompactView, setIsCompactView] = useState<boolean>(false); // 視圖模式 state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const playerRef = useRef<PlayerInstanceType | null>(null);

  const handlePlayerReady = (player: PlayerInstanceType) => {
    playerRef.current = player;
    const videoDuration = player.getDuration();
    setDuration(videoDuration || 0);
  };

  const fetchMusic = async (genre: string) => { /* ...你的 fetch 邏輯... */ };
  const handleGenreSelect = (genre: string) => { /* ...你的選擇邏輯... */ };


  const handlePlayPause = () => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    const playerState = player.getPlayerState();
    if (playerState === 1 /* PLAYING */) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    // isPlaying 狀態會由下面的 useEffect 根據 player state 更新
  };

  const handleSeek = (newProgress: number) => {
    if (!playerRef.current || duration === 0) return;
    const newTime = (newProgress / 100) * duration;
    playerRef.current.seekTo(newTime, true);
  };

  const handleToggleView = () => {
    setIsCompactView(!isCompactView);
  };

  // 監聽播放器狀態並更新 React state
  useEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;
    let intervalId: NodeJS.Timeout | null = null;

    const updateStates = () => {
      const playerState = player.getPlayerState();
      const currentTimeVal = player.getCurrentTime();
      const currentDuration = player.getDuration();

      setIsPlaying(playerState === 1 /* PLAYING */);
      setCurrentTime(currentTimeVal || 0);
      if (currentDuration > 0) {
        setDuration(currentDuration);
        setProgress(((currentTimeVal || 0) / currentDuration) * 100);
      } else {
        setDuration(0); // 如果獲取不到有效時長
        setProgress(0);
      }
    };

    // 初始獲取一次狀態
    if(currentVideoId) updateStates();

    // 監聽 stateChange 事件
    const onPlayerStateChange = (event: any) => {
      updateStates();
      if (event.data === 0 /* ENDED */) {
        // 處理播放結束邏輯，例如播放下一首
        console.log("Video Ended");
      }
    };

    player.on('stateChange', onPlayerStateChange);

    // 如果正在播放，啟動定時器更新進度 (主要用於進度條平滑)
    if (isPlaying) {
      intervalId = setInterval(updateStates, 500); // 每半秒更新一次
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      player.off('stateChange', onPlayerStateChange); // 清除事件監聽器
      if (intervalId) clearInterval(intervalId);
    };
  }, [playerRef.current, currentVideoId, isPlaying]); // 依賴變化時重新設定

  // 當選擇新曲風時，獲取隨機影片
  useEffect(() => {
    if (selectedGenre) {
      getRandomVideo(selectedGenre)
    }
  }, [selectedGenre])

  // 模擬從 YouTube 獲取隨機影片
  const getRandomVideo = async (genre: string) => {
    setIsLoading(true)

    // 在實際應用中，這裡會調用 YouTube API 獲取特定曲風的影片
    // 這裡使用模擬數據
    const genreData = musicGenres.find((g) => g.id === genre)

    if (genreData && genreData.videos.length > 0) {
      // 隨機選擇一個影片
      const randomIndex = Math.floor(Math.random() * genreData.videos.length)
      const video = genreData.videos[randomIndex]

      // 模擬網絡延遲
      setTimeout(() => {
        setCurrentVideo(video.id)
        setCurrentVideoTitle(video.title)
        setCurrentVideoGenre(genreData.name)

        // 添加到播放歷史記錄
        setPlayHistory((prev) => {
          // 如果當前不是在歷史的最後，則截斷歷史
          const newHistory = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : prev
          return [...newHistory, video.id]
        })
        setHistoryIndex((prev) => prev + 1)

        // 添加到顯示歷史記錄
        setHistory((prev) => [
          { id: video.id, title: video.title, genre: genreData.name },
          ...prev.slice(0, 9), // 只保留最近的 10 條記錄
        ])

        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }

  // 獲取新的隨機影片
  const getNextVideo = () => {
    if (selectedGenre) {
      getRandomVideo(selectedGenre)
    }
  }

  // 播放前一首歌
  const playPreviousVideo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevVideoId = playHistory[prevIndex]
      setHistoryIndex(prevIndex)
      setCurrentVideo(prevVideoId)

      // 查找視頻信息
      for (const genre of musicGenres) {
        const video = genre.videos.find((v) => v.id === prevVideoId)
        if (video) {
          setCurrentVideoTitle(video.title)
          setCurrentVideoGenre(genre.name)
          break
        }
      }
    }
  }

  // 從歷史記錄或收藏中播放影片
  const playVideo = (videoId: string) => {
    setCurrentVideo(videoId)

    // 查找視頻信息
    for (const genre of musicGenres) {
      const video = genre.videos.find((v) => v.id === videoId)
      if (video) {
        setCurrentVideoTitle(video.title)
        setCurrentVideoGenre(genre.name)
        break
      }
    }
  }

  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/50 pointer-events-none"></div>

        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> 
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">自然音樂探索</span>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">發現、收藏並享受各種音樂</p>
          </div>
        </header>

        <main className="container py-8 md:py-12">
          <MotionScroll>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-8">
              YouTube{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                隨機曲風
              </span>{" "}
              音樂播放器
            </h1>
          </MotionScroll>

          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-3">
              <MotionScroll delay={0.1}>
                <MusicPlayer
                  videoId={currentVideo}
                  isLoading={isLoading}
                  onVideoEnd={getNextVideo}
                  onPreviousVideo={playPreviousVideo}
                  currentVideoTitle={currentVideoTitle}
                  currentVideoGenre={currentVideoGenre}
                  hasPreviousVideo={historyIndex > 0}
                />
              </MotionScroll>

              <MotionScroll delay={0.2}>
                <GenreSelector
                  genres={musicGenres}
                  selectedGenre={selectedGenre}
                  onSelectGenre={setSelectedGenre}
                  onGetRandom={getNextVideo}
                  isLoading={isLoading}
                />
              </MotionScroll>
            </div>

            <div>
              <MotionScroll delay={0.3} direction="left">
                <Tabs defaultValue="history">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="history">播放歷史</TabsTrigger>
                    <TabsTrigger value="favorites">我的收藏</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-0">
                    <PlayHistory history={history} onSelect={playVideo} currentVideo={currentVideo} />
                  </TabsContent>
                  <TabsContent value="favorites" className="mt-0">
                    <FavoritesList onSelect={playVideo} currentVideo={currentVideo} />
                  </TabsContent>
                </Tabs>
              </MotionScroll>
            </div>
          </div>
        </main>

        <footer className="border-t py-6 mt-12 bg-muted/30">
          <div className="container">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-medium">自然音樂探索.</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} YouTube 播放器. 保留所有權利.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </FavoritesProvider>
  )
}
