import React, { useState } from "react";
import ProfileSection from "./ProfileSection";
import Listings from "./Listings/Listings";
import FormikDummy from "./UploadForm/FormikDummy";
import RealtimeChat from "./Messages/RealtimeChat";
function Tabs({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "myprofile");

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
          Add Car +
        </div>

        <div
          className={`tab ${activeTab === "myprofile" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("myprofile")}
        >
          Profile
        </div>
        <div
          className={`tab ${activeTab === "messages" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </div>
      </div>

      <div className="tabs-content">
        {activeTab === "myprofile" && <ProfileSection />}
        {/* {activeTab === "messages" && <MessagesList />} */}
        {activeTab === "messages" && <RealtimeChat />}

        {activeTab === "listings" && <Listings />}
        {activeTab === "upload" && <FormikDummy />}
      </div>
    </div>
  );
}

export default Tabs;
