import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";

const useFirestoreDocument = (docRef) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists) {
          setData({ id: docSnapshot.id, ...docSnapshot.data() });
          console.log("useFirestoreDocument:", docSnapshot);
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [docRef]);

  return { data, loading, error };
};

export default useFirestoreDocument;
