import React from "react";
import {
  FaceBookIcon,
  TwitterIcon,
  InstagramIcon,
  Messenger,
} from "../../Data/data";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-social-container">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaceBookIcon size={40} className="footer-social-icon" />
        </a>

        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon size={40} className="footer-social-icon" />
        </a>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon size={40} className="footer-social-icon" />
        </a>
        <a
          href="https://www.facebook.com/groups/914945609916304"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Messenger size={40} className="footer-social-icon" />
        </a>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Taxi Driver's Hub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
