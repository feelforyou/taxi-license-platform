import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { useState } from "react";
import { useGlobalContext } from "../../../Context/Context";

const UploadForm = () => {
  const licensesRef = collection(db, "licenses");

  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [price, setPrice] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const { user } = useGlobalContext();

  const handleAddLicense = async (e) => {
    e.preventDefault();
    const newLicense = {
      issueDate: issueDate,
      expiryDate: expiryDate,
      price: price,
      licenseType: licenseType,
      licenseNumber: licenseNumber,
      addedByUID: user.uid,
    };

    try {
      await addDoc(licensesRef, newLicense);
      setIssueDate("");
      setExpiryDate("");
      setPrice("");
      setLicenseType("");
      setLicenseNumber("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <form onSubmit={handleAddLicense}>
        <input
          type="date"
          placeholder="Issue Date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="License Type (e.g. Basic, Premium)"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
        />
        <input
          type="text"
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />
        <button type="submit">Add License</button>
      </form>
    </>
  );
};

export default UploadForm;
