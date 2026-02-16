import { useParams } from "react-router-dom";
import React, { useMemo } from "react"; // ამოვიღეთ useState და useEffect
import { doc } from "firebase/firestore";
import useFirestoreDocument from "../Hooks/FirebaseHooks/useFirestoreDocument";
import { db } from "../FirebaseConfig/firebaseConfig";
import CarFetched from "../Components/CarDetail/CarFetched";

const CarDetail = () => {
  const { carID } = useParams();

  // ამოვიღეთ: const [carDetails, setCarDetails] = useState(null);

  const carDocRef = useMemo(() => doc(db, "cars", carID), [carID]);

  // ✅ ოპტიმიზაცია: data-ს პირდაპირ ვარქმევთ carDetails-ს (Destructuring alias)
  // ჰუკიდან მოსული data არის შენი "სთეითი", მისი კოპირება აღარ გინდა.
  const { data: carDetails, loading, error } = useFirestoreDocument(carDocRef);

  // ამოვიღეთ მთლიანი useEffect.
  // ის მხოლოდ იმისთვის იყო, რომ data გადაეწერა carDetails-ში, რაც ზედმეტია.

  if (error) {
    console.error("Error fetching car:", error);
    return <div>Error loading car details</div>;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="carddetail-container">
      {/* პირდაპირ გადააწოდე ჰუკიდან მოსული carDetails */}
      <CarFetched details={carDetails} />
    </div>
  );
};

export default CarDetail;
