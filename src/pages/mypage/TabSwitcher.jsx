import TabOrderList from "./TabOrderList";
import TabBooks from "./TabBooks";
import styles from "./TabSwitcher.module.scss";

function TabSwitcher({ activeTab, setActiveTab, userRole, orders, refetch }) {
  return (
    <>
      {/* 탭 네비게이션 */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("orders")}
          className={activeTab === "orders" ? styles.active : ""}
        >
          주문 내역
        </button>

        {userRole === "ADMIN" && (
          <button
            onClick={() => setActiveTab("books")}
            className={activeTab === "books" ? styles.active : ""}
          >
            도서 관리
          </button>
        )}
      </div>

      {/* 탭 내용 */}
      <div className={styles.tab}>
        {activeTab === "orders" && <TabOrderList orders={orders} refetch={refetch} />}
        {activeTab === "books" && userRole === "ADMIN" && <TabBooks />}
      </div>
    </>
  );
}

export default TabSwitcher;
