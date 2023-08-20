import React, { useEffect, useMemo, useState } from "react";
import Car from "../Components/Home/Car";
import { db } from "../FirebaseConfig/firebaseConfig";
import { collection } from "firebase/firestore";
import useFirestoreCollection from "../Hooks/FirebaseHooks/useFirebaseCollection";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";
import { ChevronDown } from "../Data/data";

const Home = () => {
  const [sortField, setSortField] = useState("submissionDate");
  const carsRef = useMemo(() => collection(db, "cars"), []);
  const { data: rawCars, loading, error } = useFirestoreCollection(carsRef);
  const { carsList, setCarsList } = useGlobalContext();

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

  useEffect(() => {
    setCarsList(sortedCars);
  }, [sortedCars]);

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
      <div className="home-filter-container">
        <h1>List of Cars</h1>
        <div className="select-wrapper">
          <select
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
      <main className="home-main">
        {sortedCars.map((car) => (
          <Link key={car.id} to={`/cardetail/${car.id}`}>
            <Car details={car} />
          </Link>
        ))}
      </main>
    </div>
  );
};

export default Home;
