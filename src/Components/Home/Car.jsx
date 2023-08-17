import React from "react";

const Car = ({ details }) => {
  return (
    <div className="car-card">
      <h4 className="card-title">
        {details?.carName && details.carName.length > 15
          ? `${details.carName.substring(0, 15)}...`
          : details?.carName}
      </h4>

      <img
        src={details?.imageUrl}
        alt={details?.carName}
        className="car-image"
      />
      {details?.description && <p>{details?.description}</p>}
      {details?.phoneNumber && (
        <p>
          <strong>Tel:</strong> {details?.phoneNumber}
        </p>
      )}
      {details?.price && (
        <p>
          <strong>Daily Rent:</strong> {details?.price}
        </p>
      )}
      {details?.carType && <p>{details?.carType}</p>}
      {details?.location && <p>{details?.location}</p>}
    </div>
  );
};

export default Car;
