import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppContext from "./Context/Context";
import "../src/index.css";
import GlobalModal from "./GlobalModal.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContext>
      <GlobalModal />
      <App />
    </AppContext>
  </React.StrictMode>
);
