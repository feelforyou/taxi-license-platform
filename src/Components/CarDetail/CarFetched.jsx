import React from "react";
import { timestampToDate } from "../../Utilities/timestampToDate";
import { Link } from "react-router-dom";
import styles from "./carFetched.module.css";

const CarFetched = ({ details }) => {
  const formattedDate = timestampToDate(details?.submissionDate);

  return (
    <div className={styles.cardDetailCarCard}>
      <h2 className={styles.cardDetailCardTitle}>
        {details?.brand} {details?.model}
      </h2>

      {details?.imageUrl && (
        <div className={styles.cardImgContainer}>
          <img
            src={details?.imageUrl}
            alt={details?.brand}
            className={styles.cardDetailCarImage}
          />
        </div>
      )}

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Year:</span>
        <span className={styles.infoValue}>{details?.year}</span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Fuel Type:</span>
        <span className={styles.infoValue}>{details?.fuelType}</span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Mileage:</span>
        <span className={styles.infoValue}>{details?.mileage} KM</span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Daily Rent:</span>
        <span className={`${styles.infoValue} ${styles.priceValue}`}>
          {details?.price}$
        </span>
      </div>

      <div className={styles.infoRow}>
        <span className={styles.infoLabel}>Owner:</span>
        <span className={styles.infoValue}>
          {details?.name} <br />
          <Link
            to={`/owner/${details?.addedByUID?.id}`}
            className={styles.ownerLink}
          >
            View Profile
          </Link>
        </span>
      </div>

      <div className={styles.descriptionContainer}>
        <span className={styles.descriptionLabel}>Description:</span>
        <div className={styles.carFetchedDescription}>
          {details?.description || "No description provided."}
        </div>
      </div>

      {formattedDate && (
        <p className={styles.dateInfo}>Added: {formattedDate}</p>
      )}
    </div>
  );
};

export default CarFetched;
