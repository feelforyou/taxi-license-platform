import React, { useState, useEffect } from "react"; // Added useEffect
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false); // State for tracking signup success

  const navigate = useNavigate();

  useEffect(() => {
    if (signupSuccess) {
      setTimeout(() => {
        navigate("/login");
      }, 5000); // 5 seconds delay before navigating
    }
  }, [signupSuccess, navigate]);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const auth = getAuth();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      signOut(auth);
      setSignupSuccess(true); // Set signup success state when signup is successful
    } catch (err) {
      setError(err.message);
    }
  };

  if (signupSuccess) {
    return (
      <div className="signup-container">
        <div className="signup-container-main">
          <h2 className="signup-heading">Success!</h2>
          <p className="signup-success-message">
            Signup successful! Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-container-main">
        <h2 className="signup-heading">Sign Up</h2>
        {error && <p className="signup-error-message">{error}</p>}

        <div className="signup-input-group">
          <label className="signup-label" htmlFor="email">
            Email
          </label>
          <input
            className="signup-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="signup-input-group">
          <label className="signup-label" htmlFor="password">
            Password
          </label>
          <input
            className="signup-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="signup-input-group">
          <label className="signup-label" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="signup-input"
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
          />
        </div>

        <button className="signup-btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
