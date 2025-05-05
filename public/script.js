// --- Configuration ---
const BACKEND_API_BASE_URL = 'http://localhost:3000'; // <-- 本地開發用

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
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) {
                // Ignore if response body is not JSON or empty
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (data.videoId && data.title) {
            console.log(`Received videoId: ${data.videoId}, title: ${data.title}`);
            statusMessage.textContent = `Loading: ${data.title}`;
            currentSongDisplay.textContent = `Now Playing: ${data.title}`;
            player.loadVideoById(data.videoId);
            // Playback usually starts automatically after loadVideoById if ready
        } else {
             console.error("Invalid data received from backend:", data);
             throw new Error("Backend did not return valid video data.");
        }

    } catch (error) {
        console.error('Failed to fetch or play song:', error);
        statusMessage.textContent = `Error finding song: ${error.message}. Please try again.`;
        currentSongDisplay.textContent = "";
    } finally {
        enableButtons(true);
        // Optionally hide loading message after a delay
        setTimeout(() => {
           if (statusMessage.textContent.startsWith("Loading:")) {
               statusMessage.textContent = ""; // Clear status or set to something else
           }
       }, 5000); // Hide after 5 seconds for example
    }
}

// --- Event Listeners ---
genreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const genre = button.dataset.genre;
        fetchAndPlayRandomSong(genre);
    });
});

// --- Initial State ---
statusMessage.textContent = "Initializing player...";
currentSongDisplay.textContent = "";
enableButtons(false);