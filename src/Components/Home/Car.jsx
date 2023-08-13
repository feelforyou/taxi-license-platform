import React from "react";

const Car = ({ details }) => {
  return (
    <div className="car-card">
      <h4 className="card-title">{details?.carName}</h4>
      <img
        src={details?.imageUrl}
        alt={details?.carName}
        className="car-image"
      />
      <p>
        <strong></strong> {details?.description}
      </p>
      <p>
        <strong>Tel:</strong> {details?.phoneNumber}
      </p>
      <p>
        <strong>Daily Rent:</strong> {details?.price}
      </p>
      <p>
        <strong></strong> {details?.carType}
      </p>
      <p>
        <strong></strong> {details?.location}
      </p>
    </div>
  );
};

export default Car;
