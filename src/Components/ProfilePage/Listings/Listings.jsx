import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import CarListing from "./CarListing";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useGlobalContext();

  useEffect(() => {
    if (user && user.uid) {
      const carsRef = collection(db, "cars");
      const q = query(carsRef, where("addedByUID", "==", user.uid));

      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => doc.data());
          setListings(data);
        } catch (error) {
          console.error("Error fetching user listings: ", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="listing-car-container">
      {listings.length > 0 ? (
        listings.map((car, index) => <CarListing key={index} car={car} />)
      ) : (
        <p>You haven't listed any cars yet.</p>
      )}
    </div>
  );
};

export default Listings;
