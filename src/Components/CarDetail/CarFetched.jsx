import React from "react";

const CarFetched = ({ details }) => {
  return (
    <div className="carddetail-car-card">
      <h4 className="carddetail-card-title">{details?.carName}</h4>
      <img
        src={details?.imageUrl}
        alt={details?.carName}
        className="carddetail-car-image"
      />
      {details?.description && <p>{details?.description}</p>}
      {details?.phoneNumber && (
        <p>
          <strong className="carddetail-strong">Tel:</strong>{" "}
          {details?.phoneNumber}
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

export default CarFetched;
