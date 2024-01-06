import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Blog from "./Blog";

const BlogsList = ({ showUserProfile, userInfo, fetchUserInfo }) => {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/blogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setBlogs(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  // Filter blogs array to show only posts of other people
  const filteredBlogs = blogs.filter(
    (blog) => blog.user.id !== user?.data[0].id
  );

  console.log(showUserProfile);

  return (
    <div
      className={`${
        showUserProfile ? "hidden lg:grid" : "block"
      } grid grid-cols-2 items-stretch gap-4 mt-[180px] px-4 pb-14 lg:pb-0 `}
    >
      {filteredBlogs.length === 0 ? (
        <div>
          <p className="font-medium">
            No <span className="text-purple-lighter">books</span> available. 😟
          </p>
        </div>
      ) : (
        filteredBlogs.map((blog, index) => (
          <Blog
            blog={blog}
            key={index}
            userInfo={userInfo}
            fetchUserInfo={fetchUserInfo}
          />
        ))
      )}
    </div>
  );
};

export default BlogsList;