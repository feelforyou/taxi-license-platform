import { collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebaseConfig";
import { useState, useEffect } from "react";

const Home = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const licensesRef = collection(db, "licenses");

  const getLicenses = async () => {
    try {
      const querySnapshot = await getDocs(licensesRef);
      const licencesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setLicenses(licencesData);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching licenses: ", error);
    }
  };

  useEffect(() => {
    getLicenses();
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <main className="home-main">
        {licenses.map((license) => (
          <div className="card" key={license.id}>
            <h4>License Number: {license.licenseNumber}</h4>
            <p>Issue Date: {license.issueDate}</p>
            <p>Expiry Date: {license.expiryDate}</p>
            <p>License Type: {license.licenseType}</p>
            <p>Price: {license.price}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
