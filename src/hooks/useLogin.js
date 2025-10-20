import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import { authStore } from "@/stores/authStore";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const setLogin = authStore((state) => state.setLogin);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/api/v1/login", credentials, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    },

    onSuccess: (data) => {
      console.log("로그인 성공:", data);

      const content = data.content ?? {};
      const userInfo = {
        token: content.token,
        userId: content.userId,
        userName: content.userName,
        userRole: content.userRole,
        point: content.point ?? 0,
      };

      setLogin(userInfo);
      localStorage.setItem("auth-info", JSON.stringify({ state: userInfo, version: 0 }));

      navigate("/books");
    },

    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
};
