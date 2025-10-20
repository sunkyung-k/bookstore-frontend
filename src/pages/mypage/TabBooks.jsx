import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import BookFormModal from "./BookFormModal";
import Pagination from "@/components/ui/Pagination";
import styles from "./MyPage.module.scss";
import { FaPlus } from "react-icons/fa6";

function TabBooks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // 도서 목록 조회
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["BooksList", page],
    queryFn: async () => {
      const res = await api.get(`/api/v1/books?page=${page}&size=${rowsPerPage}`);
      return res.data.data;
    },
  });

  const books = data?.books || [];
  const totalCount = data?.count || 0;

  // 삭제
  const handleDelete = async (bookId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await api.delete(`/api/v1/books/${bookId}`);
    alert("삭제되었습니다.");
    refetch();
  };

  const movePage = (newPage) => {
    const totalPage = Math.ceil(totalCount / rowsPerPage);
    if (newPage < 0 || newPage >= totalPage) return;
    setPage(newPage);
  };

  if (isLoading) return <p>로딩중...</p>;

  return (
    <>
      <div className={styles.tableWrap}>
        <table className="table">
          <colgroup>
            <col width="*" />
            <col width="22%" />
            <col width="15%" />
            <col width="10%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th>도서명</th>
              <th>저자</th>
              <th>가격</th>
              <th>재고</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {books.length ? (
              books.map((book) => (
                <tr key={book.bookId}>
                  <td className="bookInfo">
                    <img
                      src={
                        book.imageUrl
                          ? `http://localhost:9090${book.imageUrl}`
                          : "/no-image.png"
                      }
                      alt={book.title}
                    />
                    <p>{book.title}</p>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.price.toLocaleString()}원</td>
                  <td>{book.stock}</td>
                  <td>
                    <div className={styles.btnCell}>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary-line"
                        onClick={() => setEditBook(book)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDelete(book.bookId)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  등록된 도서가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <Pagination
          page={page}
          totalRows={totalCount}
          pagePerRows={rowsPerPage}
          movePage={movePage}
        />
      )}

      <div className="btnWrap btnWrap-center">
        <button
          className="btn btn-default btn-primary"
          onClick={() => setIsCreateOpen(true)}
        >
          <FaPlus size="12" />새 도서 등록
        </button>
      </div>

      {isCreateOpen && (
        <BookFormModal
          mode="create"
          onClose={() => setIsCreateOpen(false)}
          onSuccess={refetch}
        />
      )}

      {editBook && (
        <BookFormModal
          mode="edit"
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={refetch}
        />
      )}
    </>
  );
}

export default TabBooks;
