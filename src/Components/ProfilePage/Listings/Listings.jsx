import React from "react";
import { useGlobalContext } from "../../../Context/Context";
import CarListing from "./CarListing";
import useUserListings from "../../../Hooks/FirebaseHooks/useUserListings";

const Listings = () => {
  const { user } = useGlobalContext();
  const { listings, loading, error } = useUserListings(user?.uid);

  if (loading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div>Error fetching listings</div>;
  }

  return (
    <div className="listing-car-container">
      {listings.length > 0 ? (
        listings.map((car) => <CarListing key={car.id} car={car} />)
      ) : (
        <p>You haven't listed any cars yet.</p>
      )}
    </div>
  );
};

export default Listings;
