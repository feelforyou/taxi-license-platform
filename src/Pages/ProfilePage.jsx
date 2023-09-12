import React from "react";
import Tabs from "../Components/ProfilePage/Tabs";

const ProfilePage = ({ activeTab }) => {
  return (
    <div className="profile-container">
      <Tabs initialTab={activeTab} />
    </div>
  );
};

export default ProfilePage;
