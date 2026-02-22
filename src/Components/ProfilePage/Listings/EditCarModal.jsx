import React, { useState } from "react";
import { updateToFirebase } from "../../../Forms/updateToFirebase";
import { useFormik } from "formik";
import { carBrandsAndModels } from "../../../Data/CarData";
import { uploadImageToFirebase } from "../../../Forms/uploadImageToFirebase";
import { useGlobalContext } from "../../../Context/Context";
import { Timestamp } from "firebase/firestore";
import { editValidationSchema } from "../../../Forms/EditValidation";
import { useNavigate } from "react-router-dom";
import styles from "./editCarModal.module.css"; // ✅ შემოვიტანეთ სტილები

function hasChanged(initialValues, currentValues) {
  return Object.keys(initialValues).some(
    (key) => initialValues[key] !== currentValues[key],
  );
}

const EditCarModal = ({ car, onClose }) => {
  const navigate = useNavigate();
  const { showModal, user } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: car.name,
      email: car.email,
      description: car.description,
      phoneNumber: car.phoneNumber,
      price: car.price,
      location: car.location,
      brand: car.brand,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      fuelType: car.fuelType,
      image: null,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const currentEditingDate = new Date();
      values.editedDate = Timestamp.fromDate(currentEditingDate);

      if (!hasChanged(formik.initialValues, values)) {
        onClose();
        showModal("No changes made to the car details.");
        navigate("/");
        window.scrollTo(0, 0);
        setLoading(false);
        return;
      }

      try {
        if (values.image) {
          const downloadURL = await uploadImageToFirebase(
            user.uid,
            values.image,
          );
          values.imageUrl = downloadURL;
        }

        await updateToFirebase(values, car.id);
        navigate("/");
        window.scrollTo(0, 0);
        showModal("Car details updated successfully!");
        onClose();
      } catch (error) {
        console.error("Error updating car details:", error);
        showModal("Failed to update car details. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {/* არსებული სურათის ჩვენება (მთელ სიგანეზე) */}
        <div className={`${styles.imagePreviewContainer} ${styles.fullWidth}`}>
          <img
            className={styles.currentImage}
            src={car.imageUrl}
            alt="Current Car"
          />
        </div>

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
              onChange={(e) => {
                formik.setFieldValue("brand", e.target.value);
                formik.setFieldValue("model", "");
              }}
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
              disabled={!formik.values.brand}
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
              placeholder="Price"
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
              <div className={styles.errorMessage}>
                {formik.errors.fuelType}
              </div>
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
              {Array.from({ length: 51 }, (_, i) => i * 10000).map(
                (mileage) => (
                  <option key={mileage} value={mileage}>
                    {mileage} km
                  </option>
                ),
              )}
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
              <div className={styles.errorMessage}>
                {formik.errors.location}
              </div>
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
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className={styles.errorMessage}>
                {formik.errors.phoneNumber}
              </div>
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
            />
            {formik.touched.email && formik.errors.email && (
              <div className={styles.errorMessage}>{formik.errors.email}</div>
            )}
          </div>

          {/* Image Upload (ახალი სურათისთვის) */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              Update Image (Optional)
            </label>
            <input
              className={styles.inputField}
              type="file"
              name="image"
              onChange={(event) =>
                formik.setFieldValue("image", event.currentTarget.files[0])
              }
              onBlur={formik.handleBlur}
              style={{ padding: "0.6rem 1rem", cursor: "pointer" }}
            />
            {formik.touched.image && formik.errors.image && (
              <div className={styles.errorMessage}>{formik.errors.image}</div>
            )}
          </div>

          {/* Description */}
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
              <div className={styles.errorMessage}>
                {formik.errors.description}
              </div>
            )}
          </div>

          {/* ღილაკები */}
          <div className={`${styles.buttonGroup} ${styles.fullWidth}`}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={formik.isSubmitting || loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;
