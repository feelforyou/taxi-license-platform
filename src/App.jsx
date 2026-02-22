import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import Spinner from "./Components/Spinner/Spinner";
const CarsForRent = React.lazy(() => import("./Pages/CarsForRent"));
const LogIn = React.lazy(() => import("./Pages/LogIn"));
const SignUp = React.lazy(() => import("./Pages/SignUp"));
const CarDetail = React.lazy(() => import("./Pages/CarDetail"));
const Error = React.lazy(() => import("./Pages/Error"));
const ProtectedRoute = React.lazy(() => import("./Utilities/ProtectedRoute"));
const OwnerDetail = React.lazy(() => import("./Pages/OwnerDetail"));

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/cars" element={<CarsForRent />} />
          <Route exact path="/login" element={<LogIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route path="/cardetail/:carID" element={<CarDetail />} />
          {/* <Route path="/:userID" element={<ProtectedRoute />} /> */}
          <Route path="/owner/:ownerID" element={<OwnerDetail />} />
          <Route path="/:userID/:tab?" element={<ProtectedRoute />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
