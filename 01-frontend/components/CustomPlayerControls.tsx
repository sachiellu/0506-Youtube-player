// components/CustomPlayerControls.tsx
"use client"; // 如果未來會有互動，先加上
import React from 'react';
import { Maximize2 } from 'lucide-react'; // 引入一個圖示用於「展開」按鈕

interface CustomPlayerControlsProps {
  title: string;
  onToggleView: () => void; // 用於切換回完整視圖的函數
  // 我們之後會添加更多 props: isPlaying, onPlayPause, progress, currentTime, duration, onSeek
}

export default function CustomPlayerControls({ title, onToggleView }: CustomPlayerControlsProps) {
  return (
    <div className="bg-slate-800 text-slate-200 p-3 rounded-lg shadow-md flex items-center justify-between w-full max-w-md mx-auto">
      <p className="text-sm font-semibold truncate flex-grow" title={title}>
        {title || "未選擇歌曲"}
      </p>
      <button
        onClick={onToggleView}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors"
        aria-label="展開播放器"
      >
        <Maximize2 size={18} />
      </button>
    </div>
  );
}