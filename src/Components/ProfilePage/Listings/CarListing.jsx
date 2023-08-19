import React from "react";
import { timestampToDate } from "../../../Utilities/timestampToDate";

const CarListing = ({ car }) => {
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
    </div>
  );
};

export default CarListing;
