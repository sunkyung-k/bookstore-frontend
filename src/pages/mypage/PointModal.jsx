import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import { authStore } from "@/stores/authStore";
import ModalWrapper from "@/components/ui/ModalWrapper";
import styles from "./PointModal.module.scss";

function PointModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const { userId } = authStore.getState();
  const setPoint = authStore.getState().setPoint;

  const chargeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/v1/mypage/charge", {
        userId,
        amount: Number(amount),
      });
      return res.data;
    },
    onSuccess: (res) => {
      const newPoint = res?.content?.point;
      if (newPoint !== undefined) {
        setPoint(newPoint);
      }
      alert("포인트 충전이 완료되었습니다!");
      onClose();
    },
    onError: () => {
      alert("충전 중 오류가 발생했습니다.");
    },
  });

  return (
    <ModalWrapper title="포인트 충전" width={420} onClose={onClose}>
      <div className={styles.pointModal}>
        <div className={styles.modalBox}>
          <p>충전할 포인트 금액을 입력하세요.</p>
          <input
            type="number"
            className="form-ipt"
            value={amount}
            placeholder="0"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="btnWrap">
          <button className="btn btn-default btn-secondary" onClick={onClose}>
            닫기
          </button>
          <button
            className="btn btn-default btn-primary"
            onClick={() => chargeMutation.mutate()}
            disabled={!amount}
          >
            충전하기
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default PointModal;
