import axios from "axios";
import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform password change logic here, such as validating passwords and sending data to the server
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:3001/users/change-password", // Replace with your API endpoint for updating the password
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 204) {
        // Password updated successfully
        setSuccessMessage("Password updated successfully");
        setError("");
        // Clear form fields on successful change
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Failed to update password
        setError("Failed to update password");
        setSuccessMessage("");
      }
    } catch (error) {
      // Handle API errors
      setError("Failed to update password");
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <p className="text-center font-semibold text-xl">Change Password</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            placeholder="Enter your current password"
            value={currentPassword}
            className="text-black w-full py-3 px-4 rounded-md"
            style={{ fontSize: '16px' }}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            className="text-black w-full py-3 px-4 rounded-md"
            style={{ fontSize: '16px' }}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            className="text-black w-full py-3 px-4 rounded-md"
            style={{ fontSize: '16px' }}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <n/>
        <button
          type="submit"
          className="bg-[#4caf4fd0] py-3 px-4 font-medium rounded-md transition-colors duration-300 hover:bg-[#4caf50]"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
