import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
      setMessage(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="pass-reset-header">Password Reset</h2>
        <form
          onSubmit={handleResetPassword}
          className="edit-upload-form-container"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <div className="modal-actions">
            <button className="pass-reset-btn" type="submit">
              Send Reset Email
            </button>
            <button className="pass-reset-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
        {message && <p className="pass-reset-msg">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetModal;
