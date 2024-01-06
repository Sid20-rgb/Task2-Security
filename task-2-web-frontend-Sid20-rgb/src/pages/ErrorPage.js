import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css"; // Import your CSS file

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
    <h1 className="error-heading">404 Error Page</h1>
    <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
    <button className="error-button" onClick={() => navigate("/login")}>
      Login
    </button>
  </div>
  );
};

export default ErrorPage;
