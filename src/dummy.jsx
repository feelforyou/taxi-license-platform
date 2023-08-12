import { collection, addDoc } from "firebase/firestore";
import { db } from "./Config/firebaseConfig";
import { useState } from "react";

function AppOld() {
  const licensesRef = collection(db, "licenses");

  ///////////////////   adding document ////////////
  const [newTitle, setNewTitle] = useState("");
  const [newYoutubeURL, setNewYoutubeURL] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddLicense = async (e) => {
    e.preventDefault();
    const newLicense = {
      title: newTitle,
      youtubeURL: newYoutubeURL,
      price: newPrice,
      url: newImageUrl,
    };

    try {
      await addDoc(licensesRef, newLicense);
      setNewTitle("");
      setNewYoutubeURL("");
      setNewPrice("");
      setNewImageUrl("");
      getLicenses();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <form onSubmit={handleAddLicense}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Youtube URL"
          value={newYoutubeURL}
          onChange={(e) => setNewYoutubeURL(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button type="submit">Add License</button>
      </form>
    </>
  );
}

export default AppOld;
