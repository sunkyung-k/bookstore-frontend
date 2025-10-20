import axios from "axios";
import { authStore } from "@/stores/authStore";

console.log("🪙 토큰 확인", authStore.getState().token);

const api = axios.create({
  baseURL: "http://localhost:9090/",
  headers: {
    "Content-Type": "application/json", // 추가됨 (중요)
  },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  let token = null;

  // store 우선
  const storeState = authStore.getState();
  if (storeState?.token) {
    token = storeState.token;
  }

  // store에 없으면 localStorage 백업 확인
  if (!token) {
    const saved = localStorage.getItem("auth-info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        token = parsed?.state?.token;
      } catch (err) {
        console.warn("localStorage 파싱 실패:", err);
      }
    }
  }

  // Authorization 헤더 주입
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization 포함됨:", token.slice(0, 20) + "...");
  } else {
    console.warn("토큰 없음 — Authorization 헤더 미포함");
  }

  return config;
});

export default api;
