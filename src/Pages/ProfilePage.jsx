import React from "react";
import Tabs from "../Components/ProfilePage/Tabs";
import styles from "./profile.module.css"; // შემოდის სტილი

const ProfilePage = ({ activeTab }) => {
  return (
    <div className={styles.profileContainer}>
      <Tabs initialTab={activeTab} />
    </div>
  );
};

export default ProfilePage;
