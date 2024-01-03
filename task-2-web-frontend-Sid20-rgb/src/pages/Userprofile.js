import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const UserProfile = ({ showUploads }) => {
  const { user, setUser } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/blogs/`, {
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

  const userUploadedBlogs = blogs.filter(
    (blog) => blog.user.id === user?.data[0].id
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/users/uploadImage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Profile picture uploaded successfully");
        setUser({ ...user, image: response.data.data });
        window.location.reload();
      } else {
        console.log("Failed to upload profile picture");
      }
    } catch (error) {
      console.log("Failed to upload profile picture", error);
    }
  };

  return (
    <div>
      <div className="fixed w-full top-0">
        <div className="bg-[#1F2937] flex items-center rounded-tl-3xl justify-end pt-2 lg:bg-[#e5e7eb] pr-4 mb-2">
          <div className="ml-2">
            <h3 className="font-bold text-white lg:text-black">
              Hi, {user?.data[0].username}
            </h3>
          </div>
          <Link to="/updateProfile">
            <img
              src={
                user?.data[0].image == null
                  ? "https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
                  : `http://localhost:3001/uploads/${user?.data[0].image}`
              }
              alt="Profile"
              className="w-12 h-12 rounded-full cursor-pointer ml-2"
            />
          </Link>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col items-center mb-4">
          <label htmlFor="profile-image">
            <img
              id="profile-img"
              src={
                user?.data[0].image == null
                  ? "https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
                  : `http://localhost:3001/uploads/${user?.data[0].image}`
              }
              alt="Profile"
              className="w-28 h-28 rounded-full cursor-pointer mb-2"
            />
          </label>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <div className="ml-2 mb-2">
            <h3 className="font-bold text-center text-white lg:text-black">
              {user?.data[0].username}
            </h3>
            <p className="text-gray-500 text-center">{user?.data[0].email}</p>
          </div>

          <button
            className="bg-[#4caf4fd0] px-4 font-semibold py-1.5 rounded-md transition-colors duration-300 hover:bg-[#4caf50]"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("blogData");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-[#1F2937] absolute top-[300px] bottom-0 left-0 right-0">
        <div
          className="max-h-[calc(100vh-300px)] px-4 bg-[#1F2937]
     overflow-y-auto overscroll-y-auto custom-scrollbar pb-14 lg:pb-0"
        >
          <div className="sticky top-0 bg-[#1F2937] py-2 z-10">
            <h2 className="text-xl font-bold mb-0 text-white">Your Upload</h2>
            <div className="border-b-4 border-solid border-[#791616] w-2/5 mb-4"></div>
          </div>

          {userUploadedBlogs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-white text-lg font-medium">
                You haven't uploaded any blogs yet
              </p>
            </div>
          )}

          {userUploadedBlogs?.map((blog) => (
            <div
              className={`relative flex flex-col ${
                showUploads ? "show" : "hide"
              }`}
              onClick={() => {
                navigate(`/blogDetails`);
                localStorage.setItem("blogData", JSON.stringify(blog));
              }}
            >
              <div className="relative rounded-lg shadow-lg mb-4">
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 rounded-lg"></div>

                <FaEdit
                  className="absolute z-50 top-3 right-14 text-white w-6 h-6 cursor-pointer transition duration-300 hover:scale-[1.1]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update/${blog._id}`);
                  }}
                />

                <FaTrash
                  className="absolute z-50 top-3 right-4 text-white w-6 h-6 cursor-pointer transition duration-300 hover:scale-[1.1]"
                  onClick={async (e) => {
                    e.stopPropagation();

                    try {
                      const response = await axios.delete(
                        `http://localhost:3001/blogs/${blog._id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );

                      if (response.status === 200) {
                        console.log("Blog deleted successfully");
                        // window.location.reload();
                      } else {
                        console.log("Failed to delete blog");
                      }
                    } catch (error) {
                      console.log("Failed to delete blog", error);
                    }
                  }}
                />

                <img
                  src={`http://localhost:3001/uploads/${blog.blogCover}`}
                  alt="Blog Cover"
                  className="w-full max-h-[230px] object-cover rounded-lg opacity-35 hover:opacity-60 hover:brightness hover:bg-black transition duration-300 ease-in-out"
                />

                <div className="absolute top-0 left-0 p-4">
                  <div className="flex items-center"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-gray-300">{blog.date.substring(0, 10)}</p>
                  <h4 className="text-white mt-2">{blog.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;