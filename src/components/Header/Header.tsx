import React from "react";
import styles from "./Header.module.scss";
const Header = () => {
  return (
    <header className={styles.Header}>
      <div className={styles.Header_container}>
        <div className={styles.logoContainer}>
          {/* <div> */}
          <img src="https://desperateapewives.com/wp-content/uploads/logo-02.png" alt="" />
          {/* </div> */}
          <p>DAW Wallpapers</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
