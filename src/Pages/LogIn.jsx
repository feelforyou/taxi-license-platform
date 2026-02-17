import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import PasswordResetModal from "../Components/Home/PasswordResetModal";
import GoogleLoginButton from "../Components/Buttons/GoogleLoginButton"; // ჩვენი განახლებული კომპონენტი
import styles from "./login.module.css";

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

  // მომხმარებლის გადამისამართება
  useEffect(() => {
    if (user?.emailVerified) {
      navigate(`/${user.uid}`);
    }
  }, [user?.uid, navigate]);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await signInEmailPassword(email, password);

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

  // ვერიფიკაციის შემოწმება
  useEffect(() => {
    if (isAuthenticated && isVerifying) {
      if (user?.emailVerified) {
        navigate(`/${user.uid}`);
      } else {
        setError("Please verify your email before accessing your profile.");
      }
    }
  }, [navigate, isAuthenticated, user, isVerifying]);

  // URL-დან ვერიფიკაცია
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oobCode: actionCode }),
        },
      )
        .then((response) => response.json())
        .then(async (data) => {
          if (data.emailVerified) {
            await refreshUser();
            setError("Email successfully verified! You can now log in.");
          }
        })
        .catch((error) => console.error("Fetch Error:", error))
        .finally(() => setIsVerifying(false));
    }
  }, [refreshUser, setIsVerifying]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        setTimeout(() => {
          navigate(`/${result.user.uid}`);
        }, 100);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <main className={styles.loginMain}>
        {error && (
          <div
            className={`${styles.errorMessage} ${
              error.includes("successfully") ? styles.successMsg : ""
            }`}
          >
            {error}
          </div>
        )}

        <h1>Log In</h1>

        <form onSubmit={handleEmailPasswordSignIn} className={styles.loginForm}>
          <div className={styles.loginInputs}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className={styles.loginInput}
              autoComplete="username"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className={styles.loginInput}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={styles.loginBtn}>
            Log In
          </button>
        </form>

        <Link className={styles.linkWrapper} to="/signup">
          <button className={styles.registerBtn}>Register</button>
        </Link>

        <div className={styles.forgotPass} onClick={() => setIsModalOpen(true)}>
          <a>forgot password?</a>
        </div>

        {/* --- ცვლილება აქ არის --- */}

        <div className={styles.googleSection}>
          <GoogleLoginButton
            text="Sign in with Google"
            className={styles.fullWidthBtn} // <--- აქ გადავაწოდეთ სიგანის კლასი
            onClick={handleGoogleSignIn}
          />
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
