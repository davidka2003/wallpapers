import React from "react";
import iphone from "../../assets/iphone.png";
import overlay from "../../assets/screen.png";
import styles from "./iphone.module.scss";
const Iphone = () => {
  return (
    <div className={styles.wrapper}>
      <img src={iphone} alt="" />
      <img src={overlay} alt="" />
    </div>
  );
};

export default Iphone;
