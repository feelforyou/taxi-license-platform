import { useParams } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";
import React, { useEffect, useMemo, useState } from "react";
import { doc } from "firebase/firestore";
import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
import { db } from "../FirebaseConfig/firebaseConfig";
import CarFetched from "../Components/CarDetail/CarFetched";

const CarDetail = () => {
  const { carID } = useParams();
  const { carsList } = useGlobalContext();
  const [carDetails, setCarDetails] = useState(null);

  const carDocRef = useMemo(() => doc(db, "cars", carID), [carID]);

  // Conditional fetching
  const shouldFetch = !carsList.some((car) => car.id === carID);
  const { data, loading, error } = shouldFetch
    ? useFirestoreDocument(carDocRef)
    : {};

  useEffect(() => {
    // Check carsList for the car
    const carFromList = carsList.find((item) => item.id === carID);

    if (carFromList) {
      setCarDetails(carFromList);
    } else if (data && !loading) {
      // If not found in carsList and data is available, use it
      setCarDetails(data);
    }
  }, [carID, carsList, data, loading]);

  if (error) {
    console.error("Error fetching car:", error);
    return <div>Error loading car details</div>;
  }

  return (
    <div className="carddetail-container">
      <CarFetched details={carDetails} />
    </div>
  );
};

export default CarDetail;
