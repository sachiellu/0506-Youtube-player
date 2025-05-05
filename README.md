# Youtube Music Player

這是一個簡單的全端網頁應用程式，允許使用者選擇一些音樂類型，然後從Youtube隨機撥放一首選擇曲風的熱門歌曲

## 功能特色

*    提供不同音樂類型供選擇
*    典籍按鈕後，透過後端API向Youtube Data API搜尋該類型的熱門影片
*    從搜尋結果中隨機選擇一手可嵌入的影片
*    使用Youtube IFrame P API在前端撥放選種的影片
*    顯示目前撥放歌曲的標題
*    極簡化

## 技術棧
*前端* 
*    HTML5
*    CSS2
*    JavaScript (ES6+)
*    Fetch API (呼叫後端)
*    YouTube IFrame Player API(播放影片)
*後端*    
*    Node.js
*    Express.js (Web框架)
*    `node-fetch` (向 Youtube API發送請求)
*    `dotenv` (管理環境變數)
*    `cors` (處理跨來源資源共用)
*API*
*    Youtube Data API v3 (搜尋影片)
*部屬*
*    前端: **GitHub Pages
*    後端: **Render

## 線上 Demo

*   **前端部署連結：** [https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/](https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/)
    *(請將 `YOUR_USERNAME` 和 `YOUR_REPOSITORY_NAME` 換成你的 GitHub 使用者名稱和倉庫名稱)*

## 本地開發設定

### 事前準備

1.  安裝 [Node.js](https://nodejs.org/) (包含 npm)
2.  安裝 [Git](https://git-scm.com/)
3.  取得 [YouTube Data API v3 金鑰](https://console.cloud.google.com/) (請參考 Google Cloud 文件)
4.  註冊 [GitHub](https://github.com/) 帳號
5.  註冊 [Render](https://render.com/) 帳號 (可選，用於部署)

### 安裝步驟

1.  **Clone 倉庫：**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```
    *(請將 `YOUR_USERNAME` 和 `YOUR_REPOSITORY_NAME` 換成你的)*

2.  **安裝後端依賴：**
    ```bash
    npm install
    ```

3.  **設定環境變數：**
    *   在專案根目錄建立一個 `.env` 檔案。
    *   在 `.env` 檔案中加入以下內容，並將 `你的YOUTUBE_API_金鑰` 換成你自己的金鑰：
        ```dotenv
        YOUTUBE_API_KEY=你的YOUTUBE_API_金鑰
        PORT=3000
        ```
    *   **重要：** `.env` 檔案已被加入 `.gitignore`，請勿將其提交到 Git 倉庫。

4.  **執行後端伺服器：**
    ```bash
    node server.js
    ```
    伺服器預設會在 `http://localhost:3000` 啟動。

5.  **訪問前端頁面：**
    打開你的網頁瀏覽器，訪問 `http://localhost:3000`。

## 部署

### 後端 (Render)

1.  將專案推送到 GitHub 倉庫。
2.  在 Render 建立一個新的 "Web Service"。
3.  連接到你的 GitHub 倉庫。
4.  設定：
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
5.  在 Render 的 "Environment" 設定中，添加環境變數：
    *   `YOUTUBE_API_KEY`: 你的 YouTube API 金鑰
    *   `NODE_ENV`: `production` (建議)
    *   (選擇性) `PORT`: `10000`
    *   (若要限制 CORS) `FRONTEND_URL`: 你的 GitHub Pages URL (例如 `https://YOUR_USERNAME.github.io`)
6.  部署完成後，Render 會提供一個後端服務 URL (例如 `https://your-service-name.onrender.com`)。

### 前端 (GitHub Pages)

1.  **更新後端 API URL：**
    *   修改根目錄下的 `script.js` 檔案。
    *   將 `BACKEND_API_BASE_URL` 的值更新為你在 Render 上部署的後端服務 URL。
    ```javascript
    const BACKEND_API_BASE_URL = 'https://your-service-name.onrender.com'; // <-- 換成你的 Render URL
    ```
    *   提交並推送這個更改到 GitHub。

2.  **設定 GitHub Pages：**
    *   確保你的 `index.html`, `style.css`, `script.js` 檔案位於**專案的根目錄**。
    *   在你的 GitHub 倉庫頁面，進入 "Settings" -> "Pages"。
    *   在 "Build and deployment" 下，選擇從 `main` 分支的 `/ (root)` 資料夾部署。
    *   保存設定，等待部署完成。GitHub Pages 會提供你的公開網站 URL。

## 注意事項

*   **API 金鑰安全：** 絕對不要將你的 `YOUTUBE_API_KEY` 或 `.env` 檔案提交到公開的 Git 倉庫。在 Render 等部署平台上使用環境變數來設定金鑰。
*   **YouTube API 配額：** YouTube Data API 有免費的使用配額限制。如果請求過於頻繁，可能會暫時無法使用。對於高流量應用，可能需要考慮優化 API 呼叫或申請更高配額。
*   **CORS：** 在部署後，建議將後端的 CORS 設定 (`server.js` 中的 `corsOptions.origin`) 限制為你的 GitHub Pages 前端 URL，以增加安全性。

## (可選) 未來可能的改進

*   添加更多音樂類型。
*   記住使用者上次選擇的類型。
*   添加播放清單功能。
*   錯誤處理更友好的提示。
*   對搜尋結果進行快取以減少 API 呼叫。
*   加入 loading 動畫效果。
