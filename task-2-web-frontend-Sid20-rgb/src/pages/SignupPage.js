import axios from "axios";
// import Bg from "../assets/images/bg2.jpg";
import { useState } from "react";
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

  const handleSignup = (e) => {
    e.preventDefault();

    // setIsLoading(true);

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
              onChange={(e) => setPassword(e.target.value)}
            />
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
