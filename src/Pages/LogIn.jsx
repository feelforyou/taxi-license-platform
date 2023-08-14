import React, { useEffect, useState } from "react";
import { GoogleSignIn } from "../Data/data";
import { useGlobalContext } from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated, user, signInEmailPassword } =
    useGlobalContext();

  const handleEmailPasswordSignIn = async () => {
    try {
      const user = await signInEmailPassword(email, password);
      if (user) {
        navigate(`/${user.uid}`);
      }
    } catch (error) {
      // Handle error, maybe show a message to the user
      console.error("Error:", error.message);
    }
  };

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
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            className="login-input"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="login-input"
          />
        </div>

        <button onClick={handleEmailPasswordSignIn} className="login-btn">
          Log In
        </button>

        <Link className="link-wrapper" to="/signup">
          <button className="register-btn">Register</button>
        </Link>

        <div className="google-btn" onClick={handleSignIn}>
          <GoogleSignIn />
        </div>
      </main>
    </div>
  );
};

export default LogIn;
