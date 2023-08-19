import React from "react";
import { DefaultImage } from "../../Data/data";

const CarFetched = ({ details }) => {
  return (
    <div className="carddetail-car-card">
      <h4 className="carddetail-card-title">{details?.brand}</h4>
      {details?.imageUrl ? (
        <img
          src={details?.imageUrl}
          alt={details?.carName}
          className="carddetail-car-image"
        />
      ) : (
        <DefaultImage
          style={{ color: "darkBlue" }}
          className="carddetail-car-image"
        />
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
      {details?.phoneNumber && <p>Phone: {details?.phoneNumber}</p>}
      <p>Description:</p>
      {details?.description && (
        <div className="carfetched-description">{details?.description}</div>
      )}
      {details?.submissionDate && (
        <p className="card-date position-static">
          Added at: {details?.submissionDate}
        </p>
      )}
    </div>
  );
};

export default CarFetched;
