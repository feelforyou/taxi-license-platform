import React from "react";

const Error = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          We can't seem to find the page you're looking for. Check the URL or
          head back home.
        </p>
        <a href="/" className="error-home-button">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default Error;
