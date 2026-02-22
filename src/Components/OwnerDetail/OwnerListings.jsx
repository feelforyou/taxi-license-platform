import React from "react";
import { useNavigate } from "react-router-dom";
import useUserListings from "../../Hooks/FirebaseHooks/useUserListings";
// ✅ ვაიმპორტებთ მთავარი გვერდის გრიდის სტილებს
import gridStyles from "../../pages/cars.module.css";
// ✅ ვაიმპორტებთ ჩვენს უნივერსალურ Car კომპონენტს
import Car from "../../Components/Home/Car";

const OwnerListings = ({ ownerID }) => {
  const { listings, loading, error } = useUserListings(ownerID);
  const navigate = useNavigate();

  const handleCarClick = (carId) => {
    window.scrollTo(0, 0);
    navigate(`/cardetail/${carId}`);
  };

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Listed Cars:
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center" }}>
          Error: {error.message}
        </div>
      ) : listings.length > 0 ? (
        /* ✅ აქ ვიყენებთ carsRentMain-ს ულამაზესი ბადის (გრიდის) შესაქმნელად */
        <div className={gridStyles.carsRentMain}>
          {listings.map((car) => (
            /* ✅ აქ კი ვიყენებთ ჩვენს უნივერსალურ Car ბარათს */
            <Car
              key={car.id}
              details={car}
              onClick={() => handleCarClick(car.id)}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", fontSize: "1.1rem" }}>
          This owner hasn't listed any cars yet.
        </p>
      )}
    </div>
  );
};

export default OwnerListings;
