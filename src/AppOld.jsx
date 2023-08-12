import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "./Config/firebaseConfig";
import { useState, useEffect } from "react";
import SignInGoogle from "./SignInGoogle";
import SignOut from "./SignOut";
import YoutubeEmbed from "./Youtube";

function AppOld() {
  const [licenses, setLicenses] = useState([]);

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

  const getLicenses = async () => {
    try {
      const querySnapshot = await getDocs(licensesRef);
      const licencesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLicenses(licencesData);
    } catch (error) {
      console.error("Error fetching licenses: ", error);
    }
  };

  const deleteLicense = async (id) => {
    const docRef = doc(db, "licenses", id);
    try {
      await deleteDoc(docRef);
      getLicenses();
    } catch (error) {
      console.error("Error deleting license: ", error);
    }
  };

  useEffect(() => {
    getLicenses();
  }, []);

  return (
    <>
      {auth?.currentUser?.uid ? <SignOut /> : <SignInGoogle />}
      <hr />
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

      <main>
        {/* Just an example of how you can render the licences data */}
        {licenses.map((license) => (
          <div className="card" key={license.id}>
            {license.isStore && (
              <h4
                className={license.isStore ? "isStore-true" : "isStore-false"}
              >
                {license.isStore ? "In Store" : "Not in Store"}
              </h4>
            )}
            <p> {license.title}</p>
            {license.youtubeURL && (
              <YoutubeEmbed embedUrl={license?.youtubeURL} />
            )}

            <p>{license.price}</p>
            {license.url && (
              <img src={license?.url} style={{ width: "100%" }} alt="license" />
            )}
            <p>
              <button
                className="btn-delete"
                onClick={() => deleteLicense(license.id)}
              >
                delete
              </button>
            </p>
          </div>
        ))}
      </main>
    </>
  );
}

export default AppOld;
