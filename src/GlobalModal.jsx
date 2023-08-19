import React from "react";
import { useGlobalContext } from "./Context/Context";

const GlobalModal = () => {
  const { isModalVisible, modalContent, hideModal } = useGlobalContext();

  if (!isModalVisible) return null;

  return (
    <div className="modal-overlay" onClick={hideModal}>
      <div className="modal-content">{modalContent}</div>
    </div>
  );
};

export default GlobalModal;
