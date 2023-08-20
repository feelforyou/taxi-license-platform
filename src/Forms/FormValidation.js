import * as Yup from "yup";

export const validationSchema = Yup.object({
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
