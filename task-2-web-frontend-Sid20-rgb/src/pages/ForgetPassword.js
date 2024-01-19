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
    <div className="flex min-h-screen">
      {/* Left side: Form */}
      <div className="flex-1 flex items-center justify-center bg-[#047683]">
        <div className="max-w-xl w-full p-6 border rounded-md bg-gray-100 bg-opacity-80">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#047683]">
            Forget Your Password?
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
          <form className="flex flex-col">
            <label className="mb-4">
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
                className="bg-[#E3536D] text-white px-4 py-2 rounded-md"
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
                  className="bg-[#E3536D] text-white px-4 py-2 rounded-md"
                  onClick={handleCheckToken}
                  disabled={loading}
                >
                  Recover Password
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Right side: GIF */}
      <div className="flex-1 bg-cover bg-center" style={{ backgroundImage: `url('https://i.pinimg.com/originals/95/c4/32/95c432ec12a48c48e6ba23ba8fd26311.gif')` }}></div>
    </div>
  );
};

export default ForgetPasswordPage;
