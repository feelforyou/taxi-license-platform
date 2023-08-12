import React, { useEffect } from "react";
import { GoogleSignIn } from "../Data/data";
import { useGlobalContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated, user } = useGlobalContext();
  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${user.uid}`);
    }
  }, [navigate, isAuthenticated, user.uid]);
  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result && result.user) {
      navigate(`/${result.user.uid}`);
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        <h1>Log In</h1>

        <div className="login-inputs">
          <input type="email" placeholder="Email" className="login-input" />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
          />
        </div>

        <button className="login-btn">Log In</button>
        <button className="register-btn">Register</button>

        <div className="google-btn" onClick={handleSignIn}>
          <GoogleSignIn />
        </div>
      </main>
    </div>
  );
};

export default LogIn;
