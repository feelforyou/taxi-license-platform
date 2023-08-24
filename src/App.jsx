// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./Components/Navbar/Navbar";
// import Footer from "./Components/Footer/Footer";
// import Home from "./Pages/Home";
// import About from "./Pages/About";
// import LogIn from "./Pages/LogIn";
// import SignUp from "./Pages/SignUp";
// import Error from "./Pages/Error";
// import CarDetail from "./Pages/CarDetail";
// import ProtectedRoute from "./Utilities/ProtectedRoute"; // Adjust this path

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route exact path="/" element={<Home />} />
//         <Route exact path="/about" element={<About />} />
//         <Route exact path="/login" element={<LogIn />} />
//         <Route exact path="/signup" element={<SignUp />} />
//         <Route path="/cardetail/:carID" element={<CarDetail />} />
//         <Route path="/:userID" element={<ProtectedRoute />} />
//         <Route path="*" element={<Error />} />
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// };

// export default App;

/////Lazy Loading Approach

import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";

const About = React.lazy(() => import("./Pages/About"));
const LogIn = React.lazy(() => import("./Pages/LogIn"));
const SignUp = React.lazy(() => import("./Pages/SignUp"));
const CarDetail = React.lazy(() => import("./Pages/CarDetail"));
const Error = React.lazy(() => import("./Pages/Error"));
const ProtectedRoute = React.lazy(() => import("./Utilities/ProtectedRoute"));

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense
        fallback={
          <div className="loading-container">
            <div className="loading"></div>
          </div>
        }
      >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/login" element={<LogIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route path="/cardetail/:carID" element={<CarDetail />} />
          <Route path="/:userID" element={<ProtectedRoute />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
