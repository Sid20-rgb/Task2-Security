import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const IndividualUserPosts = () => {
  const currentUserId = localStorage.getItem("userIdForExplore");
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/blogs/user/${currentUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBlogs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [blogs]);

  console.log(blogs);

  return (
    <div className=" mt-[180px] z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 xl:grid-cols-4">
      {blogs.map((blog) => (
        <div
          className="relative rounded-lg shadow-lg mb-4 max-h-[16rem]"
          onClick={() => {
            navigate(`/blogDetails`, { state: { blog } });
          }}
        >
          <img
            src={
              blog.blogCover == null
                ? "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                : `http://localhost:3001/uploads/${blog.blogCover}`
            }
            alt="Blog Cover"
            className="w-full h-full rounded-lg object-cover hover:opacity-60 hover:brightness hover:bg-black transition duration-300 ease-in-out"
          />

          <div className="absolute z-20 bottom-0 left-0 px-4">
            <p className="text-white font-semibold">{blog.title}</p>
            <p className="text-white text-sm font-medium">{blog.description}</p>
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

export default IndividualUserPosts;
