import styles from "../cart/Cart.module.scss";
import { useNavigate } from "react-router";

function OrderItem({ item }) {
  const { book, bookId, title, quantity, totalPrice } = item;
  const navigate = useNavigate();

  const goToDetail = () => {
    if (bookId) navigate(`/books/${bookId}`);
  };

  // 이미지 경로
  const imageSrc = book?.imageUrl
    ? book.imageUrl.startsWith("http")
      ? book.imageUrl
      : `http://localhost:9090${book.imageUrl}`
    : "/files/static/books/default.jpg";

  // 제목
  const displayTitle = title || book?.title || "(삭제된 도서)";
  const isDeleted = !bookId || displayTitle.includes("삭제된 도서");

  return (
    <tr>
      <td className="bookInfo">
        <a href="javascript:void(0);" onClick={goToDetail}>
          <img
            src={imageSrc}
            alt={displayTitle}
            className={styles.thumb}
            onError={(e) => (e.target.src = "/files/static/books/default.jpg")}
          />
        </a>

        <a href="javascript:void(0);" onClick={goToDetail} className="btn-hv">
          {isDeleted ? (
            <span className="text-gray-400">
              ▪ {displayTitle.replace("(삭제된 도서)", "").trim()} (삭제된 도서)
            </span>
          ) : (
            <span>{displayTitle}</span>
          )}
        </a>
      </td>

      <td>{(book?.price ?? item.price ?? 0).toLocaleString()}원</td>
      <td>{quantity}</td>
      <td>{totalPrice.toLocaleString()}원</td>
    </tr>
  );
}

export default OrderItem;
