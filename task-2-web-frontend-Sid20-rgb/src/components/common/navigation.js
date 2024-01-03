import React, { useEffect, useState } from "react";
import { FaCompass, FaHome, FaPlus, FaStar, FaUser } from "react-icons/fa";

export default function NavigationBar({
  showUserProfile,
  setShowUserProfile,
  handleTabClick,
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600 && window.innerHeight < 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // {/* Navigation Bar */}
    <div
      className={`fixed w-full z-40 bottom-0 lg:w-[7rem] lg:fixed lg:left-0 lg:top-0 lg:h-full lg:flex lg:flex-col lg:justify-center bg-gray-200 mb-0  ${
        isSmallScreen ? "order-last" : ""
      }`}
    >
      <nav className="flex justify-between lg:flex-col">
        <a
          href="#"
          className="p-4 flex items-center lg:flex-col"
          onClick={() => {
            handleTabClick("blogs");
            setShowUserProfile(false);
          }}
        >
          <FaHome className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block text-center">Home</p>
        </a>
        <a
          className="p-4 flex items-center lg:flex-col"
          onClick={() => {
            handleTabClick("explore");
            setShowUserProfile(false);
          }}
        >
          <FaCompass className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block text-center">Explorer</p>
        </a>
        <a
          className="p-4 flex items-center lg:flex-col"
          onClick={() => {
            handleTabClick("favoriteblogs");
            setShowUserProfile(false);
          }}
        >
          <FaStar className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block text-center">Favorite Blogs</p>
        </a>

        {/* <a
          href="#"
          className="p-4 flex items-center lg:flex-col"
          onClick={() => console.log("Favorite Blogs clicked")}
        >
          <FaStar className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block text-center">Favorite Blogs</p>
        </a> */}
        <a href="/uploadpage" className="p-4 flex items-center lg:flex-col">
          <FaPlus className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block text-center">Create Blog</p>
        </a>
        <a
          href="#"
          className="p-4 flex items-center lg:hidden lg:flex-col"
          onClick={() => setShowUserProfile(!showUserProfile)}
        >
          <FaUser className="mr-2 w-5 h-5 transition-transform hover:scale-110 hover:text-[#047683]" />
          <p className="hidden lg:block lg:flex-col text-center">Settings</p>
        </a>
      </nav>
    </div>
  );
}
