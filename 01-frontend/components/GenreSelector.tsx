// components/GenreSelector.tsx
import React from 'react';

interface GenreSelectorProps {
  genres: string[]; // 曲風列表
  onGenreSelect: (genre: string) => void; // 點擊曲風時的回調函數
  currentGenre: string | null; // 當前選中的曲風 (用於高亮或其他樣式)
  isLoading?: boolean; // 是否正在載入 (用於禁用按鈕)
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
  genres,
  onGenreSelect,
  currentGenre,
  isLoading,
}) => {
  if (!genres || genres.length === 0) {
    return <p className="text-center text-slate-500">沒有可選的曲風。</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreSelect(genre)}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              currentGenre === genre
                ? 'bg-green-500 text-white border-green-500 ring-green-300' // 選中狀態
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 ring-slate-400' // 未選中狀態
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          `}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreSelector;