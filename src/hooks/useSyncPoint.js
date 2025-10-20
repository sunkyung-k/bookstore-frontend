import { useEffect } from "react";
import { useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { authStore } from "@/stores/authStore";
import api from "@/api/axiosApi";

export function useSyncPoint() {
  const { userId, point, setPoint } = authStore((s) => s);
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;

    const fetchPoint = async () => {
      try {
        const res = await api.get(`/api/v1/users/${userId}`);
        const latest = res.data?.data?.point;
        if (latest !== undefined && latest !== point) {
          setPoint(latest);
          queryClient.invalidateQueries(["cartList", userId]);
          queryClient.invalidateQueries(["myOrders", userId]);
        }
      } catch (err) {
        console.error("❌ 포인트 동기화 실패:", err);
      }
    };

    fetchPoint();
  }, [userId, location.pathname]);
}
