import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";

const useFirestoreCollection = (collectionRef) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(fetchedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionRef]);

  return { data, loading, error };
};

export default useFirestoreCollection;
