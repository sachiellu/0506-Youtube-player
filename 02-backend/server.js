require('dotenv').config(); // 取消註解

const express = require('express');
const fetch = require('node-fetch'); // 取消註解
const cors = require('cors'); // 取消註解

const app = express();

const PORT = process.env.PORT || 8080; // 使用 8080
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // 取消註解
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'; // 取消註解

app.use(cors()); // 取消註解

// --- API 路由 (取消註解！) ---
app.get('/api/random-song', async (req, res) => {
    const genre = req.query.genre;

    if (!genre) {
        return res.status(400).json({ error: 'Genre query parameter is required' });
    }

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
        console.log(`Fetching from YouTube API for genre: ${genre}`);
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

        if (!randomVideo || !randomVideo.id || !randomVideo.id.videoId || !randomVideo.snippet) {
            console.error('Unexpected YouTube API response item structure:', randomVideo);
            return res.status(500).json({ error: 'Unexpected data structure from YouTube API' });
        }

        const videoId = randomVideo.id.videoId;
        const videoTitle = randomVideo.snippet.title;

        console.log(`Selected video for ${genre}: ID=${videoId}, Title=${videoTitle}`);

        res.json({ videoId: videoId, title: videoTitle });

    } catch (error) {
        console.error('Error in /api/random-song:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
});

// --- 靜態檔案服務 (保持註解掉！) ---
// app.use(express.static('public'));

// --- Catch-all 路由 (保持註解掉！) ---
/*
app.get('*', (req, res, next) => {
    // ...
});
*/

// --- 啟動伺服器 ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
    // 可以保留 API Key 檢查的日誌
    if (!YOUTUBE_API_KEY && process.env.NODE_ENV !== 'production') {
        console.warn("Warning: YOUTUBE_API_KEY not set for local development (using .env?)");
    } else if (!YOUTUBE_API_KEY && process.env.NODE_ENV === 'production') {
         console.error("CRITICAL: YOUTUBE_API_KEY is MISSING in production environment!");
    }
});

// --- 健康檢查路由 (可以保留) ---
app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

// --- 根路徑測試 (可以保留) ---
app.get('/', (req, res) => {
  res.send('Server with API is running!'); // 修改一下訊息
});