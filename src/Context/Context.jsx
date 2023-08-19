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
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
    setTimeout(() => {
      hideModal();
    }, 3000);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent("");
  };

  const value = {
    isModalVisible,
    modalContent,
    showModal,
    hideModal,
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
