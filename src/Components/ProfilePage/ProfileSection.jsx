import React from "react";
import { useGlobalContext } from "../../Context/Context";
import { ProfileAvatar } from "../../Data/data";
function ProfileSection() {
  const { user } = useGlobalContext();
  return (
    <div className="profile-section">
      {user.avatar ? (
        <img
          src={user.avatar || DefaultAvatar}
          alt="Driver Profile"
          className="profile-image"
        />
      ) : (
        <ProfileAvatar className="profile-image" />
      )}
      <div className="profile-name">{user.name}</div>
      <div className="profile-detail">{user.email}</div>
    </div>
  );
}

export default ProfileSection;
