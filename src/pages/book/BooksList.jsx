import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import api from "@/api/axiosApi";
import Pagination from "@/components/ui/Pagination";
import styles from "./BooksList.module.scss";

function BooksList() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const rowsPerPage = 8;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["books", page, submittedTerm],
    queryFn: async () => {
      const res = await api.get("/api/v1/books", {
        params: {
          page,
          size: rowsPerPage,
          keyword: submittedTerm || "",
        },
      });
      return res.data.data;
    },
  });

  const books = data?.books || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const movePage = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  };

  const handleSearchClick = () => {
    if (submittedTerm) {
      setSearchTerm("");
      setSubmittedTerm("");
      setPage(0);
      refetch();
    } else {
      const trimmed = searchTerm.trim();
      setPage(0);
      setSubmittedTerm(trimmed);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  useEffect(() => {
    if (searchTerm === "") {
      setSubmittedTerm("");
      setPage(0);
      refetch();
    }
  }, [searchTerm, refetch]);

  if (isLoading) return <p>로딩중...</p>;
  if (isError) return <p>도서 목록을 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <div className={styles.listWrap}>
      <div className={styles.search}>
        <input
          type="search"
          className={styles.iptSrch}
          placeholder="도서 제목을 입력해주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          type="button"
          className={styles.btnSrch}
          onClick={handleSearchClick}
          title={submittedTerm ? "전체 목록 보기" : "검색"}
        >
          <FaSearch />
        </button>
      </div>

      {submittedTerm && (
        <p className={styles.searchResult}>
          <strong>"{submittedTerm}"</strong>
          {books.length > 0
            ? " 에 대한 검색 결과입니다."
            : " 에 대한 검색 결과가 없습니다."}
        </p>
      )}

      <div className="inner">
        <p className={styles.count}>총 {totalCount}권</p>
        <div className={styles.list}>
          {books.length > 0 ? (
            books.map((book) => {
              const isSoldOut = book.stock <= 0;
              return (
                <div
                  key={book.bookId}
                  className={`${styles.item} ${isSoldOut ? styles.soldOut : ""}`}
                >
                  <Link to={`/books/${book.bookId}`}>
                    <div className={styles.thumb}>
                      <img
                        src={book.imageUrl && `http://localhost:9090${book.imageUrl}`}
                        alt={book.title}
                      />
                      {isSoldOut && <div className={styles.overlay}>품절</div>}
                    </div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.price.toLocaleString()}원</p>
                  </Link>
                </div>
              );
            })
          ) : (
            <p className={styles.empty}>등록된 도서가 없습니다.</p>
          )}
        </div>

        {totalCount > 0 && (
          <Pagination
            page={page}
            totalRows={totalCount}
            pagePerRows={rowsPerPage}
            movePage={movePage}
          />
        )}
      </div>
    </div>
  );
}

export default BooksList;
