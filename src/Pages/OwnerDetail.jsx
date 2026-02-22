import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig/firebaseConfig";
import OwnerListings from "../Components/OwnerDetail/OwnerListings";
import styles from "./ownerDetail.module.css"; // ✅ დავამატეთ იმპორტი

const OwnerDetail = () => {
  const { ownerID } = useParams();
  const navigate = useNavigate();
  const [ownerDetails, setOwnerDetails] = useState(null);

  const handleTextMe = () => {
    if (auth?.currentUser?.uid === ownerID) {
      alert("You can't send messages to yourself!");
      return;
    }

    localStorage.setItem("ownerID", ownerID);

    if (ownerDetails) {
      localStorage.setItem(
        `ownerDetails-${ownerID}`,
        JSON.stringify(ownerDetails),
      );
    }

    navigate(`/${auth?.currentUser?.uid}/messages`);
  };

  useEffect(() => {
    const storedOwnerDetail = localStorage.getItem(`ownerDetails-${ownerID}`);

    if (storedOwnerDetail) {
      setOwnerDetails(JSON.parse(storedOwnerDetail));
    } else {
      async function fetchOwnerDetails() {
        try {
          const ownerDocRef = doc(db, "users", ownerID);
          const ownerDocSnap = await getDoc(ownerDocRef);

          if (ownerDocSnap.exists()) {
            const ownerData = ownerDocSnap.data();
            setOwnerDetails(ownerData);
            localStorage.setItem(
              `ownerDetails-${ownerID}`,
              JSON.stringify(ownerData),
            );
          } else {
            console.error("No such owner found!");
          }
        } catch (error) {
          console.error("Error fetching owner details:", error);
        }
      }
      fetchOwnerDetails();
    }
  }, [ownerID]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Owner's Profile</h1>

      {ownerDetails && (
        <div className={styles.profileCard}>
          {ownerDetails.avatar && (
            <img
              src={ownerDetails.avatar}
              alt="Avatar"
              className={styles.avatar}
            />
          )}
          <h2 className={styles.uniqueName}>{ownerDetails?.uniqueName}</h2>
          <p className={styles.infoText}>{ownerDetails?.email}</p>
          <p className={styles.infoText}>{ownerDetails?.phoneNumber}</p>

          <button className={styles.chatBtn} onClick={handleTextMe}>
            Start Chat
          </button>
        </div>
      )}

      {/* ქვემოთ გამოჩნდება ამ მფლობელის მანქანები */}
      <OwnerListings ownerID={ownerID} />
    </div>
  );
};

export default OwnerDetail;
