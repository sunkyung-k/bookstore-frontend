import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaBookOpen, FaCartShopping } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { authStore } from "@/stores/authStore";
import api from "@/api/axiosApi";

function Gnb() {
  const isAuthenticated = authStore((state) => state.isAuthenticated());
  const userName = authStore((state) => state.userName);
  const userId = authStore((state) => state.userId);
  const clearAuth = authStore((state) => state.clearAuth);
  const navigate = useNavigate();

  // 장바구니 개수
  const { data: cartCount = 0, isLoading } = useQuery({
    queryKey: ["cartCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      const res = await api.get(`/api/v1/cart/${userId}`);
      console.log("🛒 장바구니 응답:", res.data);
      return res.data?.data?.count ?? 0;
    },
    enabled: !!userId && isAuthenticated,
  });

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("auth-info");
    navigate("/login");
  };

  return (
    <nav className="gnb">
      <h1 className="logo">
        <NavLink to="/books">
          <FaBookOpen />
          온라인서점
        </NavLink>
      </h1>

      <div className="utill">
        <div className="menu">
          <NavLink to="/cart">
            <FaCartShopping size="20" />
            {isAuthenticated && (
              <span className="cnt">{isLoading ? "…" : cartCount}</span>
            )}
          </NavLink>
          <NavLink to="/mypage">
            <IoPersonCircleOutline size="28" />
          </NavLink>
        </div>

        <div className="userMenuBox">
          <div className="userMenu">
            <span>{userId}님, 환영합니다.</span>
            <button
              type="button"
              className="btn btn-sm btn-secondary-line"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Gnb;
