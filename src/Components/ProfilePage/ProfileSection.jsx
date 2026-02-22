import React from "react";
import { useGlobalContext } from "../../Context/Context";
import { ProfileAvatar } from "../../Data/data";
import styles from "./profileSection.module.css"; // შემოდის სტილები

function ProfileSection() {
  const { user } = useGlobalContext();

  return (
    <div className={styles.profileSection}>
      {/* ვამოწმებთ, აქვს თუ არა იუზერს ავატარი */}
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Driver Profile"
          className={styles.profileImage}
        />
      ) : (
        <ProfileAvatar className={styles.profileImage} />
      )}

      {/* სახელი (თუ არ აქვს მითითებული, User-ს დავწერთ) */}
      <div className={styles.profileName}>{user?.name || "User"}</div>

      {/* იმეილი */}
      <div className={styles.profileDetail}>{user?.email}</div>
    </div>
  );
}

export default ProfileSection;
