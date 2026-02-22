import React from "react";
import styles from "./footer.module.css"; // დავრწმუნდეთ რომ სწორი გზაა
import {
  FaceBookIcon,
  TwitterIcon,
  InstagramIcon,
  Messenger,
} from "../../Data/data";

const Footer = () => {
  // ავტომატურად იღებს მიმდინარე წელს
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.socialContainer}>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Facebook"
        >
          <FaceBookIcon size={24} className={styles.socialIcon} />
        </a>

        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Twitter"
        >
          <TwitterIcon size={24} className={styles.socialIcon} />
        </a>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Instagram"
        >
          <InstagramIcon size={24} className={styles.socialIcon} />
        </a>

        <a
          href="https://www.facebook.com/groups/914945609916304"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          aria-label="Messenger Group"
        >
          <Messenger size={24} className={styles.socialIcon} />
        </a>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {currentYear} Taxi Driver's Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
