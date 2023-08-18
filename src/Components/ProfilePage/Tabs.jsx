import React, { useState } from "react";
import ProfileSection from "./ProfileSection";
import Listings from "./Listings/Listings";
import FormikDummy from "./UploadForm/FormikDummy";

function Tabs() {
  const [activeTab, setActiveTab] = useState("upload"); // default to 'myprofile' tab

  return (
    <div className="tabs-container">
      <div className="tabs-bar">
        <div
          className={`tab ${activeTab === "listings" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("listings")}
        >
          Listings
        </div>
        <div
          className={`tab ${activeTab === "upload" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload
        </div>
        {/* <div
          className={`tab ${activeTab === "reviews" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </div> */}
        <div
          className={`tab ${activeTab === "myprofile" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("myprofile")}
        >
          Profile
        </div>
        {/* <div
          className={`tab ${activeTab === "settings" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </div> */}
      </div>

      <div className="tabs-content">
        {activeTab === "myprofile" && <ProfileSection />}
        {activeTab === "listings" && <Listings />}
        {activeTab === "upload" && <FormikDummy />}
        {/* {activeTab === "reviews" && (
          <div>Reviews from other users will appear here.</div>
        )}
        {activeTab === "settings" && (
          <div>Profile Settings form will appear here.</div>
        )} */}
      </div>
    </div>
  );
}

export default Tabs;
