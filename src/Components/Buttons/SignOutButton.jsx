import React from "react";
import styles from "./authButtons.module.css";

const SignOutButton = ({ onClick, className }) => {
  return (
    <li className={`${styles.signOutBtn} ${className || ""}`} onClick={onClick}>
      <span className={styles.spanHover}>გამოსვლა</span>
    </li>
  );
};

export default SignOutButton;
