import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/login/Login";
import Mypage from "../pages/mypage/Mypage";
import BooksList from "../pages/book/BooksList";
import BooksDetail from "../pages/book/BooksDetail";
import Cart from "../pages/cart/Cart";
import Order from "../pages/order/Order";
import OrderComplete from "../pages/order/OrderComplete";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: BooksList },
      {
        path: "books",
        children: [
          { index: true, Component: BooksList },
          { path: ":bookId", Component: BooksDetail },
        ],
      },

      {
        path: "mypage",
        Component: () => (
          <ProtectedRoute>
            <Mypage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        Component: () => (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "order",
        children: [
          {
            index: true,
            Component: () => (
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            ),
          },
          {
            path: "complete",
            Component: () => (
              <ProtectedRoute>
                <OrderComplete />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  { path: "/login", Component: Login },
]);
