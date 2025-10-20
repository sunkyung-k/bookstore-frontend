import styles from "./QuantityInput.module.scss";

function QuantityInput({ quantity, stock, onChange }) {
  const handleIncrease = () => {
    const newQty = quantity + 1;
    if (newQty > stock) {
      alert(`재고는 ${stock}개까지 가능합니다.`);
      return;
    }
    onChange(newQty);
  };

  const handleDecrease = () => {
    const newQty = quantity - 1;
    if (newQty < 1) {
      alert("수량은 최소 1개 이상이어야 합니다.");
      return;
    }
    onChange(newQty);
  };

  const isSoldOut = stock <= 0;

  return (
    <div className={`${styles.qtyBox} ${isSoldOut ? styles.disabled : ""}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isSoldOut}
        aria-disabled={isSoldOut}
      >
        -
      </button>
      <span>{quantity}</span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={isSoldOut}
        aria-disabled={isSoldOut}
      >
        +
      </button>
    </div>
  );
}

export default QuantityInput;
