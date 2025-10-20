import { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/axiosApi";
import ModalWrapper from "@/components/ui/ModalWrapper";
import styles from "./BookFormModal.module.scss";

/**
 * @param {Object} props
 * @param {"create" | "edit"} props.mode 모달 모드
 * @param {Object} [props.book] 수정 시 기존 도서 데이터
 * @param {Function} props.onClose 닫기 이벤트
 * @param {Function} props.onSuccess 등록/수정 후 리프레시 콜백
 */
function BookFormModal({ mode = "create", book, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  // 수정모드 초기값
  useEffect(() => {
    if (mode === "edit" && book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        price: book.price || "",
        stock: book.stock || "",
        description: book.description || "",
        image: null, // 수정 시 새로 업로드 안하면 기존 유지
      });
    }
  }, [mode, book]);

  // 입력값 변경
  const handleChange = (e) => {
    const key = e.target.name.replace("ipt_", "");
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // 유효성 검사
  const isFormValid = useMemo(() => {
    const hasRequiredFields =
      form.title.trim() &&
      form.author.trim() &&
      form.price &&
      form.stock &&
      form.description.trim();

    const hasImage = mode === "edit" ? true : !!form.image;

    return hasRequiredFields && hasImage;
  }, [form, mode]);

  // 등록/수정
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(form).forEach(
        ([key, value]) => value && formData.append(key, value)
      );

      const url = mode === "edit" ? `/api/v1/books/${book.bookId}` : "/api/v1/books";
      const method = mode === "edit" ? api.put : api.post;

      const res = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      alert(mode === "edit" ? "도서 정보가 수정되었습니다!" : "도서가 등록되었습니다!");
      onSuccess?.();
      onClose();
    },
    onError: () => {
      alert("처리 중 오류가 발생했습니다.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("모든 필드를 입력하고 이미지를 등록해주세요!");
      return;
    }
    mutation.mutate();
  };

  const footerButtons = (
    <>
      <button className="btn btn-default btn-secondary" onClick={onClose}>
        닫기
      </button>
      <button
        type="submit"
        className="btn btn-default btn-primary"
        disabled={!isFormValid || mutation.isLoading}
        onClick={handleSubmit}
      >
        {mode === "edit" ? "수정" : "등록"}
      </button>
    </>
  );

  return (
    <ModalWrapper
      title={mode === "edit" ? "도서 정보 수정" : "새 도서 등록"}
      width={600}
      onClose={onClose}
      footer={footerButtons}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formItem}>
          <label htmlFor="ipt_title" className="form-label">
            도서명
          </label>
          <input
            name="ipt_title"
            id="ipt_title"
            className="form-ipt"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formItem}>
          <label htmlFor="ipt_author" className="form-label">
            저자
          </label>
          <input
            name="ipt_author"
            id="ipt_author"
            className="form-ipt"
            value={form.author}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formItemRow}>
          <div>
            <label htmlFor="ipt_price" className="form-label">
              가격
            </label>
            <input
              type="number"
              name="ipt_price"
              id="ipt_price"
              className="form-ipt"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="ipt_stock" className="form-label">
              재고
            </label>
            <input
              type="number"
              name="ipt_stock"
              id="ipt_stock"
              className="form-ipt"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formItem}>
          <label htmlFor="ipt_image" className="form-label">
            이미지
          </label>
          <input
            type="file"
            id="ipt_image"
            className="form-ipt"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className={styles.formItem}>
          <label htmlFor="ipt_description" className="form-label">
            설명
          </label>
          <textarea
            name="ipt_description"
            id="ipt_description"
            className="form-ipt"
            value={form.description}
            onChange={handleChange}
          />
        </div>
      </form>
    </ModalWrapper>
  );
}

export default BookFormModal;
