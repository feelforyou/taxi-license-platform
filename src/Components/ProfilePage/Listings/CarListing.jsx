import React from "react";

const CarListing = ({ car }) => {
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
      {car?.submissionDate && (
        <p className="card-date">{car?.submissionDate}</p>
      )}
    </div>
  );
};

export default CarListing;
