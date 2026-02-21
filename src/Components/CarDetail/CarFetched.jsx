// import React, { useState } from "react";
// import { timestampToDate } from "../../Utilities/timestampToDate";
// import { Link } from "react-router-dom";
// // დავაიმპორტოთ ჩვენი CSS მოდული (გზა შეამოწმე შენი სტრუქტურის მიხედვით)
// import styles from "./carFetched.module.css";

// const CarFetched = ({ details }) => {
//   const [imageLoading, setImageLoading] = useState(true);
//   const formattedDate = timestampToDate(details?.submissionDate);
//   const editDate = timestampToDate(details?.editedDate);

//   return (
//     <div className={styles.cardDetailCarCard}>
//       <h4 className={styles.cardDetailCardTitle}>{details?.brand}</h4>

//       {details?.imageUrl && (
//         <div
//           className={`${styles.cardImgContainer} ${imageLoading ? styles.skeleton : ""}`}
//         >
//           <img
//             src={details?.imageUrl}
//             alt={details?.carName}
//             className={styles.cardDetailCarImage}
//             onLoad={() => setImageLoading(false)}
//             onError={(e) => {
//               setImageLoading(false);
//               e.target.onerror = null;
//               e.target.src = "/path/to/default-image.jpg"; // Default სურათის გზა
//             }}
//           />
//         </div>
//       )}

//       <div>
//         <span style={{ fontWeight: "bold" }}>
//           Model: {details?.model && details?.model}
//         </span>
//         <span style={{ marginLeft: "0.5rem" }}>
//           Year: {details?.year && details?.year}
//         </span>
//       </div>

//       {details?.fuelType && <p>Fuel Type: {details?.fuelType}</p>}
//       {details?.mileage && <p>Mileage: {details?.mileage}KM</p>}
//       {details?.price && <p>Daily Rent: {details?.price}$</p>}
//       {details?.location && <p>Location: {details?.location}</p>}
//       {details?.name && <p>Owner's name: {details?.name}</p>}

//       <Link to={`/owner/${details?.addedByUID?.id}`}>
//         <p
//           style={{ color: "darkBlue", fontWeight: "bold", marginTop: "0.5rem" }}
//         >
//           View Owner Details
//         </p>
//       </Link>

//       {details?.phoneNumber && <p>Phone: {details?.phoneNumber}</p>}

//       <p style={{ marginTop: "1rem", fontWeight: "bold" }}>Description:</p>
//       {details?.description && (
//         <div className={styles.carFetchedDescription}>
//           {details?.description}
//         </div>
//       )}

//       {formattedDate && (
//         <p className={`${styles.cardDate} ${styles.positionStatic}`}>
//           added: {formattedDate}
//         </p>
//       )}
//       {editDate && (
//         <p className={`${styles.cardDate} ${styles.positionStatic}`}>
//           updated: {editDate}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CarFetched;

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
