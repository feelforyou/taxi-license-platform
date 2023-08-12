import { collection, getDocs } from "firebase/firestore";
import { db } from "./Config/firebaseConfig";
import { useState, useEffect } from "react";

function AppOld() {
  const [licenses, setLicenses] = useState([]);

  const licensesRef = collection(db, "licenses");

  const getLicenses = async () => {
    try {
      const querySnapshot = await getDocs(licensesRef);
      const licencesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLicenses(licencesData);
    } catch (error) {
      console.error("Error fetching licenses: ", error);
    }
  };

  useEffect(() => {
    getLicenses();
  }, []);

  return (
    <>
      <main>
        {licenses.map((license) => (
          <div className="card" key={license.id}>
            <p> {license.title}</p>

            <p>{license.price}</p>
          </div>
        ))}
      </main>
    </>
  );
}

export default AppOld;
