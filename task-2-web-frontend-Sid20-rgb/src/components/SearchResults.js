import React, { useState } from "react";
import Blog from "./Blog";

const SearchResults = ({
  showUserProfile,
  searchResults,
  userInfo,
  fetchUserInfo,
}) => {
  const [users, setUsers] = useState([]);

  return (
    <div
      className={`${
        showUserProfile ? "hidden" : "block"
      } mt-[200px] grid grid-cols-2 items-stretch gap-4 mt-[180px] px-4 pb-14 lg:pb-0 `}
    >
      {searchResults.length === 0 ? (
        <div className="w-full flex justify-center">
          <p className="font-medium">
            No <span className="text-purple-lighter">blogs</span> found. 😟
          </p>
        </div>
      ) : (
        searchResults.map((result, index) => (
          <Blog
            blog={result}
            key={index}
            userInfo={userInfo}
            fetchUserInfo={fetchUserInfo}
          />
        ))
      )}
    </div>
  );
};

export default SearchResults;
