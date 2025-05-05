require('dotenv').config()
;
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));

app.get('/api/random-song', async (req, res) => {
    const genre = req.query.genre;

    if (!genre) {
        return res.status(400).json({ error: 'Genre query parameter is required' });
    }

    if (!YOUTUBE_API_KEY) {
         console.error("YouTube API Key is not configured in .env");
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
        console.log(`Fetching from YouTube API: ${apiUrl.replace(YOUTUBE_API_KEY, 'REDACTED')}`);
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

app.use(express.static('public'));


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    if (!YOUTUBE_API_KEY) {
        console.warn("Warning: YOUTUBE_API_KEY is not set in the environment variables!");
    }
});