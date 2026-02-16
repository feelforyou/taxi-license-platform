import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import useFirebaseAuth from "../Hooks/FirebaseHooks/useFirebaseAuth";

const GlobalContext = createContext();

const AppContext = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // ტაიმერის ID-ის შესანახად, რათა არ მოხდეს კონფლიქტი სწრაფ გახსნაზე
  const timerRef = useRef(null);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    setModalContent("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const showModal = useCallback(
    (content) => {
      // თუ ძველი ტაიმერი არსებობს, ვასუფთავებთ
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setModalContent(content);
      setModalVisible(true);

      // ვინახავთ ტაიმერის ID-ს რეფერენსში
      timerRef.current = setTimeout(() => {
        hideModal();
      }, 3000);
    },
    [hideModal],
  ); // hideModal არის dependency

  // კომპონენტის მოხსნისას (unmount) ტაიმერის გასუფთავება
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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

  const value = useMemo(
    () => ({
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
    }),
    [
      isModalVisible,
      modalContent,
      showModal,
      hideModal,
      user,
      isLoading,
      isAuthenticated,
      isVerifying,
      signInWithGoogle,
      signInEmailPassword,
      setIsVerifying,
      refreshUser,
    ],
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default AppContext;
export const useGlobalContext = () => useContext(GlobalContext);
