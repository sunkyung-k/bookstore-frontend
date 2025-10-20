import { useEffect } from "react";
import styles from "./ModalWrapper.module.scss";

function ModalWrapper({ title, children, footer, width = 420, onClose }) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // body 스크롤 막기
  useEffect(() => {
    const original = document.body.style.overflowY;
    document.documentElement.style.overflowY = "hidden";
    document.body.style.overflowY = "hidden";

    return () => {
      document.documentElement.style.overflowY = original || "auto";
      document.body.style.overflowY = original || "auto";
    };
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ width }}>
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>

        <div className={styles.body}>
          {children}
          {footer && <div className="btnWrap btnWrap-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export default ModalWrapper;
