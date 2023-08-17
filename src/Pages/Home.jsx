import React, { useEffect } from "react";
import Car from "../Components/Home/Car";
import { db } from "../FirebaseConfig/firebaseConfig";
import { collection } from "firebase/firestore";
import useFirestoreCollection from "../Hooks/FirebaseHooks/useFirebaseCollection";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";

const Home = () => {
  const carsRef = collection(db, "cars");
  const { data: cars, loading, error } = useFirestoreCollection(carsRef);
  const { carsList, setCarsList } = useGlobalContext();

  useEffect(() => {
    if (cars) {
      setCarsList(cars);
    }
  }, [cars]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="home-container">
      <div className="test-div-home">
        <h1>filter categories</h1>
        <p>sub heading</p>
      </div>
      <main className="home-main">
        {cars?.map((car) => (
          <Link key={car.id} to={`/cardetail/${car.id}`}>
            <Car details={car} />
          </Link>
        ))}
      </main>
    </div>
  );
};

export default Home;
