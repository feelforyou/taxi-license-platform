import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleSignIn, SquareRounded, links } from "../../Data/data";
import { BurgerMenu } from "../../Data/data";
import { CloseIcon } from "../../Data/data";
import { useGlobalContext } from "../../Context/Context";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import { UserAvatar } from "../../Data/data";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user, signInWithGoogle } = useGlobalContext();

  const navigate = useNavigate();

  const redirect = (url) => {
    navigate(url);
    window.scrollTo(0, 0);
    setIsOpen(false);
  };

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
      <Link to={"/"} className="Link" onClick={() => window.scrollTo(0, 0)}>
        <SquareRounded className="navlogo" />
        <h3>TAXI DRIVER's HUB</h3>
      </Link>
      <div onClick={toggleMenu}>
        {isOpen ? (
          <CloseIcon className="menu-icon" />
        ) : (
          <BurgerMenu className="menu-icon" />
        )}
      </div>

      <div className={`list-container ${isOpen ? "show" : ""}`}>
        <div className="horiz-navbar-container">
          <ul className="ul">
            {links.map((link) => {
              const { id, url, title } = link;
              return (
                <Link
                  key={id}
                  onClick={() => redirect(url)}
                  className="link-hover"
                  to={url}
                >
                  <li className="list-item">
                    <p>{title}</p>
                  </li>
                </Link>
              );
            })}
          </ul>
          {user.name || user.uid ? (
            <div>
              <div className="user-info">
                <div className="login-horizontal-wrapper">
                  <Link
                    onClick={() => redirect(`/${user.uid}`)}
                    className="user-avatar-link link-hover"
                    to={`/${user.uid}`}
                  >
                    {user.avatar ? (
                      <img
                        src={user?.avatar}
                        alt="User Avatar"
                        className="user-avatar"
                      />
                    ) : (
                      <UserAvatar
                        style={{ color: "lightgreen" }}
                        className="user-avatar"
                      />
                    )}

                    <span className="username-span">
                      {user.name || user.email}
                    </span>
                  </Link>
                  <li
                    onClick={() => {
                      signOut();
                      redirect("/");
                    }}
                    className="sign-out-btn "
                  >
                    <span className="span-hover">Sign Out</span>
                  </li>
                </div>
              </div>
            </div>
          ) : (
            <div className="login-container-navbar">
              <li className="navbar-link">
                <Link
                  onClick={() => redirect("/login")}
                  className="link-hover"
                  to="/login"
                >
                  log in
                </Link>
              </li>
              <li
                className="google-btn"
                onClick={() => {
                  handleSignIn();
                  setIsOpen(false);
                }}
              >
                <GoogleSignIn />
              </li>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
