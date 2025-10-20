import { Navigate } from "react-router";
import { authStore } from "@/stores/authStore";

// 로그인 사용자 전용 보호 라우트
export default function ProtectedRoute({ children }) {
  const { token, hydrated } = authStore();

  // Zustand persist 복원 중일 때는 일단 렌더링 중단
  if (!hydrated) return null;

  // 로그인 안 되어 있으면 로그인 페이지로 이동
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
