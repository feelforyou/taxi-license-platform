import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "./passwordReset.module.css"; // შემოვიტანეთ სტილები

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      // თუ ერორია, აქაც გამოვა (ვიზუალურად უბრალოდ მწვანედ გამოჩნდება, მაგრამ ტექსტი ერორის იქნება)
      setMessage(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.header}>Password Reset</h2>
        <form onSubmit={handleResetPassword} className={styles.formContainer}>
          <input
            className={styles.input}
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <div className={styles.actions}>
            {/* Close ღილაკს დავუმატეთ type="button" */}
            <button type="button" className={styles.closeBtn} onClick={onClose}>
              Close
            </button>
            <button type="submit" className={styles.submitBtn}>
              Send Reset Email
            </button>
          </div>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetModal;
