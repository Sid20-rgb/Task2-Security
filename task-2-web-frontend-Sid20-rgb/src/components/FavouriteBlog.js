import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const FavouriteBlog = ({ bookId }) => {
  const [blog, setBlog] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user: currentUser, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/blogs/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setBlog(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [blog]);

  const favBlog = blog.filter((blogg) => blogg._id === bookId);

  useEffect(() => {
    if (currentUser) {
      setIsBookmarked(
        currentUser?.data[0].bookmarkedBlogs.includes(favBlog[0]?._id)
      );
    }
  }, [currentUser, favBlog[0]?._id]);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle case when user is not logged in
        return;
      }

      if (isBookmarked) {
        // Remove bookmark
        await axios.delete(
          `http://localhost:3001/blogs/bookmark/${favBlog[0]?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => ({
          ...prevUser,
          data: [
            {
              ...prevUser.data[0],
              bookmarkedBlogs: prevUser.data[0].bookmarkedBlogs.filter(
                (blogId) => blogId !== favBlog[0]?._id
              ),
            },
          ],
        }));
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await axios.post(
          `http://localhost:3001/blogs/bookmark/${favBlog[0]?._id}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser((prevUser) => ({
          ...prevUser,
          data: [
            {
              ...prevUser.data[0],
              bookmarkedBlogs: [
                ...prevUser.data[0].bookmarkedBlogs,
                favBlog[0]?._id,
              ],
            },
          ],
        }));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  // console.log(bookId);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/blogs/${bookId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })
  //     .then((response) => {
  //       setBlog(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [blog]);

  return (
    <div
      className="relative rounded-lg shadow-lg mb-4 max-h-[16rem]"
      onClick={() => {
        navigate(`/blogDetails`);
        localStorage.setItem("blogData", JSON.stringify(favBlog[0]));
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 rounded-lg"></div>

      <img
        src={`http://localhost:3001/uploads/${favBlog[0]?.blogCover}`}
        alt="Blog Cover"
        className="w-full h-full rounded-lg object-cover hover:opacity-60 hover:brightness hover:bg-black transition duration-300 ease-in-out"
      />

      <div className="absolute top-0 left-0 p-4">
        <div className="flex items-center">
          <img
            src="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-2">
            <h3 className="font-bold text-white">
              @{favBlog[0]?.user?.username}
            </h3>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-gray-300">{favBlog[0]?.date}</p>
        <h4 className="text-white mt-2">{favBlog[0]?.title}</h4>
      </div>

      {/* Bookmark Icon */}
      <button
        onClick={handleBookmarkClick}
        className={`absolute top-4 right-4 w-8 h-8 rounded-full ${
          isBookmarked ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        {/* Your bookmark icon SVG */}
        {isBookmarked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            width="24"
            height="24"
          >
            {/* Your bookmark icon SVG path */}
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 20.85L12 17.66l-7 3.2V4h14z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="24"
            height="24"
          >
            {/* Your non-isBookmarked icon SVG path */}
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M17 2H7c-1.1 0-2 .9-2 2v16l7-3 7 3V4c0-1.1-.9-2-2-2zm0 16l-5-2.18L7 18V4h10v14z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FavouriteBlog;
