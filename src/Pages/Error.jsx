import React from "react";
import { Link } from "react-router-dom"; // შემოვიტანეთ Link!
import styles from "./error.module.css"; // შემოვიტანეთ სტილები

const Error = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Oops! Page Not Found</h2>
        <p className={styles.description}>
          We can't seem to find the page you're looking for. Check the URL or
          head back home.
        </p>
        {/* a ტეგის მაგივრად ვიყენებთ Link-ს სწრაფი ნავიგაციისთვის */}
        <Link to="/" className={styles.homeBtn}>
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
