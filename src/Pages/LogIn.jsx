import React, { useEffect, useState } from "react";
import { GoogleSignIn } from "../Data/data";
import { useGlobalContext } from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import PasswordResetModal from "../Components/Home/PasswordResetModal";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const {
    signInWithGoogle,
    isAuthenticated,
    user,
    signInEmailPassword,
    isVerifying,
    setIsVerifying,
    refreshUser,
  } = useGlobalContext();

  useEffect(() => {
    // If the user is authenticated and their email is verified, redirect them
    if (user.emailVerified) {
      navigate(`/${user.uid}`);
    }
  }, [user.uid]);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await signInEmailPassword(email, password);

      // Check if user's email is verified
      if (loggedInUser && !loggedInUser.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      if (loggedInUser) {
        navigate(`/${loggedInUser.uid}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isVerifying) {
      if (user.emailVerified) {
        navigate(`/${user.uid}`);
      } else {
        setError("Please verify your email before accessing your profile.");
      }
    }
  }, [navigate, isAuthenticated, user, isVerifying]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

    if (mode === "verifyEmail") {
      setIsVerifying(true);
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
        .then(async (data) => {
          // console.log("Firebase Response:", data);
          if (data.emailVerified) {
            await refreshUser();
            setError("Email successfully verified! You can now log in.");
          } else {
            console.log(data.error);
            // setError(
            //   data.error
            //     ? data.error.message
            //     : "There was an error verifying your email. Please try again."
            // );
          }
        })
        .catch((error) => {
          console.error("Fetch Error:", error);
          // setError(
          //   "There was an error verifying your email. Please try again."
          // );
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && result.user) {
        setTimeout(() => {
          navigate(`/${result.user.uid}`);
        }, 100); // Delaying by half a second
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        {error && (
          <div
            className={`${
              error === "Email successfully verified! You can now log in."
                ? "error-message success-msg"
                : "error-message"
            }`}
          >
            {error}
          </div>
        )}

        <h1>Log In</h1>

        <form onSubmit={handleEmailPasswordSignIn} className="login-form">
          <div className="login-inputs">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="login-input"
              autoComplete="login-email"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="login-input"
              autoComplete="login-password"
            />
          </div>
          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <Link className="link-wrapper" to="/signup">
          <button className="register-btn">Register</button>
        </Link>
        <div
          className="forgot-pass-container"
          onClick={() => setIsModalOpen(true)}
        >
          <a>forgot password?</a>
        </div>
        <div className="google-btn" onClick={handleGoogleSignIn}>
          <GoogleSignIn />
        </div>
      </main>
      <PasswordResetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LogIn;
