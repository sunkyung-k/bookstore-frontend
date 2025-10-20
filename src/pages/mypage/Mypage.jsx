import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import { authStore } from "@/stores/authStore";
import PointModal from "./PointModal";
import TabOrderList from "./TabOrderList";
import TabBooks from "./TabBooks";
import styles from "./MyPage.module.scss";
import { Tab } from "bootstrap";
import TabSwitcher from "./TabSwitcher";

function MyPage() {
  const { userId, userName, point, userRole, setPoint } = authStore((s) => s);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myOrders", userId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/mypage/${userId}`);
      return res.data?.data || {};
    },
    enabled: !!userId,
  });

  const orders = data?.orders ?? [];

  useEffect(() => {
    if (data?.point !== undefined && data?.point !== point) {
      setPoint(data.point);
    }
  }, [data?.point, point, setPoint]);

  if (!userId) return <p>로그인 후 이용해주세요.</p>;
  if (isLoading) return <p>로딩중...</p>;
  if (isError) return <p>에러 발생!</p>;

  return (
    <div className="sec inner">
      <h2 className="sec-tit">마이페이지{userRole === "ADMIN" && "(관리자)"}</h2>

      <div className="sec-cont">
        <div className={styles.profile}>
          <dl className={styles.info}>
            <dt>아이디</dt>
            <dd>{userId}</dd>
            <dt>보유 포인트</dt>
            <dd>{point.toLocaleString()}점</dd>
          </dl>

          <button
            className="btn btn-default btn-secondary-line"
            onClick={() => setIsModalOpen(true)}
          >
            포인트 충전
          </button>
        </div>

        <TabSwitcher
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={userRole}
          orders={orders}
          refetch={refetch}
        />
      </div>

      {isModalOpen && (
        <PointModal
          onClose={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}

export default MyPage;
