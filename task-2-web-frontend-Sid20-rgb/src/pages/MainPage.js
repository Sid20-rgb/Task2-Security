import axios from "axios";
import React, { useEffect, useState } from "react";
import BlogsList from "../components/BlogsList";
import Explore from "../components/Explore";
import FavoriteBlogs from "../components/Favorite";
import IndividualUserPosts from "../components/IndividualUserPosts";
import SearchResults from "../components/SearchResults";
import NavigationBar from "../components/common/navigation";
import UserProfile from "./Userprofile";
import "./style.css"; // Import the style.css file


const MainPage = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [showUploads, setShowUploads] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    // Fetch search results whenever searchQuery changes
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/blogs/search?query=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Search results fetched successfully");
          setSearchResults(response.data);
        } else {
          console.error("Failed to fetch search results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (searchQuery !== "") {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  console.log(searchResults);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ); // Replace with your API endpoint for fetching user information
      if (response.status === 200) {
        const userData = response.data;
        setUserInfo(userData);
      } else {
        console.error("Failed to fetch user information");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery !== "") {
      handleTabClick("searchResults");
    } else {
      handleTabClick("blogs");
    }
  };

  const tabConfig = {
    blogs: {
      body: (
        <BlogsList
          showUserProfile={showUserProfile}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
    explore: {
      body: (
        <Explore
          showUserProfile={showUserProfile}
          handleTabClick={handleTabClick}
        />
      ),
    },
    favoriteblogs: {
      body: <FavoriteBlogs showUserProfile={showUserProfile} />,
    },
    individualUserPosts: {
      body: <IndividualUserPosts showUserProfile={showUserProfile} />,
    },
    searchResults: {
      body: (
        <SearchResults
          searchResults={searchResults}
          userInfo={userInfo}
          fetchUserInfo={fetchUserInfo}
        />
      ),
    },
  };

  const { body } = tabConfig[activeTab];

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

  const handleProfileClick = () => {
    setShowUploads(!showUploads);
  };

  return (
    <div
      className={`bg-[#1F2937] flex flex-col lg:flex-row lg:justify-between lg:items-stretch mb-0 ${
        isSmallScreen ? "flex-col" : ""
      }`}
    >
      <NavigationBar
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        handleTabClick={handleTabClick}
      />
      {/* Navigation Bar */}

      {/* Main Content */}
      <div className="z-20 lg:flex-1 lg:ml-[7rem] lg:mr-[25rem] bg-gray-100 flex flex-col items-center mb-0">
        {/* Search Box */}
        <div
          className={`${
            showUserProfile ? "hidden lg:block" : "block"
          } fixed top-0 z-20 bg-gray-800 border-b-2 border-gray-300 w-full p-4 lg:w-full lg:left-0 lg:ml-[7rem] lg:mr-[25rem]`}
        >
          <div className="flex items-center justify-start mb-2">
            <div className="border-r-4 border-[#791616] h-8 mr-4 mb-4"></div>
            <form
              className="relative w-full ml-0"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                className="search-bar outline-none border-none text-white bg-transparent w-full mb-4 text-[20px]"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
          </div>

          <h2 className="text-4xl mb-2 text-white">Blogs</h2>

          <div className="border-b-4 border-solid border-[#791616] w-[6rem] mb-4"></div>
        </div>

        <div
          className={`${
            showUserProfile ? "hidden lg:grid" : "block"
          } min-h-screen pt-3 pb-6`}
        >
          {body}
        </div>
      </div>

      {/* User Profile */}
      <div
        className={`relative user-profile ${
          showUserProfile ? "block" : "hidden lg:block"
        }  relative lg:z-30 lg:w-[25rem] lg:fixed lg:right-0 lg:mt-0 lg:top-0 lg:h-full bg-gray-200 rounded-tl-3xl rounded-bl-3xl ${
          showUploads ? "show" : "hide"
        }`}
      >
        <UserProfile
          showUploads={showUploads}
          handleProfileClick={handleProfileClick}
        />
      </div>
    </div>
  );
};

export default MainPage;