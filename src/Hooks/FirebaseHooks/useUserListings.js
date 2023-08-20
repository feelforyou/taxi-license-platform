import { useState, useEffect } from "react";
import { db } from "../../FirebaseConfig/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

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
        orderBy("submissionDate", "desc") // Chain the orderBy to the query
      );

      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setListings(data);
          console.log("useUserListings", data);
        } catch (err) {
          setError(err);
          console.error("Error fetching user listings: ", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [uid]);

  return { listings, loading, error };
};

export default useUserListings;
