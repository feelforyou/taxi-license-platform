import React from "react";
import { Link } from "react-router-dom";
import {
  links,
  FaceBookIcon,
  TwitterIcon,
  InstagramIcon,
  Messenger,
} from "../../Data/data";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <a
            href="https://www.facebook.com/groups/914945609916304"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Messenger />
          </a>
        </div>

        <div className="footer-nav">
          <h3>Navigation</h3>
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <Link to={link.url}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <ul>
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaceBookIcon size={20} />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon size={20} />
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon size={20} />
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2023 Taxi Driver's Hub. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
