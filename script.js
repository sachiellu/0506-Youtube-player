// --- Configuration ---
// *** 非常重要：確保這是正確的 Fly.io URL ***
const BACKEND_API_BASE_URL = 'https://youtube-music-project.fly.dev'; 

// --- Global Variables ---
let player;
const genreButtons = document.querySelectorAll('.genre-button');
const statusMessage = document.getElementById('status-message');
const currentSongDisplay = document.getElementById('current-song');

// --- YouTube IFrame Player API Setup ---
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Ready");
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        playerVars: { 'playsinline': 1 },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });
}

// --- Player Event Handlers ---
function onPlayerReady(event) {
    console.log("Player Ready");
    statusMessage.textContent = "Player ready. Select a genre!";
    enableButtons(true);
}

function onPlayerError(event) {
    console.error("Player Error:", event.data);
    statusMessage.textContent = `Player Error (${event.data}). Try another genre or check console.`;
    currentSongDisplay.textContent = "";
    enableButtons(true);
}

// --- Application Logic ---
function enableButtons(enable) {
    genreButtons.forEach(button => button.disabled = !enable);
}

async function fetchAndPlayRandomSong(genre) {
    if (!player || typeof player.loadVideoById !== 'function') {
        statusMessage.textContent = "Player is not initialized yet. Please wait.";
        return;
    }

    console.log(`Fetching random song for genre: ${genre}`);
    statusMessage.textContent = `Finding a popular ${genre} song...`;
    currentSongDisplay.textContent = "";
    enableButtons(false);

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/random-song?genre=${encodeURIComponent(genre)}`);

        if (!response.ok) {
            let errorMsg = `Error: ${response.status} ${response.statusText}`;
            try {
                // 嘗試讀取後端返回的更詳細的錯誤訊息 (如果是 JSON 格式)
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg; // 使用後端提供的錯誤訊息
            } catch (e) {
                // 如果回應不是 JSON 或為空，則忽略解析錯誤，使用原始錯誤
            }
            throw new Error(errorMsg); // 拋出包含狀態碼或後端訊息的錯誤
        }

        const data = await response.json();

        // 增加對後端回傳數據的檢查
        if (data.videoId && data.title) {
            console.log(`Received videoId: ${data.videoId}, title: ${data.title}`);
            statusMessage.textContent = `Loading: ${data.title}`;
            currentSongDisplay.textContent = `Now Playing: ${data.title}`;
            player.loadVideoById(data.videoId);
            // 播放器準備好後通常會自動播放
        } else {
             console.error("Invalid data received from backend:", data);
             // 提供更具體的錯誤訊息給用戶
             throw new Error("Backend returned incomplete video data.");
        }

    } catch (error) {
        console.error('Failed to fetch or play song:', error);
        // 向用戶顯示更友好的錯誤訊息
        statusMessage.textContent = `Error: ${error.message}. Please try again.`;
        currentSongDisplay.textContent = ""; // 清除歌曲標題
    } finally {
        enableButtons(true); // 無論成功或失敗，重新啟用按鈕
    }
}

// --- Event Listeners ---
genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const genre = button.dataset.genre; // 從 data-genre 屬性獲取曲風
        fetchAndPlayRandomSong(genre);
    });
});

// --- Initial State ---
statusMessage.textContent = "Initializing player...";
enableButtons(false); // 初始禁用按鈕，等待 Player Ready