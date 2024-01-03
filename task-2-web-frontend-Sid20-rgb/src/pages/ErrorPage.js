import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-white">
      <h1>404 Error Page</h1>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default ErrorPage;
