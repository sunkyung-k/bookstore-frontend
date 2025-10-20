import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import { authStore } from "@/stores/authStore";
import QuantityInput from "@/components/ui/QuantityInput";
import { FaCartShopping } from "react-icons/fa6";
import styles from "./BooksDetail.module.scss";

function BooksDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const token = authStore((state) => state.token);
  const userId = authStore((state) => state.userId);
  const myPoint = authStore((state) => state.point);
  const setPoint = authStore((state) => state.setPoint);

  // 도서 상세 조회
  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["BooksDetail", Number(bookId)],
    queryFn: async () => {
      const res = await api.get(`/api/v1/books/${bookId}`);
      return res.data.data;
    },
    enabled: !!bookId,
    refetchOnMount: false, // 덜컹 방지
    refetchOnWindowFocus: false, // 불필요한 재호출 방지
    staleTime: 1000 * 60 * 3, // 캐시 유지 3분
  });

  // 포인트 최신화
  useEffect(() => {
    if (!userId) return;

    const fetchLatestPoint = async () => {
      try {
        const res = await api.get(`/api/v1/mypage/point?userId=${userId}`);
        const latestPoint = res.data?.content?.point;
        if (latestPoint !== undefined) setPoint(latestPoint);
      } catch (err) {
        console.error("포인트 최신화 실패:", err);
      }
    };

    fetchLatestPoint();
  }, [userId, setPoint]);

  // 장바구니 담기
  const handleAddToCart = useCallback(async () => {
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/v1/cart", { bookId: book.bookId, quantity });
      queryClient.invalidateQueries({ queryKey: ["cartList", userId], exact: true });

      if (window.confirm("장바구니에 담겼습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart");
      }
    } catch (err) {
      console.error("장바구니 추가 실패:", err);
    }
  }, [token, book, quantity, queryClient, userId, navigate]);

  // 바로구매
  const handleBuyNow = useCallback(() => {
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    // 재고 체크
    if (book.stock <= 0) {
      alert("해당 도서는 품절되어 구매할 수 없습니다.");
      return;
    }

    const totalPrice = Number(book.price) * Number(quantity);
    const currentPoint = Number(myPoint);

    // 포인트 체크
    if (currentPoint < totalPrice) {
      const goCharge = window.confirm(
        `포인트가 부족합니다.\n보유 포인트: ${currentPoint.toLocaleString()}점\n필요 금액: ${totalPrice.toLocaleString()}점\n\n마이페이지로 이동하시겠습니까?`
      );
      if (goCharge) navigate("/mypage");
      return;
    }

    // 주문 진행
    navigate("/order", {
      state: {
        bookId: book.bookId,
        quantity,
        totalPrice,
        bookData: book,
      },
    });
  }, [token, book, quantity, myPoint, navigate]);

  if (isLoading) return <p>도서 정보를 불러오는 중입니다...</p>;
  if (isError || !book) return <p>도서 정보를 불러오지 못했습니다.</p>;

  return (
    <div className={`${styles.detail} inner`}>
      <div className={styles.top}>
        <div className={styles.thumb}>
          <img src={`http://localhost:9090${book.imageUrl}`} alt={book.title} />
        </div>

        <div className={styles.info}>
          <h2>{book.title}</h2>
          <ul className={styles.list}>
            <li>
              <strong class={styles.label}>저자</strong>
              {book.author}
            </li>
            <li>
              <strong class={styles.label}>도서 가격</strong>
              {book.price.toLocaleString()}원
            </li>
            <li>
              <strong class={styles.label}>재고</strong>
              {book.stock}개 남음
            </li>
            <li>
              <strong class={styles.label}>수량</strong>
              <QuantityInput
                quantity={quantity}
                stock={book.stock}
                onChange={setQuantity}
              />
            </li>
            <li className={styles.price}>
              <strong class={styles.label}>주문 금액</strong>
              {(book.price * quantity).toLocaleString()}원
            </li>
          </ul>

          <div className="btnWrap">
            {book.stock > 0 ? (
              <>
                <button
                  type="button"
                  className="btn btn-default btn-secondary"
                  onClick={handleAddToCart}
                >
                  <FaCartShopping size="14" />
                  장바구니 담기
                </button>

                <button
                  type="button"
                  className="btn btn-default btn-primary"
                  onClick={handleBuyNow}
                >
                  바로구매
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-default btn-disabled" disabled>
                  품절
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <p>{book.description}</p>
    </div>
  );
}

export default BooksDetail;
