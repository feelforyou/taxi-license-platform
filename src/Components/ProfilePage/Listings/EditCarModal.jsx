import React, { useState } from "react";
import { updateToFirebase } from "../../../Forms/updateToFirebase";
import { useFormik } from "formik";
import { carBrandsAndModels } from "../../../Data/CarData";
import { uploadImageToFirebase } from "../../../Forms/uploadImageToFirebase";
import { useGlobalContext } from "../../../Context/Context";
import { Timestamp } from "firebase/firestore";
import { editValidationSchema } from "../../../Forms/EditValidation";

//utility function
function hasChanged(initialValues, currentValues) {
  return Object.keys(initialValues).some(
    (key) => initialValues[key] !== currentValues[key]
  );
}

const EditCarModal = ({ car, onClose }) => {
  const { showModal, user } = useGlobalContext();
  // Assuming car is the car data passed down as a prop.
  const [loading, setLoading] = useState(false); // added loading state

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
      const currentEditDate = Timestamp.fromDate(currentEditingDate);
      values.editedDate = currentEditDate; // <-- Use the Timestamp format

      if (!hasChanged(formik.initialValues, values)) {
        onClose();
        showModal("No changes made to the car details.");
        setLoading(false);
        return; // Exit out of the function without updating Firebase
      }

      try {
        // If a new image has been provided, upload it
        if (values.image) {
          const downloadURL = await uploadImageToFirebase(
            user.uid,
            values.image
          );
          values.imageUrl = downloadURL; // Add the imageUrl to the values object
        }

        // Update the car details in Firebase Firestore
        await updateToFirebase(values, car.id);

        // Show success message (if you have a method to display messages, otherwise skip this step)
        showModal("Car details updated successfully!");

        // Close the modal after saving
        onClose();
      } catch (error) {
        // Handle any errors that occurred during the process
        console.error("Error updating car details:", error);
        showModal("Failed to update car details. Please try again."); // This can be a way to inform the user about the error
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content">
        <form
          className="edit-upload-form-container"
          onSubmit={formik.handleSubmit}
        >
          {formik.status && (
            <p className="submit-error-message">{formik.status}</p>
          )}
          {/* Display Current Image */}
          <img className="edit-img" src={car.imageUrl} alt="Current Car" />
          {/* Brand */}
          {formik.touched.brand && formik.errors.brand && (
            <div className="formik-error">{formik.errors.brand}</div>
          )}
          <select
            name="brand"
            value={formik.values.brand}
            onChange={(e) => {
              formik.setFieldValue("brand", e.target.value);
              formik.setFieldValue("model", ""); // Reset model when brand changes
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

          {/* Model */}
          {formik.values.brand && (
            <>
              {formik.touched.model && formik.errors.model && (
                <div className="formik-error">{formik.errors.model}</div>
              )}
              <select
                name="model"
                value={formik.values.model || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>
                  Select Model
                </option>
                {(
                  carBrandsAndModels.find(
                    (b) => b.brand === formik.values.brand
                  )?.models || []
                ).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Year */}
          {formik.touched.year && formik.errors.year && (
            <div className="formik-error">{formik.errors.year}</div>
          )}
          <select
            name="year"
            value={formik.values.year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled>
              Select Year
            </option>
            {Array.from({ length: 29 }, (_, i) => 1995 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Price */}
          {formik.touched.price && formik.errors.price && (
            <div className="formik-error">{formik.errors.price}</div>
          )}
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Fuel Type */}
          {formik.touched.fuelType && formik.errors.fuelType && (
            <div className="formik-error">{formik.errors.fuelType}</div>
          )}
          <div>
            {["Petrol", "Hybrid", "Gas", "Electric"].map((type) => (
              <label className="radio-btn" key={type}>
                <input
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

          {/* Mileage */}
          {formik.touched.mileage && formik.errors.mileage && (
            <div className="formik-error">{formik.errors.mileage}</div>
          )}
          <select
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

          {/* Location */}
          {formik.touched.location && formik.errors.location && (
            <div className="formik-error">{formik.errors.location}</div>
          )}
          <select
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

          {/* Description */}
          {formik.touched.description && formik.errors.description && (
            <div className="formik-error">{formik.errors.description}</div>
          )}
          <textarea
            placeholder="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Image */}
          {formik.touched.image && formik.errors.image && (
            <div className="formik-error">{formik.errors.image}</div>
          )}
          <input
            type="file"
            name="image"
            onChange={(event) => {
              formik.setFieldValue("image", event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
          />

          {/* Name */}
          {formik.touched.name && formik.errors.name && (
            <div className="formik-error">{formik.errors.name}</div>
          )}
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Phone Number */}
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="formik-error">{formik.errors.phoneNumber}</div>
          )}
          <input
            type="tel"
            placeholder="5xxxxxxxx"
            name="phoneNumber"
            pattern="5[0-9]{8}"
            title="Phone number must start with 5 and have 9 digits in total"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {/* Email */}
          {formik.touched.email && formik.errors.email ? (
            <div className="formik-error">{formik.errors.email}</div>
          ) : null}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <button type="submit" disabled={formik.isSubmitting}>
            {loading ? (
              <span className="spinner-upload-form"></span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCarModal;
