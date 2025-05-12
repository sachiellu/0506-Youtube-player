// components/YouTubePlayer.tsx
import React from 'react';
import YouTube, { YouTubeProps, YouTubePlayer as TYPlayer } from 'react-youtube'; // 注意這裡的 YouTubePlayer as TYPlayer

interface YouTubePlayerComponentProps {
  videoId: string | null;
  onPlayerReady?: (player: TYPlayer) => void; // 回調函數，用於傳遞播放器實例
  // 你可以根據需要添加其他 props，例如 onStateChange, onError 等
}

const YouTubePlayer: React.FC<YouTubePlayerComponentProps> = ({ videoId, onPlayerReady }) => {
  if (!videoId) {
    return (
      <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 animate-pulse">
        <p>請先選擇一個曲風</p>
      </div>
    );
  }

  const opts: YouTubeProps['opts'] = {
    height: '100%', // 會被父容器的 aspect-video 控制
    width: '100%',  // 會被父容器的 aspect-video 控制
    playerVars: {
      autoplay: 1, // 影片載入後自動播放
      playsinline: 1, // 在 iOS 上內聯播放
      controls: 0, // 顯示 YouTube 播放器控制項 (0 為隱藏)
      modestbranding: 1, // 減少 YouTube logo
      rel: 0, // 播放結束後不顯示相關影片
    },
  };

  const handleReady: YouTubeProps['onReady'] = (event) => {
    // event.target is the YouTube player instance
    console.log("YouTube Player is ready!");
    if (onPlayerReady) {
      onPlayerReady(event.target); // 將 player 實例傳遞給父元件
    }
  };

  const handleError: YouTubeProps['onError'] = (event) => {
    console.error("YouTube Player Error:", event.data);
    // 你可以在這裡處理播放錯誤，例如顯示錯誤訊息
  };

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onError={handleError}
        className="w-full h-full" // 確保 YouTube 元件填滿容器
      />
    </div>
  );
};

export default YouTubePlayer;