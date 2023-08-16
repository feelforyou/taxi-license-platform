import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { auth } from "../FirebaseConfig/firebaseConfig";
import {
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";

const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    uid: "",
    emailVerified: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const refreshUser = async () => {
    await auth.currentUser.reload();
    const currentUser = auth.currentUser;
    setUser({
      name: currentUser.displayName,
      email: currentUser.email,
      avatar: currentUser.photoURL,
      uid: currentUser.uid,
      emailVerified: currentUser.emailVerified,
    });
  };

  //email and password sign in
  const signInEmailPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      setUser({
        name: loggedInUser.displayName,
        email: loggedInUser.email,
        avatar: loggedInUser.photoURL,
        uid: loggedInUser.uid,
        emailVerified: loggedInUser.emailVerified,
      });
      return loggedInUser;
    } catch (error) {
      console.error("Error signing in with email/password:", error);
      throw error;
    }
  };

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser({
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
          uid: result.user.uid,
          emailVerified: result.user.emailVerified, // adding the emailVerified field
        });

        await refreshUser(); // Refresh for any additional updates
      }
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          avatar: currentUser.photoURL,
          uid: currentUser.uid,
          emailVerified: currentUser.emailVerified,
        });
        setIsAuthenticated(true); // Set the flag here
      } else {
        setUser({
          name: "",
          email: "",
          avatar: "default image",
          uid: "",
          emailVerified: false,
        });
        setIsAuthenticated(false); // Set the flag here
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    signInWithGoogle,
    signInEmailPassword,
    isLoading,
    isAuthenticated,
    isVerifying,
    setIsVerifying,
    refreshUser,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default AppContext;
export const useGlobalContext = () => useContext(GlobalContext);
