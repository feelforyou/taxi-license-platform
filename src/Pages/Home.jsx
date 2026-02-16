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
        <h2>იპოვე შენი სასურველი მანქანა</h2>
        <p className="paragraph">
          დაათვალიერეთ ავტომობილების ფართო არჩევანი და შეარჩიეთ ის, რომელიც
          თქვენთვის იდეალურია.
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
        <h2 className="heading-ready">ეძებ სანდო მანქანას?</h2>

        <button onClick={redirect} className="rent-now-btn">
          იქირავე
        </button>
      </section>
    </div>
  );
};

export default Home;
