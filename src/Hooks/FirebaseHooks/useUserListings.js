import { useState, useEffect } from "react";
import { db } from "../../FirebaseConfig/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const useUserListings = (uid) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (uid) {
      const carsRef = collection(db, "cars");
      const q = query(
        carsRef,
        where("addedByUID", "==", uid),
        orderBy("submissionDate", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setListings(data);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
          console.error("Error fetching user listings: ", err);
        }
      );

      // This will unsubscribe from the snapshot listener when the component using the hook unmounts
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [uid]);

  return { listings, loading, error };
};

export default useUserListings;
