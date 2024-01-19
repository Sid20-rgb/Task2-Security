import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import FavouriteBlog from "./FavouriteBlog";

const FavoriteBlogs = ({ showUserProfile }) => {
  const { user: currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  return (
    <>
      {currentUser ? (
        <div className={`${showUserProfile ? "hidden" : "block"}`}>
          {currentUser?.data[0].bookmarkedBlogs.length === 0 ? (
            <p className="mt-[180px] font-medium text-center md-2:text-lg">
              Your haven't bookmarked any books{" "}
              <span className="text-purple-lighter">yet</span>.
            </p>
          ) : (
            <div className="grid grid-cols-2 items-stretch gap-4 mt-[180px] px-4 pb-14 lg:pb-0">
              {currentUser?.data[0].bookmarkedBlogs.map((blogId) => (
                <FavouriteBlog key={blogId} bookId={blogId} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex min-w-[calc(100vw_-_50px)] md:min-w-[calc(100vw_-_560px)]
        items-center justify-center h-screen bg-gray-800 text-white"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">404 Error Page</h1>
            <p className="text-lg mb-8">
              Oops! The page you're looking for doesn't exist.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FavoriteBlogs;
