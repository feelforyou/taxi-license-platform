import React, { useMemo, useState } from "react";
import styles from "./cars.module.css";
import { db } from "../FirebaseConfig/firebaseConfig";
import { collection } from "firebase/firestore";
import useFirestoreCollection from "../Hooks/FirebaseHooks/useFirebaseCollection";
import { useNavigate } from "react-router-dom";
import { AddCar } from "../Data/data";
import { auth } from "../FirebaseConfig/firebaseConfig";
// ✅ დავაიმპორტეთ ჩვენი უნივერსალური Car კომპონენტი
import Car from "../Components/Home/Car";

const CarsForRent = () => {
  const [sortField, setSortField] = useState("submissionDate");
  const carsRef = useMemo(() => collection(db, "cars"), []);
  const { data: rawCars, loading, error } = useFirestoreCollection(carsRef);
  const navigate = useNavigate();

  const handleCarClick = (carId) => {
    navigate(`/cardetail/${carId}`);
    window.scrollTo(0, 0);
  };

  const redirect = () => {
    navigate(`/${auth?.currentUser?.uid}/upload`);
    window.scrollTo(0, 0);
  };

  const sortedCars = useMemo(() => {
    if (!rawCars) return [];
    return [...rawCars].sort((a, b) => {
      switch (sortField) {
        case "submissionDate":
          return b.submissionDate?.toMillis() - a.submissionDate?.toMillis();
        case "price":
          return b.price - a.price;
        case "year":
          return b.year - a.year;
        default:
          return 0;
      }
    });
  }, [rawCars, sortField]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  if (error) return <div>ერორი: {error.message}</div>;

  return (
    <div className={styles.carsRentContainer}>
      <div className={styles.carsRentFilterContainer}>
        <header className={styles.addCarContainer}>
          <h1>New Arrivals</h1>
          <button className={styles.addCarBtn} onClick={redirect}>
            Add Car <AddCar />
          </button>
        </header>

        <div className={styles.selectWrapper}>
          <select
            className={styles.customSelect}
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="submissionDate">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
      </div>

      <main className={styles.carsRentMain}>
        {/* ✅ აქ გამოვიძახეთ Car კომპონენტი და გადავაწოდეთ მონაცემები */}
        {sortedCars.map((car) => (
          <Car
            key={car.id}
            details={car}
            onClick={() => handleCarClick(car.id)}
          />
        ))}
      </main>
    </div>
  );
};

export default CarsForRent;
