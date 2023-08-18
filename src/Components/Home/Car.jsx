import React from "react";

const Car = ({ details }) => {
  return (
    <div className="car-card">
      <h4 className="card-title">{details?.brand && details?.brand}</h4>
      <img
        src={details?.imageUrl}
        alt={details?.carName}
        className="car-image"
      />
      <div>
        <span style={{ fontWeight: "bold" }}>
          {details?.model && details?.model}
        </span>

        <span style={{ marginLeft: "0.5rem" }}>
          {details?.year && details?.year}
        </span>
      </div>
      {details?.fuelType && <p>{details?.fuelType}</p>}

      {details?.price && <p>Daily Rent: {details?.price}$</p>}
      {details?.location && <p>{details?.location}</p>}
      {details?.submissionDate && (
        <p className="card-date">{details?.submissionDate}</p>
      )}
    </div>
  );
};

export default Car;
