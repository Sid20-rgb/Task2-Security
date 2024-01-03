import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import FavouriteBlog from "./FavouriteBlog";

const FavoriteBlogs = ({ showUserProfile }) => {
  const { user: currentUser } = useContext(UserContext);

  return (
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
  );
};

export default FavoriteBlogs;
