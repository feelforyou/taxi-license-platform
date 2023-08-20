import React, { useState } from "react";
import { timestampToDate } from "../../../Utilities/timestampToDate";
import { DeleteIcon, EditIcon } from "../../../Data/data";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../../../Context/Context";

const CarListing = ({ car }) => {
  const { showModal } = useGlobalContext();

  // State for modal visibility and selected car for deletion
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);

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

  const handleConfirmDelete = () => {
    if (selectedCarId) {
      deleteCar(selectedCarId);
      setSelectedCarId(null);
    }
    setDeleteModalOpen(false);
  };

  const formattedDate = timestampToDate(car?.submissionDate);

  return (
    <div className="car-card">
      <h4 className="card-title">{car?.brand && car?.brand}</h4>

      <div className="card-img-container">
        <img src={car?.imageUrl} alt={car?.brand} className="car-image" />
      </div>

      <div>
        <span style={{ fontWeight: "bold" }}>{car?.model && car?.model}</span>

        <span style={{ marginLeft: "0.5rem" }}>{car?.year && car?.year}</span>
      </div>
      {car?.fuelType && <p>{car?.fuelType}</p>}
      {car?.price && <p>Daily Rent: {car?.price}$</p>}
      {car?.location && <p>{car?.location}</p>}
      {formattedDate && <p className="card-date">{formattedDate}</p>}
      <div className="dlt-upd-btn-container">
        <button className="icon-button">
          <EditIcon />
          UPDATE
        </button>
        <button
          onClick={() => handleDeleteClick(car.id)}
          className="icon-button delete-btn"
        >
          <DeleteIcon />
          DELETE
        </button>
      </div>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete this document?</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button onClick={handleConfirmDelete}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarListing;
