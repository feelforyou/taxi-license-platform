import React from "react";
import styles from "./avatar.module.css";
// აქ შემომაქვს შენი დეფოლტ აიქონი და ვარქმევ DefaultIcon-ს, რომ სახელები არ აირიოს
import { UserAvatar as DefaultIcon } from "../../Data/data";

const UserAvatar = ({ src, alt, className }) => {
  // საერთო კლასები: მოდულის სტილი + გარედან მოსული კლასი (თუ საჭიროა)
  const combinedClasses = `${styles.avatar} ${className || ""}`;

  if (src) {
    return (
      <img src={src} alt={alt || "User Avatar"} className={combinedClasses} />
    );
  }

  return <DefaultIcon className={`${combinedClasses} ${styles.defaultIcon}`} />;
};

export default UserAvatar;
