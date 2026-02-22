import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig/firebaseConfig";
import styles from "./signup.module.css"; // შემოდის ახალი სტილები

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      signOut(auth);
      setSignupSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // 1. წარმატებული რეგისტრაციის ეკრანი
  if (signupSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Success!</h2>
          <p className={styles.successMessage}>
            Signup successful! Please check your email for a verification link
            to complete the registration. (Also, check the spam folder if you
            don't see it in your inbox).
          </p>
          <button
            onClick={() => navigate("/login")}
            className={styles.submitBtn}
          >
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  // 2. რეგისტრაციის ფორმის ეკრანი
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Sign Up</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="new-email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className={styles.input}
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="confirm-password"
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
