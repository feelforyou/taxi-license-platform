import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AppContext from "./Context/Context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContext>
      <App />
    </AppContext>
  </React.StrictMode>
);