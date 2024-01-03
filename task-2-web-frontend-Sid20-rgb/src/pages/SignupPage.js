import axios from "axios";
// import Bg from "../assets/images/bg2.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import Logo from "../assets/images/logo.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Assess password strength
    const passwordScore = zxcvbn(password);
    setPasswordStrength(passwordScore.score);

    // // Check if password meets complexity requirements
    // if (passwordScore.score < 2) {
    //   setError("Password is too weak. Please choose a stronger password.");
    //   return;
    // }

    axios
      .post("http://localhost:3000/users/register", {
        username,
        email,
        password,
      })
      .then((response) => {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessage(response.data.message);
        window.location.href = "/signin";
        // setIsLoading(false);
        window.location.href = "/login";
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
        // setIsLoading(false);
      });
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "yellow";
      case 3:
        return "green";
      case 4:
        return "dark-green";
      default:
        return "";
    }
  };

  const handlePasswordChange = (e) => {
    // Update password state
    setPassword(e.target.value);

    // Assess password strength on each input change
    const passwordScore = zxcvbn(e.target.value);
    setPasswordStrength(passwordScore.score);
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-[#047683]">
      <div
        className="relative md:w-[55%] min-h-[110vh] hidden md:block bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/originals/95/c4/32/95c432ec12a48c48e6ba23ba8fd26311.gif')",
        }}
      ></div>

      <div
        className="bg-[#047683] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12
          flex items-center justify-center my-4 rounded-l-lg" // Added rounded-l-lg class
      >
        <div className="w-full h-fit">
          <div className="mb-6 flex justify-center items-center">
            <img src={Logo} alt="Logo" className="w-[128px] mr-2" />
          </div>
          <div className="mb-6 flex justify-center items-center">
            <h2 className="text-white text-5xl font-semibold">Get Started</h2>
          </div>
          <div className="mb-6 flex justify-center items-center">
            <p className="text-white text-[20px] font-semibold">
              Travel Far Blog Wide
            </p>
          </div>

          <span className="text-red-500 pb-8 text-sm">{error}</span>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <Input
              type="text"
              placeholder="Enter your username"
              autoFocus
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              autoFocus
              required
              value={password}
              onChange={handlePasswordChange}
            />
            {password.length > 0 && (
              <div className="text-sm text-white">
                Password Strength:{" "}
                <span
                  className={`text-${getPasswordStrengthColor(
                    passwordStrength
                  )}`}
                >
                  {getPasswordStrengthLabel(passwordStrength)}
                </span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              autoFocus
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center mt-auto">
            {/* <Link to='/login'> */}
            <Button
              text="REGISTER"
              // isLoading={isLoading}
              onClick={handleSignup}
            />
            {/* </Link> */}
          </div>

          <div className="flex items-center text-[#ffffff] justify-center mt-5">
            {/* <Link to='/login'> */}
            <Button
              text="Continue as Guest"
              // isLoading={isLoading}
              bgColor="172678"
              hoverBgColor="123456"
              textColor="000"
              onClick={() => navigate("/")}
            />
            {/* </Link> */}
          </div>
          <div className="mt-4 text-white text-center">
            Already have an account?{" "}
            <a className="text-blue-400 underline" href="/login">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
