import { collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebaseConfig";
import { useState, useEffect } from "react";
import Car from "../Components/Home/Car";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const carsRef = collection(db, "cars");

  const getCars = async () => {
    try {
      const querySnapshot = await getDocs(carsRef);
      const carsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setCars(carsData);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching cars: ", error);
    }
  };

  useEffect(() => {
    getCars();
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
        {cars.map((car) => (
          <Car key={car.id} details={car} />
        ))}
      </main>
    </div>
  );
};

export default Home;
