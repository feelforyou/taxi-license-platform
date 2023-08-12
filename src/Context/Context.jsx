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
} from "firebase/auth";

const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    uid: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        });
      }
      return result; // return the result to handle redirection in the invoking component
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
        });
        setIsAuthenticated(true); // Set the flag here
      } else {
        setUser({ name: "", email: "", avatar: "default image", uid: "" });
        setIsAuthenticated(false); // Set the flag here
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    signInWithGoogle,
    isLoading,
    isAuthenticated,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default AppContext;
export const useGlobalContext = () => useContext(GlobalContext);
