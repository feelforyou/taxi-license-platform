import React from "react";

const Car = ({ details }) => {
  return (
    <div className="car-card">
      <h4>{details.carName}</h4>
      <img src={details.imageUrl} alt={details.carName} className="car-image" />
      <p>
        <strong>Description:</strong> {details.description}
      </p>
      <p>
        <strong>Phone:</strong> {details.phoneNumber}
      </p>
      <p>
        <strong>Price per day:</strong> {details.price}
      </p>
      <p>
        <strong>Car Type:</strong> {details.carType}
      </p>
      <p>
        <strong>Location:</strong> {details.location}
      </p>
    </div>
  );
};

export default Car;
