import React from "react";
import { useGlobalContext } from "../../../Context/Context";
import CarListing from "./CarListing";
import useUserListings from "../../../Hooks/FirebaseHooks/useUserListings";
import Spinner from "../../Spinner/Spinner"; // ✅ შემოვიტანეთ ჩვენი სპინერი
import styles from "./listings.module.css"; // ✅ შემოვიტანეთ სტილები

const Listings = () => {
  const { user } = useGlobalContext();
  const { listings, loading, error } = useUserListings(user?.uid);

  // ✅ გამოვიყენეთ ახალი სპინერი ძველი დივის მაგივრად
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className={styles.emptyMessage}>Error fetching listings</div>;
  }

  return (
    <div className={styles.listingsContainer}>
      {listings.length > 0 ? (
        listings.map((car) => <CarListing key={car.id} car={car} />)
      ) : (
        <p className={styles.emptyMessage}>You haven't listed any cars yet.</p>
      )}
    </div>
  );
};

export default Listings;
