import { storage } from "../FirebaseConfig/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

async function getDownloadURLWithRetry(
  storageRef,
  maxAttempts = 3,
  delay = 2000
) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      if (i === maxAttempts - 1) throw error; // If it's the last attempt, throw the error.
      await new Promise((res) => setTimeout(res, delay)); // Otherwise, wait for the delay and retry.
    }
  }
}

export const uploadImageToFirebase = async (uid, imageFile) => {
  if (!uid || !imageFile) {
    throw new Error("Both UID and image file are required");
  }

  const fileExtension = imageFile.name.split(".").pop();
  const filenameWithoutExtension = imageFile.name
    .split(".")
    .slice(0, -1)
    .join(".");
  const resizedFilename = `${filenameWithoutExtension}_800x600.${fileExtension}`;

  const storageRef = ref(storage, `car_images/${uid}/${imageFile.name}`);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

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
          `car_images/${uid}/${resizedFilename}`
        );
        try {
          const downloadURL = await getDownloadURLWithRetry(resizedImageRef);
          resolve(downloadURL);
        } catch (error) {
          console.error("Error getting download URL with retry: ", error);
          reject(error);
        }
      }
    );
  });
};
