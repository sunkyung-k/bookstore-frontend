import { useMemo, useState } from "react";
import Pagination from "@/components/ui/Pagination";
import styles from "./MyPage.module.scss";
import { useEffect } from "react";

function TabOrderList({ orders = [], refetch }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 4;

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  const paginatedOrders = useMemo(() => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedOrders.slice(start, end);
  }, [orders, page]);

  const movePage = (newPage) => {
    const totalPage = Math.ceil(orders.length / rowsPerPage);
    if (newPage < 0 || newPage >= totalPage) return;
    setPage(newPage);
  };

  return (
    <>
      <ul className={styles.orderList}>
        {orders.length === 0 ? (
          <p className={styles.empty}>주문 내역이 없습니다.</p>
        ) : (
          paginatedOrders.map((order) => (
            <li key={order.orderId} className={styles.orderBox}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>#{order.orderId}</span>
                  <span className={styles.date}>
                    {new Date(order.orderDate).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className={styles.price}>
                    {order.totalPrice?.toLocaleString()}원
                  </span>
                </div>
              </div>

              <ul className={styles.orderBooks}>
                {order.orderItems?.map((item) => {
                  // 스냅샷 제목 우선 표시
                  const title =
                    item.bookTitleSnapshot?.trim() || item.book?.title || "(삭제된 도서)";

                  // 삭제 여부 필드명 통합 (deleted 또는 isDeleted)
                  const isDeleted = item.deleted === true || item.isDeleted === true;

                  return (
                    <li key={item.orderItemId ?? item.bookId}>
                      <span>
                        ▪ {title}
                        {isDeleted && <em className={styles.soldOut}>(삭제된 도서)</em>}
                      </span>
                      <span>{item.quantity}권</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))
        )}
      </ul>

      {orders.length > 0 && (
        <Pagination
          page={page}
          totalRows={orders.length}
          pagePerRows={rowsPerPage}
          movePage={movePage}
        />
      )}

      <div className="btnWrap btnWrap-center">
        <button
          className="btn btn-default btn-primary"
          onClick={() => (window.location.href = "/")}
        >
          새 주문하기
        </button>
      </div>
    </>
  );
}

export default TabOrderList;
