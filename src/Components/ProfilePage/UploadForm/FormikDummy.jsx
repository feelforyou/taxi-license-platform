import { useFormik } from "formik";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { carBrandsAndModels } from "../../../Data/CarData";
import { validationSchema } from "../../../Forms/FormValidation";
import { uploadImageToFirebase } from "../../../Forms/uploadImageToFirebase";
import { useNavigate } from "react-router-dom";
import styles from "./uploadForm.module.css"; // შემოდის ახალი სტილები

const FormikDummy = () => {
  const [loading, setLoading] = useState(false);

  const { user, showModal } = useGlobalContext();
  const usersRef = collection(db, "users");
  const carRef = collection(db, "cars");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      description: "",
      phoneNumber: "",
      price: "",
      location: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      fuelType: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      if (!user || !user.uid) {
        formik.setStatus("User not authenticated.");
        setLoading(false);
        return;
      }

      let uniqueName = user.name || user.email.split("@")[0];

      try {
        const downloadURL = await uploadImageToFirebase(user.uid, values.image);
        const currentDate = new Date();
        const currentSubmissionDate = Timestamp.fromDate(currentDate);

        const userDocRef = doc(usersRef, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.document) {
          try {
            await setDoc(userDocRef, {
              name: values.name,
              email: values.email,
              phoneNumber: values.phoneNumber,
              avatar: user.avatar,
              uniqueName,
            });
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        }

        const newCar = {
          submissionDate: currentSubmissionDate,
          name: values.name,
          description: values.description,
          phoneNumber: values.phoneNumber,
          price: values.price,
          location: values.location,
          imageUrl: downloadURL,
          addedByUID: userDocRef,
          brand: values.brand,
          model: values.model,
          year: values.year,
          mileage: values.mileage,
          fuelType: values.fuelType,
          email: values.email,
          uniqueName,
        };

        await addDoc(carRef, newCar);
        formik.resetForm();
        showModal("Successfully submitted!");
        navigate(`/${user.uid}`);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error: ", error);
        formik.setStatus(
          "An error occurred while uploading. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.brand) {
      formik.setFieldValue("model", "");
    }
  }, [formik.values.brand]);

  return (
    <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
      {/* მთავარი ერორი სტატუსიდან */}
      {formik.status && (
        <p className={styles.submitErrorMessage}>{formik.status}</p>
      )}

      {/* Brand */}
      <div className={styles.formGroup}>
        <select
          className={styles.inputField}
          name="brand"
          value={formik.values.brand}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            Select Brand
          </option>
          {carBrandsAndModels.map((brandObj) => (
            <option key={brandObj.brand} value={brandObj.brand}>
              {brandObj.brand}
            </option>
          ))}
        </select>
        {formik.touched.brand && formik.errors.brand && (
          <div className={styles.errorMessage}>{formik.errors.brand}</div>
        )}
      </div>

      {/* Model */}
      <div className={styles.formGroup}>
        <select
          className={styles.inputField}
          name="model"
          value={formik.values.model || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!formik.values.brand} /* გავუთიშოთ თუ ბრენდი არაა არჩეული */
        >
          <option value="" disabled>
            Select Model
          </option>
          {(
            carBrandsAndModels.find((b) => b.brand === formik.values.brand)
              ?.models || []
          ).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        {formik.touched.model && formik.errors.model && (
          <div className={styles.errorMessage}>{formik.errors.model}</div>
        )}
      </div>

      {/* Year */}
      <div className={styles.formGroup}>
        <select
          className={styles.inputField}
          name="year"
          value={formik.values.year}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            Select Year
          </option>
          {Array.from({ length: 30 }, (_, i) => 1995 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {formik.touched.year && formik.errors.year && (
          <div className={styles.errorMessage}>{formik.errors.year}</div>
        )}
      </div>

      {/* Price */}
      <div className={styles.formGroup}>
        <input
          className={styles.inputField}
          type="number"
          placeholder="Price ($)"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.price && formik.errors.price && (
          <div className={styles.errorMessage}>{formik.errors.price}</div>
        )}
      </div>

      {/* Fuel Type */}
      <div className={styles.formGroup}>
        <div className={styles.fuelTypeContainer}>
          {["Petrol", "Hybrid", "Gas", "Electric"].map((type) => (
            <label
              key={type}
              className={`${styles.radioLabel} ${formik.values.fuelType === type ? styles.radioChecked : ""}`}
            >
              <input
                className={styles.radioInput}
                type="radio"
                name="fuelType"
                value={type}
                checked={formik.values.fuelType === type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {type}
            </label>
          ))}
        </div>
        {formik.touched.fuelType && formik.errors.fuelType && (
          <div className={styles.errorMessage}>{formik.errors.fuelType}</div>
        )}
      </div>

      {/* Mileage */}
      <div className={styles.formGroup}>
        <select
          className={styles.inputField}
          name="mileage"
          value={formik.values.mileage}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            Select Mileage
          </option>
          {Array.from({ length: 51 }, (_, i) => i * 10000).map((mileage) => (
            <option key={mileage} value={mileage}>
              {mileage} km
            </option>
          ))}
        </select>
        {formik.touched.mileage && formik.errors.mileage && (
          <div className={styles.errorMessage}>{formik.errors.mileage}</div>
        )}
      </div>

      {/* Location */}
      <div className={styles.formGroup}>
        <select
          className={styles.inputField}
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" disabled>
            Select Location
          </option>
          {["Tbilisi", "Kutaisi", "Batumi", "Rustavi"].map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        {formik.touched.location && formik.errors.location && (
          <div className={styles.errorMessage}>{formik.errors.location}</div>
        )}
      </div>

      {/* Name */}
      <div className={styles.formGroup}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="name"
        />
        {formik.touched.name && formik.errors.name && (
          <div className={styles.errorMessage}>{formik.errors.name}</div>
        )}
      </div>

      {/* Phone Number */}
      <div className={styles.formGroup}>
        <input
          className={styles.inputField}
          type="tel"
          placeholder="5xxxxxxxx"
          name="phoneNumber"
          pattern="5[0-9]{8}"
          title="Phone number must start with 5 and have 9 digits in total"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="tel"
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <div className={styles.errorMessage}>{formik.errors.phoneNumber}</div>
        )}
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="email"
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.errorMessage}>{formik.errors.email}</div>
        )}
      </div>

      {/* Image (მთელ სიგანეზე) */}
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <input
          className={styles.inputField}
          type="file"
          name="image"
          onChange={(event) => {
            formik.setFieldValue("image", event.currentTarget.files[0]);
          }}
          onBlur={formik.handleBlur}
          style={{ cursor: "pointer", padding: "0.6rem 1rem" }}
        />
        {formik.touched.image && formik.errors.image && (
          <div className={styles.errorMessage}>{formik.errors.image}</div>
        )}
      </div>

      {/* Description (მთელ სიგანეზე) */}
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <textarea
          className={styles.inputField}
          placeholder="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows="4"
          style={{ resize: "vertical" }}
        />
        {formik.touched.description && formik.errors.description && (
          <div className={styles.errorMessage}>{formik.errors.description}</div>
        )}
      </div>

      {/* Submit Button (მთელ სიგანეზე) */}
      <div className={styles.fullWidth}>
        <button
          className={styles.submitBtn}
          type="submit"
          disabled={formik.isSubmitting || loading}
        >
          {loading ? (
            <span className={styles.spinnerUploadForm}></span>
          ) : (
            "Add Car"
          )}
        </button>
      </div>
    </form>
  );
};

export default FormikDummy;
