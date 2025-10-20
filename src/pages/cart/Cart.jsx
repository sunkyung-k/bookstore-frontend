import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import api from "@/api/axiosApi";
import { authStore } from "@/stores/authStore";
import CartItem from "./CartItem";
import StepProgress from "../../components/ui/StepProgress";
import styles from "./Cart.module.scss";

function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const { userId, point, token } = authStore((s) => s);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cartList", userId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/cart/${userId}`);
      return res.data.data;
    },
    enabled: !!userId && !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (cartIds) => {
      for (const id of cartIds) await api.delete(`/api/v1/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cartList", userId]);
      setSelectedItems([]);
      alert("선택한 상품이 삭제되었습니다.");
    },
  });

  if (!userId) return <p>로그인 후 이용 가능합니다.</p>;
  if (isLoading) return <p>로딩중...</p>;
  if (isError) return <p>에러 발생!</p>;

  const carts = data?.carts || [];
  const total = carts
    .filter((item) => selectedItems.includes(item.cartId))
    .reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const handleSelectAll = (checked) =>
    setSelectedItems(checked ? carts.map((i) => i.cartId) : []);

  const handleSelectItem = (id) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    if (total > point) {
      alert("포인트가 부족합니다. 마이페이지에서 충전해주세요.");
      return;
    }

    if (!window.confirm("주문을 진행하시겠습니까?")) return;

    const selectedBooks = carts.filter((i) => selectedItems.includes(i.cartId));
    navigate("/order", {
      state: { userId, selectedBooks, total, point },
    });
  };

  const isPointNotEnough = total > point;

  return (
    <div className="sec inner">
      <StepProgress currentStep="cart" />
      <h2 className="sec-tit">장바구니</h2>

      <div className="sec-cont">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === carts.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>상품 정보</th>
              <th>정가</th>
              <th>수량</th>
              <th>합계</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((item) => (
              <CartItem
                key={item.cartId}
                item={item}
                selected={selectedItems.includes(item.cartId)}
                onSelect={handleSelectItem}
                onDelete={() => deleteMutation.mutate([item.cartId])}
              />
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div>
            <p>총 결제 금액</p>
            <strong>{total.toLocaleString()}원</strong>
          </div>
          <div>
            <p>보유 포인트</p>
            <strong>{point.toLocaleString()}점</strong>
          </div>

          {isPointNotEnough && (
            <p className="warningText">
              ⚠ 포인트가 부족합니다. 마이페이지에서 충전 후 주문해주세요.
            </p>
          )}
        </div>

        <div className="btnWrap btnWrap-end">
          <button
            className="btn btn-default btn-secondary"
            onClick={() => deleteMutation.mutate(selectedItems)}
            disabled={selectedItems.length === 0}
          >
            선택 삭제
          </button>
          {isPointNotEnough && (
            <button
              className="btn btn-default btn-danger"
              onClick={() => navigate("/mypage")}
            >
              포인트 충전하기
            </button>
          )}
          <button
            className="btn btn-default btn-primary"
            onClick={handleOrder}
            disabled={selectedItems.length === 0 || isPointNotEnough}
          >
            선택한 상품 주문하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
