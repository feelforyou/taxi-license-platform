import React from "react";

const CarListing = ({ car }) => {
  return (
    <div className="listing-car-card">
      <h4 className="listing-car-title">{car.carName}</h4>
      <img width={250} height={250} src={car.imageUrl} alt={car.carName} />
      <p>
        <strong>Description:</strong> {car.description}
      </p>
      <p>
        <strong>Phone:</strong> {car.phoneNumber}
      </p>
      <p>
        <strong>Price per day:</strong> ${car.price}{" "}
        {/* Assuming price is a number */}
      </p>
      <p>
        <strong>Car Type:</strong> {car.carType}
      </p>
      <p>
        <strong>Location:</strong> {car.location}
      </p>
    </div>
  );
};

export default CarListing;
