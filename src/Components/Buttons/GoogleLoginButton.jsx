import React from "react";
import styles from "./buttons.module.css";
import { GoogleSignIn } from "../../Data/data"; // დარწმუნდი რომ გზა სწორია

const GoogleLoginButton = ({ onClick, className }) => {
  return (
    <li className={`${styles.googleBtn} ${className || ""}`} onClick={onClick}>
      <GoogleSignIn />
    </li>
  );
};

export default GoogleLoginButton;
