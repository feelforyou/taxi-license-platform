import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../FirebaseConfig/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const submitToFirebase = async (values, user) => {
  const carRef = collection(db, "cars");
  const currentDate = new Date();
  const currentSubmissionDate = Timestamp.fromDate(currentDate);
  const fileExtension = values.image.name.split(".").pop();
  const filenameWithoutExtension = values.image.name
    .split(".")
    .slice(0, -1)
    .join(".");
  const resizedFilename = `${filenameWithoutExtension}_800x600.${fileExtension}`;

  const storageRef = ref(
    storage,
    `car_images/${user.uid}/${values.image.name}`
  );
  const uploadTask = uploadBytesResumable(storageRef, values.image);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading image: ", error);
        reject(error);
      },
      async () => {
        const resizedImageRef = ref(
          storage,
          `car_images/${user.uid}/${resizedFilename}`
        );
        getDownloadURL(resizedImageRef)
          .then(async (downloadURL) => {
            const newCar = {
              submissionDate: currentSubmissionDate,
              name: values.name,
              description: values.description,
              phoneNumber: values.phoneNumber,
              price: values.price,
              location: values.location,
              imageUrl: downloadURL,
              addedByUID: user.uid,
              brand: values.brand,
              model: values.model,
              year: values.year,
              mileage: values.mileage,
              fuelType: values.fuelType,
            };

            try {
              await addDoc(carRef, newCar);
              resolve();
            } catch (error) {
              console.error("Error adding car: ", error);
              reject(error);
            }
          })
          .catch((error) => {
            console.error("Error getting download URL: ", error);
            reject(error);
          });
      }
    );
  });
};
