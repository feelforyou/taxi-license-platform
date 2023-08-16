import React, { useEffect, useState } from "react";
import { GoogleSignIn } from "../Data/data";
import { useGlobalContext } from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../FirebaseConfig/firebaseConfig";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const {
    signInWithGoogle,
    isAuthenticated,
    user,
    signInEmailPassword,
    updateUserDetails,
  } = useGlobalContext();

  const handleEmailPasswordSignIn = async (e) => {
    try {
      const loggedInUser = await signInEmailPassword(email, password);

      // Check if user's email is verified
      if (loggedInUser && !loggedInUser.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      if (loggedInUser) {
        updateUserDetails({
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          avatar: loggedInUser.photoURL,
          uid: loggedInUser.uid,
        });
        navigate(`/${loggedInUser.uid}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (user.emailVerified) {
        navigate(`/${user.uid}`);
      } else {
        setError("Please verify your email before accessing your profile.");
      }
    }
  }, [navigate, isAuthenticated, user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");
    const apiKey = urlParams.get("apiKey");

    if (mode === "verifyEmail") {
      fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oobCode: actionCode,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Firebase Response:", data);
          if (data.emailVerified) {
            setError("Email successfully verified! You can now log in.");
          } else {
            setError(
              data.error
                ? data.error.message
                : "There was an error verifying your email. Please try again."
            );
          }
        })

        .catch((error) => {
          console.error("Fetch Error:", error);
          setError(
            "There was an error verifying your email. Please try again."
          );
        });
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && result.user) {
        navigate(`/${result.user.uid}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        {error && <div className="error-message">{error}</div>}

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
