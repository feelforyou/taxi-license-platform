import React from "react";
import styles from "./home.module.css";
import { tesla, mersedes, toyota } from "../Images/index";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/cars");
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <h1>CarRenta</h1>
        {/* პატარა სლოგანი */}
        <p>Your journey starts here.</p>
      </header>

      <section className={styles.homeSection}>
        {/* მთავარი სათაური */}
        <h2>Find Your Perfect Drive</h2>

        {/* აღწერა */}
        <p className={styles.paragraph}>
          Explore our wide selection of premium vehicles and choose the ideal
          ride for your next adventure, business trip, or daily commute.
        </p>

        <div className={styles.carGrid}>
          <div className={styles.carItem}>
            <img src={tesla} alt="tesla" />
            <p>TESLA</p>
          </div>
          <div className={styles.carItem}>
            <img src={mersedes} alt="mersedes" />
            <p>MERCEDES</p> {/* Mercedes-ს 'C'-თი იწერება, გავასწორე 😉 */}
          </div>
          <div className={styles.carItem}>
            <img src={toyota} alt="toyota" />
            <p>TOYOTA</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        {/* Call To Action (CTA) სათაური */}
        <h2 className={styles.headingReady}>Ready to Hit the Road?</h2>

        {/* ღილაკი */}
        <button onClick={redirect} className={styles.rentNowBtn}>
          Rent Now
        </button>
      </section>
    </div>
  );
};

export default Home;
