import React, { useMemo, useState } from "react";
import Car from "../Components/Home/Car";
import { db } from "../FirebaseConfig/firebaseConfig";
import { collection } from "firebase/firestore";
import useFirestoreCollection from "../Hooks/FirebaseHooks/useFirebaseCollection";
import { useNavigate } from "react-router-dom";
import { AddCar, ChevronDown } from "../Data/data";
import { auth } from "../FirebaseConfig/firebaseConfig";

const CarsForRent = () => {
  const [sortField, setSortField] = useState("submissionDate");

  const carsRef = useMemo(() => collection(db, "cars"), []);
  const { data: rawCars, loading, error } = useFirestoreCollection(carsRef);
  const navigate = useNavigate();

  //scroll to the top of a page when navigated to the car page
  const handleCarClick = (carId) => {
    navigate(`/cardetail/${carId}`);
    window.scrollTo(0, 0);
  };

  const redirect = () => {
    navigate(`/${auth?.currentUser?.uid}/upload`);
    window.scrollTo(0, 0);
  };

  // Sort data on client side
  const sortedCars = rawCars.sort((a, b) => {
    switch (sortField) {
      case "submissionDate":
        return b.submissionDate.toMillis() - a.submissionDate.toMillis();
      case "price":
        return b.price - a.price;
      case "year":
        return b.year - a.year;
      default:
        return 0;
    }
  });

  const handleSortChange = (selectedField) => {
    setSortField(selectedField);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="carsrent-container">
      <div className="carsrent-filter-container">
        <header className="addcar-container">
          <h1>New Cars</h1>
          <button className="addcar-btn" onClick={redirect}>
            Add Car <AddCar />
          </button>
        </header>

        <div className="select-wrapper">
          <select
            id="sort-cars"
            className="custom-select"
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="submissionDate">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="year">Sort by Year</option>
          </select>
          <ChevronDown className="select-chevron" />
        </div>
      </div>
      <main className="carsrent-main">
        {sortedCars.map((car) => (
          <div key={car.id} onClick={() => handleCarClick(car.id)}>
            <Car details={car} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default CarsForRent;
