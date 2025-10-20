import { useLocation, useNavigate } from "react-router";
import { authStore } from "@/stores/authStore";
import StepProgress from "@/components/ui/StepProgress";
import styles from "./OrderComplete.module.scss";
function OrderComplete() {
  const navigate = useNavigate();
  const location = useLocation();

  // Zustand 구독 방식 (포인트 실시간 반영)
  const point = authStore((s) => s.point);

  // 주문 완료 데이터 가져오기 (navigate state)
  const state = location.state || {};
  const { orderItems = [], total = 0, usedPoint = 0, orderId } = state;

  return (
    <div className="sec inner">
      {/* 진행 단계 */}
      <StepProgress currentStep="complete" />

      {/* 타이틀 */}
      <h2 className={styles.title}>주문이 완료되었습니다!</h2>

      {/* 포인트 요약 */}
      <div className={styles.pointSummary}>
        <div className={styles.box}>
          <span>사용 포인트</span>
          <strong>{usedPoint.toLocaleString()}점</strong>
        </div>
        <div className={styles.box}>
          <span>남은 포인트</span>
          <strong>{point.toLocaleString()}점</strong>
        </div>
      </div>

      {/* 주문 상세 */}
      <section className="sec-cont">
        <p className={styles.orderNum}>
          주문번호: <strong>#{orderId ?? "정보 없음"}</strong>
        </p>

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
            {orderItems.map((item, idx) => {
              const title =
                item.title ||
                item.bookTitleSnapshot ||
                item.book?.title ||
                "(삭제된 도서)";
              const imageUrl = item.book?.imageUrl || "/files/static/books/default.jpg";
              const price = item.book?.price ?? item.price ?? 0;
              const totalPrice = item.totalPrice ?? price * item.quantity;

              return (
                <tr key={idx}>
                  <td className="bookInfo">
                    <img
                      src={
                        imageUrl.startsWith("http")
                          ? imageUrl
                          : `http://localhost:9090${imageUrl}`
                      }
                      alt={title}
                      className={styles.thumb}
                      onError={(e) => (e.target.src = "/no-image.jpg")}
                    />
                    <span>▪ {title}</span>
                  </td>
                  <td>{price.toLocaleString()}원</td>
                  <td>{item.quantity}</td>
                  <td>{totalPrice.toLocaleString()}원</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* 합계 영역 */}
      <div className="summary">
        <div>
          <p>총 결제 금액</p>
          <strong>{total.toLocaleString()}원</strong>
        </div>
        <div>
          <p>남은 포인트</p>
          <strong>{point.toLocaleString()}점</strong>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="btnWrap btnWrap-center">
        <button
          className="btn btn-default btn-primary"
          onClick={() => navigate("/mypage")}
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  );
}

export default OrderComplete;
