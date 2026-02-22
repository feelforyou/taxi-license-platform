import React, { useState } from "react";
import ProfileSection from "./ProfileSection";
import Listings from "./Listings/Listings";
import FormikDummy from "./UploadForm/FormikDummy";
import RealtimeChat from "./Messages/RealtimeChat";
import styles from "./tabs.module.css"; // შემოვიტანეთ სტილები

function Tabs({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || "myprofile");

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsBar}>
        <div
          className={`${styles.tab} ${activeTab === "listings" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("listings")}
        >
          Listings
        </div>

        <div
          className={`${styles.tab} ${activeTab === "upload" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Add Car +
        </div>

        <div
          className={`${styles.tab} ${activeTab === "myprofile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("myprofile")}
        >
          Profile
        </div>

        <div
          className={`${styles.tab} ${activeTab === "messages" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </div>
      </div>

      <div className={styles.tabsContent}>
        {activeTab === "myprofile" && <ProfileSection />}
        {activeTab === "messages" && <RealtimeChat />}
        {activeTab === "listings" && <Listings />}
        {activeTab === "upload" && <FormikDummy />}
      </div>
    </div>
  );
}

export default Tabs;
