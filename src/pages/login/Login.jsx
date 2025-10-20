import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/useLogin";
import styles from "./Login.module.scss";

// yup 유효성 스키마
const schema = yup.object().shape({
  username: yup.string().required("아이디를 입력해주세요."),
  password: yup.string().required("비밀번호를 입력해주세요."),
});

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const loginMutation = useLogin();

  // 로그인 처리
  const goLogin = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      } else if (error.response?.status === 400) {
        alert("입력한 정보가 잘못되었습니다.");
      } else {
        alert("처리 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginBox}>
        <h2 className={styles.secTitle}>로그인</h2>
        <form onSubmit={handleSubmit(goLogin)}>
          <div className={styles.formItem}>
            <label htmlFor="username" className="form-label">
              아이디
            </label>
            <input
              type="text"
              id="username"
              className={`form-ipt ${errors.username ? "is-invalid" : ""}`}
              {...register("username")}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          <div className={styles.formItem}>
            <label htmlFor="password" className="form-label">
              패스워드
            </label>
            <input
              type="password"
              id="password"
              className={`form-ipt ${errors.password ? "is-invalid" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-default btn-primary w-100">
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
