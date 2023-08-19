import { useFormik } from "formik";
import * as Yup from "yup";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/firebaseConfig";
import { storage } from "../../../FirebaseConfig/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { carBrandsAndModels } from "../../../Data/CarData";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string()
    .max(25, "Name cannot exceed 25 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Name can only contain alphabetic characters and spaces"
    )
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
  phoneNumber: Yup.string()
    .matches(
      /^5[0-9]{8}$/,
      "Phone number must start with 5 and have 9 digits in total"
    )
    .required("Phone number is required"),

  price: Yup.number()
    .positive("Must be a positive number")
    .required("Price is required"),
  location: Yup.string()
    .oneOf(["Tbilisi", "Kutaisi", "Batumi", "Rustavi"], "Invalid location")
    .required("Location is required"),
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().when("brand", {
    is: true,
    //  (brand) => Boolean(brand),
    then: Yup.string().required("Model is required when Brand is selected"),
  }),
  year: Yup.number()
    .min(1995, `Year must be after 1995`)
    .max(
      new Date().getFullYear(),
      `Year must be before or equal to ${new Date().getFullYear()}`
    )
    .required("Year is required"),
  mileage: Yup.number()
    .min(0, "Mileage must be at least 0km")
    .max(500000, "Mileage must be below or equal to 500000km")
    .required("Mileage is required"),
  fuelType: Yup.string().required("Fuel type is required"),
  image: Yup.mixed()
    .required("An image is required")
    .test("fileFormat", "Unsupported Format", (value) => {
      if (value) {
        const validImageTypes = ["image/jpeg", "image/png"];
        return validImageTypes.includes(value.type);
      }
      return true;
    }),
});

const FormikDummy = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, showModal } = useGlobalContext();
  const carRef = collection(db, "cars");

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

      const currentDate = new Date();
      const currentSubmissionDate = currentDate.toLocaleString();
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

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Error uploading image: ", error);
          setLoading(false);
        },
        async () => {
          await new Promise((res) => setTimeout(res, 5000));

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
                formik.resetForm();
                navigate("/"); //navigating user to home page
                showModal("Successfully submitted!");
              } catch (error) {
                console.error("Error adding car: ", error);
              } finally {
                setLoading(false);
              }
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
              setLoading(false);
            });
        }
      );
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

        {/* Submit Button */}
        <button type="submit" disabled={formik.isSubmitting}>
          {loading ? <span className="spinner-upload-form"></span> : "Add Car"}
        </button>
      </form>
    </>
  );
};

export default FormikDummy;
