import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { storage } from "../../../FirebaseConfig/firebaseConfig";
import { useState, useRef } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UploadForm = () => {
  const carRef = collection(db, "cars");
  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState("");
  const [carType, setCarType] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useGlobalContext();

  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fileExtension = image.name.split(".").pop(); // Extracts 'jpg' or 'png' or any other extension
    const filenameWithoutExtension = image.name
      .split(".")
      .slice(0, -1)
      .join(".");
    const resizedFilename = `${filenameWithoutExtension}_800x600.${fileExtension}`; // Maintain the original extension

    const storageRef = ref(storage, `car_images/${user.uid}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading image: ", error);
      },
      async () => {
        // Adding a delay to give Firebase Extension time to resize the image
        await new Promise((res) => setTimeout(res, 5000)); // 5 seconds delay

        const resizedImageRef = ref(
          storage,
          `car_images/${user.uid}/${resizedFilename}`
        );
        getDownloadURL(resizedImageRef).then(async (downloadURL) => {
          const newCar = {
            carName: carName,
            description: description,
            phoneNumber: phoneNumber,
            price: price,
            carType: carType,
            location: location,
            imageUrl: downloadURL,
            addedByUID: user.uid,
          };

          try {
            await addDoc(carRef, newCar);
            setCarName("");
            setDescription("");
            setPhoneNumber("");
            setPrice("");
            setCarType("");
            setLocation("");
            setImage(null);
            if (fileInputRef.current) {
              // I had to reset file input manually,
              //issue is likely with the file input's internal state, not with the React state.
              //The file input retains its selected file unless explicitly cleared.
              fileInputRef.current.value = "";
            }
          } catch (error) {
            console.error("Error adding car: ", error);
          } finally {
            setIsSubmitting(false);
          }
        });
      }
    );
  };

  return (
    <form className="upload-form-container" onSubmit={handleAddCar}>
      <input
        required
        type="text"
        placeholder="Car Name"
        value={carName}
        onChange={(e) => setCarName(e.target.value)}
      />
      <textarea
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        required
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <input
        required
        type="text"
        placeholder="Price per day (e.g. $100)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        required
        type="text"
        placeholder="Car Type (e.g. Sedan, SUV)"
        value={carType}
        onChange={(e) => setCarType(e.target.value)}
      />
      <input
        required
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        required
        ref={fileInputRef}
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleImageChange}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="spinner-upload-form"></span>
        ) : (
          "Add Car"
        )}
      </button>
    </form>
  );
};

export default UploadForm;

// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../../../FirebaseConfig/firebaseConfig";
// import { storage } from "../../../FirebaseConfig/firebaseConfig"; // import Firebase storage
// import { useState } from "react";
// import { useGlobalContext } from "../../../Context/Context";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// const UploadForm = () => {
//   const carRef = collection(db, "cars");

//   const [carName, setCarName] = useState("");
//   const [description, setDescription] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [price, setPrice] = useState("");
//   const [carType, setCarType] = useState("");
//   const [location, setLocation] = useState("");
//   const [image, setImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { user } = useGlobalContext();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   const handleAddCar = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // First, we upload the image
//     // const storageRef = ref(storage, "car_images/" + image.name);
//     const storageRef = ref(storage, `car_images/${user.uid}/${image.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, image);

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Handle the upload task progress here if needed
//       },
//       (error) => {
//         console.error("Error uploading image: ", error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           const newCar = {
//             carName: carName,
//             description: description,
//             phoneNumber: phoneNumber,
//             price: price,
//             carType: carType,
//             location: location,
//             imageUrl: downloadURL,
//             addedByUID: user.uid,
//           };

//           try {
//             await addDoc(carRef, newCar);
//             setCarName("");
//             setDescription("");
//             setPhoneNumber("");
//             setPrice("");
//             setCarType("");
//             setLocation("");
//             setImage(null);
//           } catch (error) {
//             console.error("Error adding car: ", error);
//           } finally {
//             setIsSubmitting(false); // Set submitting state to false once everything is done
//           }
//         });
//       }
//     );
//   };

//   return (
//     <form className="upload-form-container" onSubmit={handleAddCar}>
//       <input
//         type="text"
//         placeholder="Car Name"
//         value={carName}
//         onChange={(e) => setCarName(e.target.value)}
//       />
//       <textarea
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       ></textarea>
//       <input
//         type="text"
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Price per day (e.g. $100)"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Car Type (e.g. Sedan, SUV)"
//         value={carType}
//         onChange={(e) => setCarType(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       <button type="submit" disabled={isSubmitting}>
// {isSubmitting ? "Submitting..." : "Add Car"}
// </button>
//     </form>
//   );
// };

// export default UploadForm;
