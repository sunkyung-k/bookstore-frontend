import React from "react";
import Gnb from "./Gnb";
import styles from "./Header.module.scss";

function Header(props) {
  return (
    <>
      <header className={styles.header}>
        <Gnb />
      </header>
    </>
  );
}

export default Header;
