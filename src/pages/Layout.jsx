import React from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import { authStore } from "../stores/authStore";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSyncPoint } from "../hooks/useSyncPoint";

function Layout() {
  useSyncPoint();

  const isAuthenticated = authStore((state) => state.isAuthenticated());
  const location = useLocation();

  // 로그인 안 했고, 지금 페이지가 /login이 아니라면 로그인으로 튕김
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <main className="layout-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
