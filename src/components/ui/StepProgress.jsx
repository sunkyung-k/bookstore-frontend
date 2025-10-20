function StepProgress({ currentStep }) {
  const steps = [
    { id: "cart", label: "장바구니" },
    { id: "order", label: "주문결제" },
    { id: "complete", label: "주문완료" },
  ];

  return (
    <div className="progress">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`step ${
            step.id === currentStep
              ? "active"
              : index < steps.findIndex((s) => s.id === currentStep)
              ? "done"
              : ""
          }`}
        >
          <span className="circle">{index + 1}</span>
          <span className="label">{step.label}</span>
          {index < steps.length - 1 && <span className="arrow">→</span>}
        </div>
      ))}
    </div>
  );
}

export default StepProgress;
