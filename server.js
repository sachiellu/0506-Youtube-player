require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');

const app = express();

const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';


app.get('/api/random-song', async (req, res) => {
    const genre = req.query.genre;

    if (!genre) {
        return res.status(400).json({ error: 'Genre query parameter is required' });
    }

    // 在 Fly.io 環境，檢查 YOUTUBE_API_KEY 是否已設定
    if (!YOUTUBE_API_KEY) {
         console.error("YouTube API Key is not set in environment variables/secrets.");
         return res.status(500).json({ error: 'Server configuration error (API Key missing)' });
    }

    const searchQuery = `${genre} music`;
    const searchParams = new URLSearchParams({
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        order: 'viewCount',
        maxResults: 25,
        key: YOUTUBE_API_KEY,
        videoEmbeddable: 'true'
    });

    const apiUrl = `${YOUTUBE_API_URL}?${searchParams.toString()}`;

    try {
        console.log(`Fetching from YouTube API for genre: ${genre}`); // 保留日誌以便觀察
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok || data.error) {
            console.error('YouTube API Error:', data.error || `Status: ${response.status}`);
            return res.status(500).json({ error: 'Failed to fetch data from YouTube API', details: data.error });
        }

        if (!data.items || data.items.length === 0) {
            console.log(`No results found for genre: ${genre}`);
            return res.status(404).json({ error: `No popular videos found for genre: ${genre}` });
        }

        const randomIndex = Math.floor(Math.random() * data.items.length);
        const randomVideo = data.items[randomIndex];
        const videoId = randomVideo.id.videoId;
        const videoTitle = randomVideo.snippet.title;

        console.log(`Selected video for ${genre}: ID=${videoId}, Title=${videoTitle}`);

        res.json({ videoId: videoId, title: videoTitle });

    } catch (error) {
        console.error('Error in /api/random-song:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// *** 提供 public 資料夾中的靜態前端檔案 ***
// 確保這個在 API 路由之後定義，或者在 catch-all 路由之前
app.use(express.static('public'));


// *** 處理單頁應用路由 (Catch-all for non-API GET requests) ***
// 如果用戶直接訪問 / 或任何非 /api/ 的 GET 路徑，都回傳 index.html
// 這確保了即使刷新頁面，前端也能正確載入
app.get('*', (req, res, next) => {
    // 檢查是否為 API 請求或其他已知路徑 (如果有的話)
    if (req.path.startsWith('/api/')) {
        return next(); // 交給下一個符合的路由或 404
    }
    // 否則，回傳前端主頁面
    // 使用 path.join 通常較為可靠
    const path = require('path');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => { // 監聽 0.0.0.0 很重要，確保容器能從外部訪問
    console.log(`Server listening on port ${PORT}`);
    if (!YOUTUBE_API_KEY && process.env.NODE_ENV !== 'production') {
        console.warn("Warning: YOUTUBE_API_KEY not set for local development (using .env?)");
    } else if (!YOUTUBE_API_KEY && process.env.NODE_ENV === 'production') {
         console.error("CRITICAL: YOUTUBE_API_KEY is MISSING in production environment!");
    }
});