import { useParams, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { doc } from "firebase/firestore";
import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
import { db } from "../FirebaseConfig/firebaseConfig";
import CarFetched from "../Components/CarDetail/CarFetched";
import styles from "./carDetail.module.css";
import Spinner from "../Components/Spinner/Spinner";

const CarDetail = () => {
  const { carID } = useParams();
  const navigate = useNavigate();
  const carDocRef = useMemo(() => doc(db, "cars", carID), [carID]);
  const { data: carDetails, loading, error } = useFirestoreDocument(carDocRef);

  if (loading) return <Spinner />;
  if (error) return <div>ერორი: {error.message}</div>;

  return (
    <div className={styles.cardDetailContainer}>
      <div className={styles.detailWrapper}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>

        {carDetails ? (
          <CarFetched details={carDetails} />
        ) : (
          <p>Car not found</p>
        )}
      </div>
    </div>
  );
};

export default CarDetail;
