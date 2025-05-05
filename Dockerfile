# ---- Base Stage ----
# 使用一個官方的 Node.js LTS (長期支援) 版本作為基礎映像
FROM node:18-alpine AS base
# 設定映像檔內的工作目錄
WORKDIR /app

# ---- Dependencies Stage ----
# 複製 package.json 和 package-lock.json
FROM base AS deps
COPY package.json package-lock.json ./
# 只安裝生產環境依賴，以縮小映像檔大小
RUN npm install --omit=dev

# ---- Build Stage ----
# 如果你有建置步驟 (例如 TypeScript 編譯、前端打包)，在這裡做
# 這個專案目前不需要單獨的建置步驟

# ---- Runner Stage ----
# 從基礎映像開始，創建最終的運行映像
FROM base AS runner
# 設定 Node.js 環境為 production
ENV NODE_ENV=production
# 將依賴從 deps stage 複製過來
COPY --from=deps /app/node_modules ./node_modules
# 複製後端程式碼
COPY server.js .
# 複製前端靜態檔案
COPY public ./public

# 設定應用程式預設監聽的端口 (可以被環境變數覆蓋)
# Fly.io 通常使用 8080 作為內部端口
ENV PORT=8080
EXPOSE 8080

# 映像檔啟動時運行的命令
CMD [ "node", "server.js" ]
