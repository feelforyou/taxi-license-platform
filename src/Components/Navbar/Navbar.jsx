import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignIn, links } from "../../Data/data";
import navLogo from "../../assets/yellow.png";
import { BurgerMenu } from "../../Data/data";
import { CloseIcon } from "../../Data/data";
import { useGlobalContext } from "../../Context/Context";
import { auth } from "../../FirebaseConfig/firebaseConfig"; // Adjust the path
import { DefaultAvatar } from "../../Data/data";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, signInWithGoogle } = useGlobalContext();

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result && result.user) {
      navigate(`/${result.user.uid}`);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <div className="navbar">
      <Link to={"/"} className="Link">
        <h3>TAXI DRIVER's HUB</h3>
        <img className="navlogo" src={navLogo} alt="Taxi Logo" />
      </Link>
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? (
          <CloseIcon
            style={{ fontWeight: "600" }}
            size={35}
            color="whitesmoke"
          />
        ) : (
          <BurgerMenu size={30} color="white" />
        )}
      </div>
      <div className={`list-container ${isOpen ? "show" : ""}`}>
        <ul className="ul">
          {links.map((link) => {
            const { id, url, title } = link;
            return (
              <li key={id} className="list-item">
                <Link to={url}>
                  <p>{title}</p>
                </Link>
              </li>
            );
          })}

          {user.name ? (
            <>
              {/* <div className="navbar-link">
                <Link to={`/${user.uid}`}>კაბინეტი</Link>
              </div> */}
              <li className="user-info">
                <img
                  src={user?.avatar || { DefaultAvatar }}
                  alt="User Avatar"
                  className="user-avatar"
                />
                <Link to={`/${user.uid}`}>
                  <span>{user.name}</span>
                </Link>
              </li>
              <li onClick={signOut} className="sign-out-btn">
                Sign Out
              </li>
            </>
          ) : (
            <>
              <li className="navbar-link">
                <Link to="/login">შესვლა</Link>
              </li>
              <li className="google-btn" onClick={handleSignIn}>
                <GoogleSignIn />
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
