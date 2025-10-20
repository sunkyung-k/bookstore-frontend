import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const authStore = create(
  persist(
    immer((set, get) => ({
      token: null,
      userId: null,
      userName: null,
      userRole: null,
      point: 0,
      hydrated: false,

      // persist 복원 완료 시 호출
      setHydrated: (value) => set({ hydrated: value }),

      // 로그인 여부
      isAuthenticated: () => !!get().token,

      // 권한 가져오기
      getUserRole: () => get().userRole,

      // 로그인 시 저장
      setLogin: ({ token, userId, userName, userRole, point }) =>
        set((state) => {
          state.token = token ?? state.token;
          state.userId = userId ?? state.userId;
          state.userName = userName ?? state.userName;
          state.userRole = userRole ?? state.userRole;
          state.point = point ?? state.point;
        }),

      // 포인트만 갱신 (즉시 리렌더 트리거)
      setPoint: (newPoint) =>
        set((state) => {
          state.point = newPoint;
        }),

      // 토큰만 갱신
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),

      // 토큰 가져오기
      getToken: () => get().token,

      // 로그아웃
      clearAuth: () =>
        set((state) => {
          state.token = null;
          state.userId = null;
          state.userName = null;
          state.userRole = null;
          state.point = 0;
        }),
    })),
    {
      name: "auth-info",

      // localStorage에 저장할 항목
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        userName: state.userName,
        userRole: state.userRole,
        point: state.point,
      }),

      // 복원 후 호출됨
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },

      skipHydration: false,
    }
  )
);
