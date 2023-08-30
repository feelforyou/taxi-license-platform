import React, { useState } from "react";
import { timestampToDate } from "../../../Utilities/timestampToDate";
import { DeleteIcon, EditIcon } from "../../../Data/data";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useGlobalContext } from "../../../Context/Context";
import EditCarModal from "./EditCarModal";

const CarListing = ({ car }) => {
  const { showModal } = useGlobalContext();
  // State for modal visibility and selected car for deletion

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
    <div className="car-card">
      {console.log("carlisting rendered")}
      <h4 className="card-title">{car?.brand && car?.brand}</h4>

      <div className={`card-img-container ${imageLoading ? "skeleton" : ""}`}>
        <img
          src={car?.imageUrl}
          alt={car?.brand}
          className="car-image"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            e.target.onerror = null;
            e.target.src = "/path/to/default-image.jpg";
          }}
        />
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
        <button onClick={handleEditClick} className="icon-button">
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
      {isEditModalOpen && (
        <EditCarModal car={car} onClose={() => setEditModalOpen(false)} />
      )}
    </div>
  );
};

export default CarListing;
