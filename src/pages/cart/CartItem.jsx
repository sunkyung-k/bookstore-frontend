import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import { useNavigate } from "react-router";
import QuantityInput from "@/components/ui/QuantityInput";
import { authStore } from "@/stores/authStore";
import styles from "./Cart.module.scss";

function CartItem({ item, selected, onSelect, onDelete }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = authStore((state) => state.userId);

  // item 구조분해
  const book = item?.book ?? {};
  const initialQty = item?.quantity ?? 1;
  const cartId = item?.cartId ?? null;

  const [tempQty, setTempQty] = useState(initialQty);
  const [isChanged, setIsChanged] = useState(false);

  const isSoldOut = book.stock <= 0;

  const updateQuantityMutation = useMutation({
    mutationFn: async () => {
      if (!cartId) return;
      await api.put(`/api/v1/cart/${cartId}`, { quantity: tempQty });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList", userId] });
      alert("수량이 변경되었습니다!");
      setIsChanged(false);
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.resultMsg ||
        "수량 변경 중 오류가 발생했습니다.";
      alert(msg);
    },
  });

  if (!item || !item.book) return null;

  const handleQuantityChange = (newQty) => {
    setTempQty(newQty);
    setIsChanged(true);
  };

  const goToDetail = () => {
    navigate(`/books/${book.bookId}`);
  };

  return (
    <tr className={isSoldOut ? styles.soldOutRow : ""}>
      <td>
        <input
          type="checkbox"
          checked={selected}
          disabled={isSoldOut}
          onChange={() => !isSoldOut && onSelect(cartId)}
        />
      </td>

      <td className="bookInfo">
        <a href="javascript:void(0);" onClick={goToDetail}>
          <img
            src={`http://localhost:9090${book.imageUrl}`}
            alt={book.title}
            className="thumb"
            style={{ opacity: isSoldOut ? 0.5 : 1 }}
          />
        </a>
        <a href="javascript:void(0);" onClick={goToDetail} className="btn-hv">
          <p>
            {book.title}
            {isSoldOut && <span className={styles.soldOutTag}> (품절)</span>}
          </p>
        </a>
      </td>

      <td>
        <p>{book.price?.toLocaleString()}원</p>
      </td>

      <td>
        <div className={styles.qBox}>
          <QuantityInput
            quantity={tempQty}
            stock={book.stock}
            onChange={handleQuantityChange}
          />
          <button
            className={`btn btn-sm btn-secondary-line ${
              !isChanged ? "btn-disabled" : ""
            }`}
            onClick={() => updateQuantityMutation.mutate()}
            disabled={!isChanged || isSoldOut}
          >
            변경
          </button>
        </div>
      </td>

      <td>
        <p>{(book.price * tempQty).toLocaleString()}원</p>
      </td>

      <td>
        <button
          className="btn btn-sm btn-secondary-line"
          onClick={() => onDelete(cartId)}
        >
          삭제
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
