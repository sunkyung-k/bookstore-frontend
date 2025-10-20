import React, { useMemo, useState, useEffect } from "react";

function Pagination({ page, totalRows, movePage, pagePerRows = 10, blockPerCount = 10 }) {
  const [visibleCount, setVisibleCount] = useState(blockPerCount);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCount(3);
      } else {
        setVisibleCount(blockPerCount);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [blockPerCount]);

  const calculatePageData = useMemo(() => {
    if (!totalRows || totalRows === 0 || !pagePerRows || pagePerRows <= 0) {
      return { totalPage: 0, nowBlock: 0, totalBlock: 0 };
    }
    const totalPage = Math.ceil(totalRows / pagePerRows);
    const nowBlock = Math.floor(page / visibleCount);
    const totalBlock = Math.ceil(totalPage / visibleCount);

    return { totalPage, nowBlock, totalBlock };
  }, [totalRows, pagePerRows, page, visibleCount]);

  const { totalPage, nowBlock, totalBlock } = calculatePageData;

  // 페이지가 1페이지 이하일 경우, Pagination 숨김
  if (totalPage <= 1) return null;

  const renderPage = () => {
    const pageHTML = [];

    // 처음
    pageHTML.push(
      <li key="first" className={`pageItem ${page === 0 ? "disabled" : ""}`}>
        <button onClick={() => movePage(0)}>«</button>
      </li>
    );

    // 이전
    const prevBlockPageNum = nowBlock * visibleCount - 1;
    pageHTML.push(
      <li key="prev" className={`pageItem ${nowBlock <= 0 ? "disabled" : ""}`}>
        <button onClick={() => movePage(Math.max(prevBlockPageNum, 0))}>‹</button>
      </li>
    );

    // 페이지 번호
    for (let i = 0; i < visibleCount; i++) {
      const pageNum = nowBlock * visibleCount + i;
      if (pageNum >= totalPage) break;

      const isActive = page === pageNum ? "active" : "";
      pageHTML.push(
        <li key={pageNum} className={`pageItem ${isActive}`}>
          <button onClick={() => movePage(pageNum)}>{pageNum + 1}</button>
        </li>
      );
    }

    // 다음
    const nextBlockPageNum = (nowBlock + 1) * visibleCount;
    pageHTML.push(
      <li
        key="next"
        className={`pageItem ${nowBlock + 1 >= totalBlock ? "disabled" : ""}`}
      >
        <button onClick={() => movePage(nextBlockPageNum)}>›</button>
      </li>
    );

    // 마지막
    const lastPageNum = totalPage - 1;
    pageHTML.push(
      <li key="last" className={`pageItem ${page === lastPageNum ? "disabled" : ""}`}>
        <button onClick={() => movePage(lastPageNum)}>»</button>
      </li>
    );

    return pageHTML;
  };

  return (
    <nav className="paginationNav" aria-label="page navigation">
      <ul className="pagination">{renderPage()}</ul>
    </nav>
  );
}

export default Pagination;
