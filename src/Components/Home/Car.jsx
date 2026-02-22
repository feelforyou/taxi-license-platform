import React, { useState } from "react";
import { timestampToDate } from "../../Utilities/timestampToDate";
import styles from "../../Pages/cars.module.css"; // ჩვენი ახალი დიზაინი

const Car = ({ details, onClick }) => {
  const formattedDate = timestampToDate(details?.submissionDate);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className={styles.carCard} onClick={onClick}>
      {/* 1. სურათის ნაწილი შენი Skeleton ლოგიკით */}
      <div style={{ position: "relative", width: "100%", height: "220px" }}>
        {/* თუ სურათი იტვირთება, გამოჩნდეს შენი ძველი skeleton კლასი */}
        {imageLoading && (
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        )}
        <img
          src={details?.imageUrl}
          alt={details?.carName || details?.brand}
          className={styles.carImage}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            e.target.onerror = null;
            e.target.src = "/path/to/default-image.jpg";
          }}
        />
      </div>

      {/* 2. ინფორმაციის ნაწილი ახალი სტილებით */}
      <div className={styles.carInfo}>
        <h3 className={styles.carTitle}>
          {details?.brand} {details?.model}
        </h3>

        <p className={styles.carPrice}>{details?.price}$ / day</p>

        {/* დანარჩენი დეტალები */}
        <p className={styles.carYear}>Year: {details?.year}</p>

        {details?.fuelType && (
          <p
            style={{
              margin: "0.25rem 0",
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            Fuel: {details?.fuelType}
          </p>
        )}

        {details?.location && (
          <p
            style={{
              margin: "0.25rem 0",
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            Location: {details?.location}
          </p>
        )}

        {/* 3. თარიღი (დაბრუნდა!) */}
        {formattedDate && (
          <p
            style={{
              marginTop: "auto",
              fontSize: "0.8rem",
              color: "rgb(83, 71, 161)",
              paddingTop: "0.5rem",
            }}
          >
            added: {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
};

export default Car;
