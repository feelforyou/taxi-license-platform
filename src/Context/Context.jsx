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

// სახელი შევცვალეთ AppProvider-ით, რაც უფრო სტანდარტულია
const AppProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const timerRef = useRef(null);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    setModalContent("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null; // რეფერენსის გასუფთავება
    }
  }, []);

  const showModal = useCallback(
    (content, duration = 3000) => {
      // დრო პარამეტრად გავიტანეთ (default 3000)
      // თუ ტაიმერი უკვე ჩართულია, ვასუფთავებთ
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setModalContent(content);
      setModalVisible(true);

      timerRef.current = setTimeout(() => {
        hideModal();
      }, duration);
    },
    [hideModal],
  );

  // Unmount-ის დროს ტაიმერის გასუფთავება
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Auth მონაცემების წამოღება
  const authData = useFirebaseAuth();

  const value = useMemo(
    () => ({
      isModalVisible,
      modalContent,
      showModal,
      hideModal,
      ...authData, // პირდაპირ ვშლით ობიექტს, უფრო სუფთაა
    }),
    [
      isModalVisible,
      modalContent,
      showModal,
      hideModal,
      authData, // მთლიანი ობიექტი დავამატეთ დიპენდენსებში
    ],
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default AppProvider; // Export სახელი შეიცვალა

// ჰუკი უცვლელია
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AppProvider");
  }
  return context;
};
