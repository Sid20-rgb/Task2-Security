import axios from "axios";
import { Link } from "react-router-dom";
// import Bg from "../assets/images/bg2.jpg";
import Logo from "../assets/images/logo.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useState } from "react";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignin = (e) => {
    e.preventDefault();

    // Perform form validation
    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    // setIsLoading(true); // Set isLoading to true before making the API call

    axios
      .post("http://localhost:3001/users/login", { username, password })
      .then((response) => {
        console.log(response);
        localStorage.setItem("token", response.data.token);
        // Assuming the user data is returned in the response
        const user = response.data.user;
        // setUser(user);
        // setIsLoading(false); // Set isLoading to false after the API call is completed
        window.location.href = "/homepage";
      })
      .catch((err) => {
        setError(err.response.data.error);
        // setIsLoading(false); // Set isLoading to false after the API call is completed
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
            <h2 className="text-white text-5xl font-semibold">Welcome</h2>
          </div>
          <div className="mb-6 flex justify-center items-center">
            <p className="text-white text-[20px] font-semibold">
              Travel Far Blog Wide
            </p>
          </div>

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
              onChange={handleUsernameChange}
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
              onChange={handlePasswordChange}
            />
          </div>

          <div className="text-right mt-2">
              <a href="/" className="text-s font-medium text-[white] texts">
                Forgot Password?
              </a>
            </div>
          
          <div className="flex items-center justify-center mt-auto">
            {/* <Link to='/homepage'> */}
              <Button text="Log In" 
              onClick={handleSignin}
              />
            {/* </Link> */}
          </div>
          <div className="mt-4 text-white text-center">
            Don't have an account?{" "}
            <a
              className="text-blue-400 underline"
              href="/homepage"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
