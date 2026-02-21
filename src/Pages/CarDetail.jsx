// import { useParams } from "react-router-dom";
// import React, { useMemo } from "react";
// import { doc } from "firebase/firestore";
// import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
// import { db } from "../FirebaseConfig/firebaseConfig";
// import CarFetched from "../Components/CarDetail/CarFetched";
// import styles from "./carDetail.module.css"; // ✅ აი, ეს გვაკლდა!

// const CarDetail = () => {
//   const { carID } = useParams();

//   const carDocRef = useMemo(() => doc(db, "cars", carID), [carID]);

//   const { data: carDetails, loading, error } = useFirestoreDocument(carDocRef);

//   if (error) {
//     console.error("Error fetching car:", error);
//     return <div>Error loading car details</div>;
//   }

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading"></div>
//       </div>
//     );
//   }

//   return (
//     // ✅ აქ ძველი ტექსტის მაგივრად ვიყენებთ styles ობიექტს
//     <div className={styles.cardDetailContainer}>
//       <CarFetched details={carDetails} />
//     </div>
//   );
// };

// export default CarDetail;
import { useParams, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { doc } from "firebase/firestore";
import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
import { db } from "../FirebaseConfig/firebaseConfig";
import CarFetched from "../Components/CarDetail/CarFetched";
import styles from "./carDetail.module.css";

const CarDetail = () => {
  const { carID } = useParams();
  const navigate = useNavigate();
  const carDocRef = useMemo(() => doc(db, "cars", carID), [carID]);
  const { data: carDetails, loading, error } = useFirestoreDocument(carDocRef);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  if (error) return <div>ერორი: {error.message}</div>;

  return (
    <div className={styles.cardDetailContainer}>
      <div className={styles.detailWrapper}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← უკან დაბრუნება
        </button>

        {carDetails ? (
          <CarFetched details={carDetails} />
        ) : (
          <p>მანქანა ვერ მოიძებნა</p>
        )}
      </div>
    </div>
  );
};

export default CarDetail;
