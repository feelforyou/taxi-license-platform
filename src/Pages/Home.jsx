import React from "react";
import { tesla, mersedes, toyota } from "../Images/index";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/cars");
    window.scrollTo(0, 0);
  };
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>CarRenta</h1>
        <p>Your journey starts here.</p>
      </header>

      <section className="home-section">
        <h2>Explore Our Fleet</h2>
        <p className="paragraph">
          Browse through our wide selection of vehicles and pick the one that's
          perfect for you.
        </p>

        <div className="car-grid">
          <div className="car-item">
            <img src={tesla} alt="tesla" />
            <p>TESLA</p>
          </div>
          <div className="car-item">
            <img src={mersedes} alt="mersedes" />
            <p>MERSEDES</p>
          </div>
          <div className="car-item">
            <img src={toyota} alt="toyota" />
            <p>TOYOTA</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2 className="heading-ready">Ready to hit the road?</h2>

        <button onClick={redirect} className="rent-now-btn">
          Rent Now
        </button>
      </section>
    </div>
  );
};

export default Home;
