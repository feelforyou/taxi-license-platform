import { useFormik } from "formik";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/firebaseConfig";
// import { storage } from "../../../FirebaseConfig/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../Context/Context";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { carBrandsAndModels } from "../../../Data/CarData";
import { validationSchema } from "../../../Forms/FormValidation";
import { uploadImageToFirebase } from "../../../Forms/uploadImageToFirebase";
import { useNavigate } from "react-router-dom";
const FormikDummy = () => {
  const [loading, setLoading] = useState(false);
  const { user, showModal } = useGlobalContext();
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

      try {
        // Use the helper function to handle the image upload
        const downloadURL = await uploadImageToFirebase(user.uid, values.image);

        const currentDate = new Date();
        const currentSubmissionDate = Timestamp.fromDate(currentDate);

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
          email: values.email,
        };

        console.log("Saving new car: ", newCar);

        await addDoc(carRef, newCar);
        formik.resetForm();
        showModal("Successfully submitted!");
        navigate("/#home-container");
      } catch (error) {
        console.error("Error: ", error);
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
    <>
      <form className="upload-form-container" onSubmit={formik.handleSubmit}>
        {formik.status && (
          <p className="submit-error-message">{formik.status}</p>
        )}

        {/* Brand */}
        {formik.touched.brand && formik.errors.brand && (
          <div className="formik-error">{formik.errors.brand}</div>
        )}
        <select
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
                carBrandsAndModels.find((b) => b.brand === formik.values.brand)
                  ?.models || []
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
        <div className="fueltype-container">
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

        {/* Submit Button */}
        <button type="submit" disabled={formik.isSubmitting}>
          {loading ? <span className="spinner-upload-form"></span> : "Add Car"}
        </button>
      </form>
    </>
  );
};

export default FormikDummy;
