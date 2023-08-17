// AppContext.js

import React, { createContext, useContext, useState } from "react";
import useFirebaseAuth from "../Hooks/FirebaseHooks/useFirebaseAuth";

const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const {
    user,
    signInWithGoogle,
    signInEmailPassword,
    isLoading,
    isAuthenticated,
    isVerifying,
    setIsVerifying,
    refreshUser,
  } = useFirebaseAuth();

  const [carsList, setCarsList] = useState([]);

  const value = {
    user,
    signInWithGoogle,
    signInEmailPassword,
    isLoading,
    isAuthenticated,
    isVerifying,
    setIsVerifying,
    refreshUser,
    carsList,
    setCarsList,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default AppContext;
export const useGlobalContext = () => useContext(GlobalContext);
