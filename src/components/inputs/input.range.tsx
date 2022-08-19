import styles from "./input.range.module.scss";
import React from "react";

const RangeInput = (props: React.InputHTMLAttributes<HTMLInputElement> & { orient?: "vertical" }) => {
  return <input className={styles.RangeInput} type="range" {...props} />;
};

export default RangeInput;
