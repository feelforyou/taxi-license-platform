import React from "react";
import { auth } from "./Config/firebaseConfig";
import { signOut as firebaseSignOut } from "firebase/auth"; // Rename the imported signOut function

const SignOut = () => {
  const handleSignOut = async () => {
    // Renamed the function for clarity
    try {
      await firebaseSignOut(auth);
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ); // Adjusted the onClick to use handleSignOut
};

export default SignOut;
