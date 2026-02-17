import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../Context/Context";
import { auth } from "../../FirebaseConfig/firebaseConfig";
import styles from "./navbar.module.css";

// Data-დან
import {
  SquareRounded,
  links,
  BurgerMenu,
  CloseIcon,
  // GoogleSignIn - აღარ გვჭირდება აქ, რადგან კომპონენტშია!
} from "../../Data/data";

// კომპონენტები
import UserAvatar from "../UserAvatar/UserAvatar";
import GoogleLoginButton from "../Buttons/GoogleLoginButton"; // <--- ახალი
import SignOutButton from "../Buttons/SignOutButton"; // <--- ახალი

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
    setIsOpen(false); // ლოგინის მერე მენიუ დავხუროთ
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const signOut = () => {
    auth.signOut();
    redirect("/"); // გამოსვლის მერე გადამისამართება
  };

  return (
    <div className={styles.navbar}>
      <Link
        to={"/"}
        className={styles.brandLink}
        onClick={() => window.scrollTo(0, 0)}
      >
        <SquareRounded className={styles.navLogo} />
        <h3>TAXI DRIVER's HUB</h3>
      </Link>

      <div onClick={toggleMenu}>
        {isOpen ? (
          <CloseIcon className={styles.menuIcon} />
        ) : (
          <BurgerMenu className={styles.menuIcon} />
        )}
      </div>

      <div className={`${styles.listContainer} ${isOpen ? styles.show : ""}`}>
        <div className={styles.horizNavbarContainer}>
          <ul className={styles.ul}>
            {links.map((link) => {
              const { id, url, title } = link;
              return (
                <Link
                  key={id}
                  onClick={() => redirect(url)}
                  className={styles.linkHover}
                  to={url}
                >
                  <li className={styles.listItem}>
                    <p>{title}</p>
                  </li>
                </Link>
              );
            })}
          </ul>

          {user.name || user.uid ? (
            <div>
              <div className={styles.userInfo}>
                <div className={styles.loginHorizontalWrapper}>
                  <Link
                    onClick={() => redirect(`/${user.uid}`)}
                    className={`${styles.userAvatarLink} ${styles.linkHover}`}
                    to={`/${user.uid}`}
                  >
                    <UserAvatar src={user?.avatar} />
                    <span className={styles.usernameSpan}>
                      {user.name || user.email}
                    </span>
                  </Link>

                  {/* ახალი ღილაკი: SignOut */}
                  <SignOutButton onClick={signOut} />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.loginContainerNavbar}>
              <li className={styles.navbarLink}>
                <Link
                  onClick={() => redirect("/login")}
                  className={styles.linkHover}
                  to="/login"
                >
                  შესვლა
                </Link>
              </li>

              {/* ახალი ღილაკი: Google Login */}
              <GoogleLoginButton onClick={handleSignIn} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
