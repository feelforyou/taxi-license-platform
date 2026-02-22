import React, { useState } from "react";
import { timestampToDate } from "../../../Utilities/timestampToDate";
import { DeleteIcon, EditIcon } from "../../../Data/data";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../../../Context/Context";
import EditCarModal from "./EditCarModal";
import styles from "./carListing.module.css"; // ✅ სტილები

const CarListing = ({ car }) => {
  const { showModal } = useGlobalContext();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  const deleteCar = async (id) => {
    try {
      const docRef = doc(db, "cars", id);
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        console.error("Document does not exist!");
        return;
      }
      await deleteDoc(docRef);
      showModal("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedCarId(id);
    setDeleteModalOpen(true);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCarId) {
      deleteCar(selectedCarId);
      setSelectedCarId(null);
    }
    setDeleteModalOpen(false);
  };

  const formattedDate = timestampToDate(car?.submissionDate);

  return (
    <>
      <div className={styles.card}>
        {/* სურათი */}
        <div
          className={`${styles.imageContainer} ${
            imageLoading ? "skeleton" : ""
          }`}
        >
          <img
            src={car?.imageUrl}
            alt={car?.brand}
            className={styles.carImage}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.target.onerror = null;
              e.target.src = "/path/to/default-image.jpg";
            }}
          />
        </div>

        {/* კონტენტი */}
        <div className={styles.content}>
          <h4 className={styles.title}>
            {car?.brand} {car?.model}
          </h4>
          <p className={styles.subtitle}>Year: {car?.year}</p>

          {car?.fuelType && (
            <p className={styles.detail}>Fuel: {car?.fuelType}</p>
          )}
          {car?.location && (
            <p className={styles.detail}>Location: {car?.location}</p>
          )}

          {car?.price && (
            <p className={styles.price}>Daily Rent: {car?.price}$</p>
          )}

          {formattedDate && (
            <p className={styles.date}>Added: {formattedDate}</p>
          )}
        </div>

        {/* ღილაკები */}
        <div className={styles.actions}>
          <button
            onClick={handleEditClick}
            className={`${styles.actionBtn} ${styles.editBtn}`}
          >
            <EditIcon />
            UPDATE
          </button>
          <button
            onClick={() => handleDeleteClick(car.id)}
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
          >
            <DeleteIcon />
            DELETE
          </button>
        </div>
      </div>

      {/* 💥 მოდალები ახლა ბარათის გარეთ არის 💥 */}

      {/* წაშლის მოდალი */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p className={styles.modalText}>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit მოდალი */}
      {isEditModalOpen && (
        <EditCarModal car={car} onClose={() => setEditModalOpen(false)} />
      )}
    </>
  );
};

export default CarListing;
