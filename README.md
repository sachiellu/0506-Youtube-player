# Youtube Music Player

根據選擇的曲風，隨機從 YouTube 搜尋並播送熱門音樂的 Web 應用程式。

## V2 版本 -重新使用 Next.js 構建(最新版)

** 線上演示 (Live Demo):** [https://youtube-player-4xeitcoiw-sachiellus-projects.vercel.app/](https://youtube-player-4xeitcoiw-sachiellus-projects.vercel.app/)

此版本是原V1版本更新，前端使用 Next.js 跟 React 進行重構，提升開發體驗、元件化程度與保留未來可擴展性。


### V2 版本技術棧

*   **前端 (Frontend):**
    *   框架 (Framework): Next.js (App Router)
    *   語言 (Language): TypeScript
    *   UI 函式庫 (UI Library): React
    *   樣式 (Styling): Tailwind CSS 
    *   UI 元件 (UI Components): Radix UI, shadcn/ui
    *   動畫 (Animation): Framer Motion
    *   圖示 (Icons): Lucide React
    *   部署 (Deployment): Vercel
*   **後端 (Backend):**
    *   環境 (Environment): Node.js
    *   框架 (Framework): Express.js
    *   API 呼叫 (API Calls): node-fetch (用於 YouTube Data API)
    *   部署 (Deployment): Fly.io
*   **外部服務 (External Services):**
    *   YouTube Data API v3

### V2 版本功能特色

*   使用前端框架 Next.js 和 React 構建，提供更流暢的使用者體驗。
*   響應式設計，適應不同螢幕尺寸。
*   可選擇不同音樂曲風。
*   隨機播放來自 YouTube 的熱門音樂。
*   播放歷史記錄。
*   收藏喜愛歌曲列表。
*   更美觀的使用者介面。

### V2 版本本地運行指南

1.  **克隆倉庫：**
    ```bash
    git clone https://github.com/sachiellu/0506-Youtube-player.git
    cd 0506-Youtube-player
        ```
2.  **切換到 V2 開發分支：**
    ```bash
    git checkout nextjs-rewrite
        ```
3.  **安裝依賴：** (假設使用 pnpm)
    ```bash
    pnpm install
    ```
4.  **設定環境變數 (後端)：**
    *   在專案根目錄建立 `.env` 文件。
    *   在 `.env` 文件中加入 `YOUTUBE_API_KEY=你的YouTube_API金鑰` (此金鑰用於本地後端開發測試，請勿提交到 Git)。
5.  **啟動服務：**
    *   啟動前端開發伺服器 (Next.js):
        ```bash
        pnpm run dev
        ```
        (通常在 `http://localhost:3000` 運行)
    *   啟動後端 API 伺服器 (Node.js/Express):
        ```bash
        npm start 
        # 或者 node server.js (如果 package.json 中 start 指令是這個)
        ```
        (通常在 `http://localhost:3001` 或其他與前端不同的端口運行，確保前端 `BACKEND_API_BASE_URL` 指向此本地後端端口)

---

## V1 版本 (舊版)

此專案的初始版本 (V1) 是使用純 HTML、CSS、Vanilla JavaScript 以及一個獨立的 Node.js/Express 後端服務實現的。這個版本是個人學習 Web 開發、前後端交互以及 API 使用的早期探索。

### 主要技術棧 (V1)

*   **前端 (Frontend):**
    *   HTML5
    *   CSS3
    *   Vanilla JavaScript (原生 JS)
    *   部署 (Deployment): GitHub Pages (已停用)
*   **後端 (Backend):**
    *   環境 (Environment): Node.js
    *   框架 (Framework): Express.js
    *   API 呼叫 (API Calls): node-fetch (用於 YouTube Data API)
    *   部署 (Deployment): Fly.io
*   **外部服務 (External Services):**
    *   YouTube Data API v3

### V1 版本學習記錄

*   基礎前端網頁結構與樣式設計。
*   使用原生 JavaScript 進行 DOM 操作和事件處理。
*   通過 `fetch` API 進行非同步數據請求。
*   建立簡單的 Node.js/Express 後端 API 服務。
*   環境變數的使用和 API 金鑰的基礎保護。
*   前端部署到 GitHub Pages 和後端部署到 Fly.io 的流程。

雖然 V1 版本的功能已由 V2 版本取代，但相關的程式碼和提交歷史仍然保留在 GitHub 倉庫的 `main` 分支的早期歷史記錄中，作為個人技術成長的見證。V1 版本的 GitHub Pages 部署現已停用，請訪問上面的 V2 版本連結體驗最新功能。

---

## (可選) 未來可能的改進

*   加入使用者註冊/登入功能 (可以利用 Fly.io 的 Persistent Volumes 配合 SQLite 或連接外部資料庫)。
*   記住使用者上次選擇的類型。
*   添加播放清單功能。
*   更友好的錯誤處理和 UI 提示。
*   對搜尋結果進行快取以減少 API 呼叫。
