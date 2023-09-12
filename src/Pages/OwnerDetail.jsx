import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebaseConfig";
import OwnerListings from "../Components/OwnerDetail/OwnerListings";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig/firebaseConfig";

const OwnerDetail = () => {
  const { ownerID } = useParams();
  const navigate = useNavigate();
  const [ownerDetails, setOwnerDetails] = useState(null);

  const handleTextMe = () => {
    if (auth?.currentUser?.uid === ownerID) {
      alert("You can't send messages to yourself!");
      return;
    }

    // Saving ownerID and name to localStorage
    localStorage.setItem("ownerID", ownerID);

    // If the ownerDetails is available, save it in the specific format
    if (ownerDetails) {
      localStorage.setItem(
        `ownerDetails-${ownerID}`,
        JSON.stringify(ownerDetails)
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
        console.log("fetchOwner details");
        try {
          const ownerDocRef = doc(db, "users", ownerID);
          const ownerDocSnap = await getDoc(ownerDocRef);

          if (ownerDocSnap.exists()) {
            const ownerData = ownerDocSnap.data();
            setOwnerDetails(ownerData);

            // Save fetched details to the specific format in local storage
            localStorage.setItem(
              `ownerDetails-${ownerID}`,
              JSON.stringify(ownerData)
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
    <div className="ownerpage-container">
      <h1>Owner's Page</h1>
      {ownerDetails && (
        <div className="ownerpageinfo-container">
          {ownerDetails.avatar && <img src={ownerDetails?.avatar} />}
          <p>{ownerDetails?.uniqueName}</p>
          <p>{ownerDetails?.email}</p>
          <p>{ownerDetails?.phoneNumber}</p>
          <button className="addcar-btn" onClick={handleTextMe}>
            Start Chat
          </button>
        </div>
      )}
      <OwnerListings ownerID={ownerID} />
    </div>
  );
};

export default OwnerDetail;
