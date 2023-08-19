import React from "react";
import { timestampToDate } from "../../Utilities/timestampToDate";

const Car = ({ details }) => {
  const formattedDate = timestampToDate(details?.submissionDate);
  return (
    <div className="car-card">
      <h4 className="card-title">{details?.brand && details?.brand}</h4>
      <div className="card-img-container">
        <img
          src={details?.imageUrl}
          alt={details?.carName}
          className="car-image"
        />
      </div>

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
      <p className="moreInfo">MORE INFO</p>
      {formattedDate && <p className="card-date">{formattedDate}</p>}
    </div>
  );
};

export default Car;
