import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "@/stores/authStore";
import api from "@/api/axiosApi";
import OrderItem from "./OrderItem";
import StepProgress from "../../components/ui/StepProgress";

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { userId, point, setLogin } = authStore.getState();

  const state = location.state || {};
  const isSingle = !!state.bookId;
  const quantity = state.quantity || 1;
  const bookDataFromState = state.bookData || null;

  const stableBookId = useMemo(
    () => (state.bookId ? Number(state.bookId) : null),
    [state.bookId]
  );

  const { data: bookData, isLoading } = useQuery({
    queryKey: ["BooksDetail", stableBookId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/books/${stableBookId}`);
      return res.data.data;
    },
    enabled: Boolean(isSingle && stableBookId && !bookDataFromState),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const finalBook = bookDataFromState || bookData;

  // 안전하게 orderItems 구성
  const orderItems = useMemo(() => {
    if (isSingle && finalBook) {
      return [
        {
          book: finalBook,
          bookId: finalBook.bookId,
          title: finalBook.title,
          quantity,
          totalPrice: finalBook.price * quantity,
        },
      ];
    }

    if (!isSingle && Array.isArray(state.selectedBooks)) {
      return state.selectedBooks
        .filter((item) => item && item.book)
        .map((item) => ({
          book: item.book,
          bookId: item.book.bookId,
          title: item.book.title,
          quantity: item.quantity,
          totalPrice: item.book.price * item.quantity,
        }));
    }

    return [];
  }, [isSingle, finalBook, quantity, state.selectedBooks]);

  const total = useMemo(
    () => orderItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
    [orderItems]
  );

  const hasNavigated = useRef(false);
  useEffect(() => {
    if (
      !isLoading &&
      !hasNavigated.current &&
      orderItems.length === 0 &&
      !finalBook &&
      !state.selectedBooks?.length
    ) {
      hasNavigated.current = true;
      alert("잘못된 접근입니다. 장바구니나 상품 상세에서 주문해주세요.");
      navigate("/cart", { replace: true });
    }
  }, [isLoading, orderItems.length, finalBook, navigate, state.selectedBooks]);

  // 결제 처리
  const orderMutation = useMutation({
    mutationFn: async () => {
      if (point < total) {
        alert("포인트가 부족합니다. 마이페이지에서 충전해주세요.");
        navigate("/mypage");
        throw new Error("포인트 부족");
      }

      const orderData = {
        userId,
        totalPrice: total,
        items: orderItems.map((b) => ({
          bookId: b.bookId ?? b.book?.bookId ?? null,
          quantity: b.quantity,
          price: b.book?.price ?? 0,
          bookTitleSnapshot: b.title,
        })),
      };

      console.log("[orderData 전송]", JSON.stringify(orderData, null, 2));

      const orderRes = await api.post("/api/v1/order", orderData);
      const newPoint =
        orderRes.data?.remainingPoint ??
        orderRes.data?.content?.point ??
        orderRes.data?.data?.point ??
        point;

      return {
        usedPoint: total,
        remainPoint: newPoint,
        orderId:
          orderRes.data?.orderId ??
          orderRes.data?.data?.orderId ??
          orderRes.data?.content?.orderId,
        order: orderRes.data?.content || orderRes.data?.data,
      };
    },
    onSuccess: (data) => {
      setLogin((prev) => ({ ...prev, point: data.remainPoint }));

      queryClient.invalidateQueries({ queryKey: ["myInfo"], exact: true });
      if (isSingle && stableBookId) {
        queryClient.invalidateQueries({
          queryKey: ["BooksDetail", stableBookId],
          exact: true,
        });
      }

      navigate("/order/complete", {
        replace: true,
        state: { ...data, orderItems, total },
      });
    },
    onError: (err) => {
      console.error("❌ 주문 중 오류 발생:", err);
      const message = err.response?.data?.message || "결제 중 오류가 발생했습니다.";
      alert(message);
    },
  });

  if (isSingle && isLoading && !bookDataFromState) {
    return (
      <div className="sec inner">
        <p style={{ textAlign: "center" }}>상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="sec inner">
      <StepProgress currentStep="order" />
      <h2 className="sec-tit">주문 결제</h2>

      <section className="sec-cont">
        <table className="table">
          <thead>
            <tr>
              <th>상품 정보</th>
              <th>정가</th>
              <th>수량</th>
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#aaa" }}>
                  주문할 상품이 없습니다.
                </td>
              </tr>
            ) : (
              orderItems.map((item, idx) =>
                item && item.book ? <OrderItem key={idx} item={item} /> : null
              )
            )}
          </tbody>
        </table>
      </section>

      <div className="summary">
        <div>
          <p>총 결제 금액</p>
          <strong>{total.toLocaleString()}원</strong>
        </div>
        <div>
          <p>보유 포인트</p>
          <strong>{point.toLocaleString()}점</strong>
        </div>
      </div>

      <div className="btnWrap btnWrap-end">
        <button
          className="btn btn-default btn-primary"
          onClick={() => {
            if (window.confirm("결제를 진행하시겠습니까?")) {
              orderMutation.mutate();
            }
          }}
          disabled={orderMutation.isLoading}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Order;
