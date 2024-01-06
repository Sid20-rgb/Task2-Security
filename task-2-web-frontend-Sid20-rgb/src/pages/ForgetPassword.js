import React, { useState } from "react";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [password, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handleSendToken = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/users/password-recovery/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Token sent successfully!");
        setError(null);
        setToken("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to send token");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Token sending error:", error);
      setError("An unexpected error occurred");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckToken = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:3001/users/password-recovery/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, token }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Password recovery successful!");
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to recover password");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      setError("An unexpected error occurred");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md">
      <h2 className="text-2xl font-bold mb-4">Forget Password</h2>
      {error && <p className="text-pale-red">{error}</p>}
      {successMessage && <p className="text-pale-green">{successMessage}</p>}
      <form className="flex flex-col">
        <label className="mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border p-2 rounded-md"
            required
          />
        </label>
        {token === null ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleSendToken}
            disabled={loading}
          >
            Send Token
          </button>
        ) : (
          <>
            <label className="block text-[#305973] text-3xl texts">Token</label>
            <input
              type="text"
              placeholder="Enter the token from your email"
              value={token}
              onChange={handleTokenChange}
              className="border border-gray-400 p-2 rounded-md mb-4"
            />

            <label className="block text-[#305973] text-3xl texts">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={handleNewPasswordChange}
              className="border border-gray-400 p-2 rounded-md mb-4"
            />

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleCheckToken}
              disabled={loading}
            >
              Recover Password
            </button>
          </>
        )}
        {/* <button
          type="submit"
          className="bg-green-500 text-white rounded-md p-2 cursor-pointer"
        >
          Reset Password
        </button> */}
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
