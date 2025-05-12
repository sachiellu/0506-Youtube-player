"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 用於頁面跳轉

// *** 你的「註冊登入」專案的後端 API 基礎 URL ***
const AUTH_API_BASE_URL = 'https://your-auth-app-backend.fly.dev'; // 替換成你真實的地址

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/api/auth/login`, { // 假設登入 API 端點是這個
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登入失敗，請檢查您的帳號或密碼。');
      }

      // 登入成功
      console.log('Login successful:', data);
      // TODO: 儲存 token (例如 data.token) 到 localStorage 或 Context
      // TODO: 更新全域的登入狀態
      // TODO: 導向到主頁或用戶儀表板
      router.push('/'); // 示例：導向回主頁

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">登入到音樂播放器</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* ... 表單輸入框 (同之前範例) ... */}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button type="submit" className="...">登入</button>
          <Link href="/register" className="...">還沒有帳號？註冊</Link>
        </div>
      </form>
    </div>
  );
}