import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to delete this document?</p>
        <div className="modal-actions">
          <button className="modal-btn" onClick={onClose}>
            Cancel
          </button>
          <button onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
