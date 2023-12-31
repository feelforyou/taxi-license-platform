import React, { useState } from "react";
import { timestampToDate } from "../../Utilities/timestampToDate";
import { Link } from "react-router-dom";

const CarFetched = ({ details }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const formattedDate = timestampToDate(details?.submissionDate);
  const editDate = timestampToDate(details?.editedDate);

  return (
    <div className="carddetail-car-card">
      <h4 className="carddetail-card-title">{details?.brand}</h4>
      {details?.imageUrl && (
        <div className={`card-img-container ${imageLoading ? "skeleton" : ""}`}>
          <img
            src={details?.imageUrl}
            alt={details?.carName}
            className="carddetail-car-image"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.target.onerror = null;
              e.target.src = "/path/to/default-image.jpg";
            }}
          />
        </div>
      )}
      <div>
        <span style={{ fontWeight: "bold" }}>
          Model: {details?.model && details?.model}
        </span>

        <span style={{ marginLeft: "0.5rem" }}>
          Year: {details?.year && details?.year}
        </span>
      </div>
      {details?.fuelType && <p>Fuel Type: {details?.fuelType}</p>}
      {details?.mileage && <p>Mileage: {details?.mileage}KM</p>}
      {details?.price && <p>Daily Rent: {details?.price}$</p>}
      {details?.location && <p>Location: {details?.location}</p>}
      {details?.name && <p>Owner's name: {details?.name}</p>}
      <Link to={`/owner/${details?.addedByUID.id}`}>
        <p style={{ color: "darkBlue" }}>View Owner Details</p>
      </Link>
      {details?.phoneNumber && <p>Phone: {details?.phoneNumber}</p>}
      <p>Description:</p>
      {details?.description && (
        <div className="carfetched-description">{details?.description}</div>
      )}
      {formattedDate && (
        <p className="card-date position-static">added: {formattedDate}</p>
      )}
      {editDate && (
        <p className="card-date position-static">updated: {editDate}</p>
      )}
    </div>
  );
};

export default CarFetched;
