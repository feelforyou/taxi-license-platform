// OwnerListings.jsx

import React from "react";
import useUserListings from "../../Hooks/FirebaseHooks/useUserListings";
import Car from "../../Components/Home/Car";
import { useNavigate } from "react-router-dom";

const OwnerListings = ({ ownerID }) => {
  const { listings, loading, error } = useUserListings(ownerID);
  const navigate = useNavigate(); // Step 2

  const handleCarClick = (carId) => {
    // Scroll to the top
    window.scrollTo(0, 0);
    // Navigate to the car detail page
    navigate(`/cardetail/${carId}`);
  };
  return (
    <div className="owner-cars">
      <h2>Owner's Cars:</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      ) : error ? (
        <div>Error fetching cars: {error.message}</div>
      ) : listings.length ? (
        <main className="carsrent-main">
          {listings.map((car) => (
            <div key={car.id} onClick={() => handleCarClick(car.id)}>
              <Car details={car} />
            </div>
          ))}
        </main>
      ) : (
        <p>This owner hasn't listed any cars yet.</p>
      )}
    </div>
  );
  // return (
  //   <div className="owner-cars">
  //     <h3>Owner's Cars:</h3>
  //     {loading ? (
  //       <div className="loading-container">
  //         <div className="loading"></div>
  //       </div>
  //     ) : error ? (
  //       <div>Error fetching cars: {error.message}</div>
  //     ) : listings.length ? (
  //       listings.map((car) => (
  //         // Step 3
  //         <div key={car.id} onClick={() => handleCarClick(car.id)}>
  //           <Car details={car} />
  //         </div>
  //       ))
  //     ) : (
  //       <p>This owner hasn't listed any cars yet.</p>
  //     )}
  //   </div>
  // );
};

export default OwnerListings;
