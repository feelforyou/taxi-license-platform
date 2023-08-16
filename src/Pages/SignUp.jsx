import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig/firebaseConfig";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
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

  if (signupSuccess) {
    return (
      <div className="signup-container">
        <div className="signup-container-main">
          <h2 className="signup-heading">Success!</h2>
          <p className="signup-success-message">
            Signup successful! Please check your email for a verification link
            to complete the registration. (Also, check the spam folder if you
            don't see it in your inbox).
          </p>
          <button
            onClick={() => navigate("/login")}
            className="proceed-login-btn"
          >
            Proceed to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-container-main">
        {error && <p className="signup-error-message">{error}</p>}
        <h2 className="signup-heading">Sign Up</h2>
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
