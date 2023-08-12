import React, { useState, useEffect } from "react";
import GoogleButton from "react-google-button";

import { auth } from "./Config/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const SignInGoogle = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const googleProvider = new GoogleAuthProvider(); // Use `new` to create an instance
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
  useEffect(() => {
    // Set up the onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
          avatar: currentUser.photoURL,
        });
      } else {
        setUser({ name: "", email: "", avatar: "" });
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <GoogleButton onClick={signInWithGoogle} />
    </div>
  );
};

export default SignInGoogle;
