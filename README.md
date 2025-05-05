# Youtube Music Player

這是一個簡單的全端網頁應用程式，允許使用者選擇一些音樂類型，然後從Youtube隨機撥放一首選擇曲風的熱門歌曲
播放程式透過Docker容器化並部屬在Fly.io上

## 功能特色

*    提供不同音樂類型供選擇
*    點擊按鈕後，透過後端API向Youtube Data API搜尋該類型的熱門影片
*    從搜尋結果中隨機選擇一首可嵌入的影片
*    使用Youtube IFrame Player API在前端撥放選種的影片
*    顯示目前撥放歌曲的標題
*    極簡化

## 技術棧
*前端* 
*    HTML5
*    CSS3
*    JavaScript (ES6+)
*    Fetch API (呼叫後端)
*    YouTube IFrame Player API(播放影片)
*後端*    
*    Node.js
*    Express.js (Web框架)
*    `node-fetch` (向 Youtube API發送請求)
*    `dotenv` (管理環境變數)
*API*
*    Youtube Data API v3 (搜尋影片)
*容器化與部屬*
*    Docker: 用來打包應用程式
*    Fly.io: 用來託管容器化應用程式 

## 線上 Demo

*   **前端部署連結：** [https://youtube-music-player-mick.fly.dev](https://youtube-music-player-mick.fly.dev)


## 本地開發設定

### 事前準備

1.  安裝 [Node.js](https://nodejs.org/) (包含 npm)
2.  安裝 [Git](https://git-scm.com/)
3.  取得 [YouTube Data API v3 金鑰](https://console.cloud.google.com/) (請參考 Google Cloud 文件)
4.  註冊 [GitHub](https://github.com/) 帳號

### 安裝步驟

1.  **Clone 倉庫：**
    ```bash
    git clone https://github.com/sachiellu/0506-Youtube-player
    cd 0506-Youtube-player
    ```

2.  **安裝 Node.js 依賴：**
    ```bash
    npm install
    ```

3.  **設定本地環境變數：**
    *   在專案根目錄**建立**一個 `.env` 檔案 (此檔案不會提交到 Git)。
    *   在 `.env` 檔案中加入以下內容，並將 `你的YOUTUBE_API_金鑰` 換成你自己的金鑰：
        ```dotenv
        YOUTUBE_API_KEY=你的YOUTUBE_API_金鑰
        PORT=3000 # 本地開發端口
        NODE_ENV=development
        ```
    *   **注意：** 部署到 Fly.io 時，`YOUTUBE_API_KEY` 需要透過 `flyctl secrets set` 設定。

4.  **執行本地開發伺服器：**
    ```bash
    # 確保 dotenv 在 server.js 開頭被加載以讀取 .env
    node server.js
    ```
    伺服器預設會在 `http://localhost:3000` 啟動。前端和後端 API 都在此地址提供。


5.  **訪問前端頁面：**
    打開你的網頁瀏覽器，訪問 `http://localhost:3000`。

## 部署到 Fly.io

### 事前準備

*   確保你已經安裝並登入了 `flyctl`。
*   確保 Docker 正在運行。
*   確保你的專案包含 `Dockerfile` 和 `fly.toml` 設定檔 (如果還沒有，可以運行 `flyctl launch` 來生成，但**不要**選擇自動部署或建立資料庫)。

### 部署步驟

1.  **設定 API 金鑰 Secret：**
    將你的 YouTube API 金鑰安全地設定為 Fly.io 的 Secret：
    ```bash
    flyctl secrets set YOUTUBE_API_KEY="你的真實YOUTUBE_API金鑰"
    ```

2.  **(可選但推薦) 將本地更改推送到 Git 倉庫：**
    ```bash
    git add .
    git commit -m "Prepare for Fly.io deployment"
    git push origin main
    ```

3.  **執行部署命令：**
    ```bash
    flyctl deploy
    ```
    Fly.io 會根據 `Dockerfile` 建置映像檔並部署你的應用程式。

4.  **查看部署狀態和網址：**
    部署完成後，`flyctl` 會顯示你的應用程式網址。你也可以使用以下命令：
    ```bash
    flyctl status  # 查看應用狀態
    flyctl open    # 在瀏覽器打開應用網址
    flyctl logs    # 查看應用程式日誌
    ```

## 注意事項

*   **API 金鑰安全：** 絕對不要將你的 `YOUTUBE_API_KEY` 或 `.env` 檔案提交到公開的 Git 倉庫。在 Fly.io 上務必使用 `flyctl secrets set` 來管理金鑰。
*   **YouTube API 配額：** YouTube Data API 有免費的使用配額限制。頻繁請求可能導致暫時無法使用。
*   **`.dockerignore`：** 為了優化 Docker 建置速度和安全性，建議在專案根目錄添加一個 `.dockerignore` 檔案，至少包含以下內容，以避免將不必要的檔案複製到 Docker 映像中：
    ```
    node_modules
    npm-debug.log
    .env
    .git
    .gitignore
    .dockerignore
    README.md
    ```
*   **監聽端口：** 確保 `server.js` 中的 `app.listen` 監聽 `process.env.PORT` 或預設值 (例如 8080)，並且監聽的主機是 `'0.0.0.0'` (`app.listen(PORT, '0.0.0.0', ...)`) 以便容器能被外部訪問。`Dockerfile` 中也應 `EXPOSE` 相應的端口。




## (可選) 未來可能的改進

*   添加更多音樂類型。
*   加入使用者註冊/登入功能 (可以利用 Fly.io 的 Persistent Volumes 配合 SQLite 或連接外部資料庫)。
*   記住使用者上次選擇的類型。
*   添加播放清單功能。
*   更友好的錯誤處理和 UI 提示。
*   對搜尋結果進行快取以減少 API 呼叫。
*   加入 loading 動畫效果。
*   設置 CI/CD 自動部署 (例如使用 GitHub Actions `flyctl deploy`)。
