import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig/firebaseConfig";

export const updateToFirebase = async (values, carId) => {
  try {
    // Get a reference to the document
    const carDocumentRef = doc(db, "cars", carId);

    const updatedData = {
      name: values.name,
      email: values.email,
      description: values.description,
      phoneNumber: values.phoneNumber,
      price: values.price,
      location: values.location,
      brand: values.brand,
      model: values.model,
      year: values.year,
      mileage: values.mileage,
      fuelType: values.fuelType,
      editedDate: values.editedDate,
    };

    // If imageUrl exists, add it to the updatedData
    if (values.imageUrl) {
      updatedData.imageUrl = values.imageUrl;
    }

    // Update the document
    await updateDoc(carDocumentRef, updatedData);
  } catch (error) {
    console.error("Error updating the car:", error);
  }
};
