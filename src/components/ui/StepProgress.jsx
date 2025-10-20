// src/components/common/StepProgress.jsx
import styles from "./StepProgress.module.scss";

function StepProgress({ currentStep }) {
  const steps = [
    { id: "cart", label: "장바구니" },
    { id: "order", label: "주문결제" },
    { id: "complete", label: "주문완료" },
  ];

  return (
    <div className={styles.progress}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`${styles.step} ${
            step.id === currentStep
              ? styles.active
              : index < steps.findIndex((s) => s.id === currentStep)
              ? styles.done
              : ""
          }`}
        >
          <span className={styles.circle}>{index + 1}</span>
          <span className={styles.label}>{step.label}</span>
          {index < steps.length - 1 && <span className={styles.arrow}>→</span>}
        </div>
      ))}
    </div>
  );
}

export default StepProgress;
