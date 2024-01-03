import React from "react";
import Logo from "../assets/images/logo.png";

const SignupPage = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div
        className="md:w-[55%] h-screen hidden md:block bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80')",
        }}
      ></div>

      <div className="md:w-[50%] md:absolute md:right-0 md:h-full bg-[#150752] flex flex-col justify-center items-center md:rounded-tl-3xl md:rounded-bl-3xl">
        <div className="p-8 max-w-md w-full mx-auto">
          <div className="mb-6 flex justify-center items-center">
            <img src={Logo} alt="Logo" className="w-[128px] mr-2" />
          </div>
          <div className="mb-6 flex justify-center items-center">
            <h2 className="text-white text-5xl font-semibold">Welcome</h2>
          </div>
          <div className="mb-6 flex justify-center items-center">
            <p className="text-white text-2xl font-semibold">Travel Far Blog Wide</p>
          </div>
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          
          <div className="mb-4">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
            />
          </div>
          
          <div className="flex items-center justify-center mt-auto">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded w-full focus:outline-none focus:shadow-outline"
              type="button"
            >
              Log In
            </button>
          </div>
          <div className="mt-4 text-white text-center">
            Don't have an account?{" "}
            <a
              className="text-blue-400 underline"
              href="/signup"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
