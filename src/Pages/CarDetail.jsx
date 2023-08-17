import { useParams } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";
import React, { useEffect, useState } from "react";
import { doc } from "firebase/firestore";
import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
import { db } from "../FirebaseConfig/firebaseConfig";
import CarFetched from "../Components/CarDetail/CarFetched";

const CarDetail = () => {
  const { carID } = useParams();
  const { carsList } = useGlobalContext();
  const [carDetails, setCarDetails] = useState(null);

  const carDocRef = doc(db, "cars", carID);
  const { data, loading, error } = useFirestoreDocument(carDocRef);

  useEffect(() => {
    // If carsList has data, find the car from it
    if (carsList.length) {
      const foundCar = carsList.find((item) => item.id === carID);
      setCarDetails(foundCar);
    } else if (data && !loading) {
      // If not found in carsList, use the data fetched by useFirestoreDocument
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
